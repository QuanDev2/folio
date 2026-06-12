# Feature: Semantic Search over Posts (LLM/RAG)

End-user search that matches **meaning**, not exact words. Looks like a normal
search box; smarter results underneath. Built in phases so each ships as a working
product and a separate resume bullet. No phase throws away the previous one.

- **Phase 0 (v1):** text RAG over `title + tags + body`.
- **Phase 1 (incremental):** vision captions → image content becomes searchable text.
- **Phase 2 (incremental):** multimodal/CLIP embeddings → search actual pixels + reverse-image search.

Scale note: Pholio is thousands of posts, not millions. `pgvector` on the Postgres
you already run is enough for all three phases. Do **not** add Pinecone/Weaviate yet.

---

## Phase 0 — Text RAG (build this first)

### 1. Schema: add an embedding column

Enable pgvector once, then store one vector per post.

```sql
CREATE EXTENSION IF NOT EXISTS vector;
-- dimension must match your embedding model (e.g. 1536 for OpenAI text-embedding-3-small)
ALTER TABLE "Post" ADD COLUMN embedding vector(1536);
CREATE INDEX ON "Post" USING ivfflat (embedding vector_cosine_ops);
```

Prisma doesn't natively type `vector`. Options: keep it as `Unsupported("vector")`
in the schema and write raw SQL for the vector ops, or use the `pgvector` Node helper.
Either way the embedding read/write happens via `$queryRaw` / `$executeRaw`.

### 2. Build the text to embed

Embed the **whole bundle**, not just body. Photographers write thin bodies; title +
tags carry the signal when the body is empty.

```
embedInput = `${title}\n\nTags: ${tags.join(", ")}\n\n${plainTextBody}`
```

`body` is Tiptap JSON — flatten it to plain text first (walk the doc, concat text nodes).

### 3. Embed on publish (and on edit)

When a post is published or its text changes:

```ts
const input = buildEmbedInput(post);
const embedding = await embed(input);            // one API call → number[]
await db.$executeRaw`UPDATE "Post" SET embedding = ${toVector(embedding)} WHERE id = ${post.id}`;
```

Do it in your existing BullMQ queue, not inline on the request — embedding is a
network call and shouldn't block publish. (Bonus: shows async/worker design.)

Backfill once for existing posts: a script that loops all published posts and embeds them.

### 4. Search endpoint

```ts
// GET /api/search?q=moody night street
const qVec = await embed(query);
const results = await db.$queryRaw`
  SELECT id, title, slug, 1 - (embedding <=> ${toVector(qVec)}) AS score
  FROM "Post"
  WHERE published = true AND embedding IS NOT NULL
  ORDER BY embedding <=> ${toVector(qVec)}   -- <=> = cosine distance
  LIMIT 20;
`;
```

`<=>` is pgvector's cosine-distance operator. Lower distance = more similar. Wire
this into the existing `/explore` search box; the UI doesn't change.

### 5. Gotchas to handle
- **Empty query** → fall back to your normal recency/keyword sort, don't embed "".
- **Model dim mismatch** → the `vector(N)` size must equal your model's output dim.
- **Cost/latency** → query embedding is one small call (~tens of ms). Cache identical
  recent queries if you want.
- **Hybrid is better than pure semantic** for short keyword queries — consider
  combining vector score with a plain `ILIKE`/full-text score later. Not required for v1.

**Resume bullet:** *"Built semantic search with embeddings + pgvector over user posts;
async embedding pipeline on BullMQ."*

---

## Phase 1 — Vision captions (incremental, Approach A)

Make the **photo content** searchable without changing the search pipeline at all.
The image gets turned into text, then flows through the exact Phase-0 path.

### How
At upload (after the S3 put), run the photo through a vision model and store a
generated description:

```ts
const caption = await describeImage(photoUrl);
// "a man in a red coat walking through heavy rain at night, neon reflections, low-key lighting"
await db.photo.update({ where: { id }, data: { aiCaption: caption } });
```

Then add the post's photo captions to the embed bundle from Phase 0 step 2:

```
embedInput = title + tags + body + photoCaptions.join("\n")
```

Re-embed the post. Now `sunset` finds a sunset photo even if the caption the user
wrote was just "finally."

### Notes
- One vision call per uploaded photo, **once**, at upload. Cheap, async via BullMQ.
- Quality is capped by caption quality — if the model misses the dog, the dog isn't
  searchable. Acceptable for this phase.
- Free side benefit: `aiCaption` doubles as **alt-text** for accessibility.

**Resume bullet:** *"Added vision-model captioning so image content is searchable;
reused the existing embedding pipeline."*

---

## Phase 2 — Multimodal / CLIP embeddings (incremental, Approach B)

True image search: embed images and text into the **same vector space** so a text
query compares directly against image vectors — no captioning middleman. Unlocks
**reverse-image search** ("find photos like this one") almost for free.

### How
- Add a second embedding store for images (e.g. `Photo.imageEmbedding vector(512)`),
  produced by a CLIP-style / multimodal embedding model.
- At search time, embed the **text query with the same multimodal model**, then run
  similarity against `Photo.imageEmbedding`.
- Merge/blend with the Phase-0 text score (a post ranks on both its text and its photos).

### Why it's a separate phase, not the start
- New model + new vector store = a second unfamiliar thing to debug. Don't stack it
  on top of first-time RAG.
- Text-vs-image similarity behaves differently than text-vs-text; needs threshold tuning.

### Reverse-image search (drops out of this phase)
Given a photo's `imageEmbedding`, find nearest neighbors → "similar photos / similar
photographers." Same `<=>` query, image vector instead of query vector.

**Resume bullet:** *"Built multimodal (CLIP) search over images + text in a shared
embedding space, including reverse-image lookup."*

---

## Sequencing summary

| Phase | What | Difficulty | New infra | Ships as |
|---|---|---|---|---|
| 0 | Text RAG (title+tags+body) | Low-Med | pgvector column | Working search |
| 1 | Vision captions → searchable images | Low | none (reuses 0) | Better recall + free alt-text |
| 2 | CLIP multimodal + reverse-image | Med | image embedding store | "Real" image search |

Each row is independently shippable. Stop after any of them and you still have a
working feature. Don't start at Phase 2.

## Roadmap placement
This is a **Phase 2 / post-core** feature. Core post CRUD, auth, S3 upload, and the
`/explore` filter must be solid first. Bolting search on before the data model is
stable is wasted work — the embedding bundle depends on the final shape of Post.
