import postsData from '../../data/posts.json'
import PostCard from './PostCard'
import TagFilters from '../TagFilters'
import SearchInput from '../SearchInput'
import SortDropdown from '../SortDropdown'
import usePostFilter from '../../hooks/usePostFilter'

export default function PostFeed() {
  const publishedPosts = postsData.filter((post) => post.published)
  const { filters, tags, hasActiveFilters, sortedPosts, dispatch } =
    usePostFilter(publishedPosts)

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
          onSortOrderChange={(sort) =>
            dispatch({ type: 'SET_SORT', sort: sort as 'newest' | 'oldest' })
          }
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
    </div>
  )
}
