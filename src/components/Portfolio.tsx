import { useParams } from 'react-router-dom'
import postsData from '../data/posts.json'
import PostCard from './posts/PostCard'
import { useCurrentUser } from '../context/CurrentUserContext'

export default function Portfolio() {
  const { username: paramUsername } = useParams()
  const { user: loggedInUser } = useCurrentUser()
  const isOwner = paramUsername === loggedInUser?.username

  const userPosts = postsData.filter(
    (post) =>
      post.authorUsername === paramUsername && (post.published || isOwner)
  )

  return (
    <div>
      <div id='profile-header'>
        <div>username: {paramUsername}</div>
        <div>post count: {userPosts.length}</div>
      </div>
      <div
        id='portfolio-content'
        className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3'
      >
        {userPosts.length ? (
          <>
            {userPosts.map((post) => (
              <PostCard key={post.id} post={post}></PostCard>
            ))}
          </>
        ) : (
          `No posts yet`
        )}
      </div>
    </div>
  )
}
