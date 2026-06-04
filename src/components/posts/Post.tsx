import { useParams, useNavigate } from 'react-router-dom'
import { useState, useRef } from 'react'
import postsData from '../../data/posts.json'
import type { Photo, Post } from '../../types'
import Lightbox from './Lightbox'

export default function Post() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [lightboxIdx, setLightboxIdx] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const photoRef = useRef<HTMLButtonElement>(null)

  const post = postsData.find((x) => x.slug === slug) as Post | undefined

  if (!post) {
    return (
      <div className='flex min-h-[60vh] items-center justify-center text-zinc-400'>
        Post not found.
      </div>
    )
  }

  const coverPhoto =
    post.photos.find((p) => p.id === post.coverPhotoId) ?? post.photos[0]

  const formattedDate = new Intl.DateTimeFormat('en', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(post.createdOn))

  const handlePhotoBtnOnClick = (
    photo: Photo,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    setIsLightboxOpen(true)
    setLightboxIdx(post.photos.indexOf(photo))
    photoRef.current = e.currentTarget
  }

  return (
    <>
      <div className='mx-auto max-w-3xl px-4 py-10'>
        <button
          onClick={() => navigate(-1)}
          className='-mx-1 mb-6 flex cursor-pointer items-center gap-1.5 px-1 py-2 text-sm text-zinc-500 hover:text-zinc-900'
        >
          ← Back
        </button>

        <img
          src={coverPhoto.url}
          alt={coverPhoto.alt}
          className='w-full rounded-xl object-cover'
        />

        <div className='mt-6'>
          <h1 className='text-2xl font-bold text-zinc-950'>{post.title}</h1>

          <div className='mt-3 flex flex-wrap items-center gap-3 text-sm text-zinc-500'>
            <span>@{post.authorUsername}</span>
            <span>·</span>
            <span>{formattedDate}</span>
            {post.tags.map((tag) => (
              <span
                key={tag}
                className='rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-700'
              >
                {tag}
              </span>
            ))}
          </div>

          <p className='mt-6 text-base leading-relaxed text-zinc-700'>
            {post.bodyText}
          </p>
        </div>

        {post.photos.length > 0 && (
          <div className='mt-10 grid gap-4 sm:grid-cols-2'>
            {post.photos.map((photo) => (
              <button
                key={photo.id}
                onClick={(e) => handlePhotoBtnOnClick(photo, e)}
              >
                <img
                  src={photo.url}
                  alt={photo.alt}
                  className='w-full rounded-lg object-cover'
                />
              </button>
            ))}
          </div>
        )}
      </div>
      {isLightboxOpen && (
        <Lightbox
          photos={post.photos}
          currIdx={lightboxIdx}
          onNext={() =>
            setLightboxIdx(Math.min(lightboxIdx + 1, post.photos.length - 1))
          }
          onPrev={() => setLightboxIdx(Math.max(lightboxIdx - 1, 0))}
          onClose={() => setIsLightboxOpen(false)}
          triggerRef={photoRef}
        ></Lightbox>
      )}
    </>
  )
}
