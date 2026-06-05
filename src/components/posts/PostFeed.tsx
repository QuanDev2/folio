import PostCard from './PostCard'
import TagFilters from '../TagFilters'
import SearchInput from '../SearchInput'
import SortDropdown from '../SortDropdown'
import usePostFilter from '../../hooks/usePostFilter'
import { useInfiniteQuery } from '@tanstack/react-query'
import type { Post } from '../../types'
import { useEffect, useRef } from 'react'

export default function PostFeed() {
  const PAGE_LIMIT = 12
  // infinite scroll
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam }) =>
      fetch(
        `http://localhost:3001/posts?_page=${pageParam}&_per_page=${PAGE_LIMIT}`
      ).then((r) => r.json()),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.next ?? undefined
    }
  })

  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    console.log('Use effect')
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage()
      }
    })

    if (sentinelRef.current) {
      console.log('start observing')
      observer.observe(sentinelRef.current)
    }

    return () => observer.disconnect()
  }, [hasNextPage, fetchNextPage])

  const posts: Post[] = data?.pages.flatMap((page) => page.data) ?? []

  const publishedPosts = posts.filter((post) => post.published)
  const { filters, tags, hasActiveFilters, sortedPosts, dispatch } =
    usePostFilter(publishedPosts)

  if (isLoading) return <p>beep... bop... page loading...</p>
  if (isError) return <p>oops.. Something went wrong</p>

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm md:flex-row md:items-end md:justify-between'>
        <SearchInput
          searchQuery={filters.search}
          onSearchQueryChange={(search) =>
            dispatch({ type: 'SET_SEARCH', search })
          }
        />
        <TagFilters
          tags={tags}
          selectedTag={filters.tag}
          onTagChange={(tag) => dispatch({ type: 'SET_TAG', tag })}
        />
        <SortDropdown
          sortOrder={filters.sort}
          onSortOrderChange={(sort) => dispatch({ type: 'SET_SORT', sort })}
        />
        <button
          type='button'
          disabled={!hasActiveFilters}
          onClick={() => dispatch({ type: 'CLEAR_ALL' })}
          className='h-11 w-full rounded-md border border-zinc-300 px-4 text-sm font-medium text-zinc-700 shadow-sm transition hover:border-teal-600 hover:text-teal-700 disabled:cursor-not-allowed disabled:border-zinc-200 disabled:text-zinc-400 disabled:shadow-none md:w-auto'
        >
          Clear all
        </button>
      </div>

      <p className='text-sm text-zinc-600'>
        Showing{' '}
        <span className='font-medium text-zinc-950'>{sortedPosts.length}</span>{' '}
        posts
      </p>

      <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
        {sortedPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      <div ref={sentinelRef} />
      {isFetchingNextPage && <p>Hang in there.. loading more...</p>}
    </div>
  )
}
