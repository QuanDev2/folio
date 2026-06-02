import type { Post } from '../../types'
import { Link } from 'react-router-dom'
interface Props {
  post: Post
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function PostCard({ post }: Props) {
  const coverPhoto =
    post.photos.find((p) => p.id === post.coverPhotoId) ?? post.photos[0]

  const formattedDate = new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(post.createdOn))

  return (
    <Link
      to={`/posts/${slugify(post.title)}`}
      className='overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md'
    >
      <img
        src={coverPhoto.url}
        alt={coverPhoto.alt}
        className='aspect-[4/3] w-full object-cover'
      />
      <div className='flex flex-col gap-3 p-4'>
        <div className='text-base font-semibold text-zinc-950'>
          {post.title}
        </div>
        <p className='line-clamp-2 text-sm text-zinc-500'>{post.bodyText}</p>
        <div className='flex flex-wrap items-center gap-2 text-xs text-zinc-500'>
          {post.tags[0] && (
            <span className='rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700'>
              {post.tags[0]}
            </span>
          )}
          <span>{formattedDate}</span>
        </div>
      </div>
    </Link>
  )
}
