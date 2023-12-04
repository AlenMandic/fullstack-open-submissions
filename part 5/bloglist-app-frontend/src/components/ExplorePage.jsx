import { useState, useEffect, React } from 'react'
import ExploreBlog from './ExploreBlog'

// Returns all blogs and who they belong to. IF someone is logged in, they can like the blog, increasing it's like counter by 1. Implementing infinite scrolling here would be great.
export default function ExplorePage({
  explorePageState,
  user,
  userLikedBlogs,
}) {
  const [publicBlogs, setPublicBlogs] = useState([])
  const [sorting, setSorting] = useState('default')

  // When our prop 'explorePageState' changes, we render the explore page. This is because we have to wait until the async function resolves the data; we can't set the state directly from the prop here. The initial state of the explorePageState is [], and this effect will run only once when the state changes from [] to the resolved data.
  useEffect(() => {
    setPublicBlogs(explorePageState)
  }, [explorePageState])

  if (publicBlogs.length === 0) {
    return <p>No blogs posted yet.</p>
  }

  const ourPublicBlogs = publicBlogs.map((blog) => blog)

  function compareBlogsByLikes(a, b) {
    return b.likes - a.likes
  }

  const getBlogsByLikes = ourPublicBlogs.sort(compareBlogsByLikes)

  const renderBlogsByLikes = (
    <ul>
      {getBlogsByLikes.map((blog) => (
        <ExploreBlog
          key={blog.id}
          blogObject={blog}
          user={user}
          userLikedBlogs={userLikedBlogs}
        />
      ))}
    </ul>
  )

  const renderBlogsByDefault = (
    <ul>
      {publicBlogs.map((blog) => (
        <ExploreBlog
          key={blog.id}
          blogObject={blog}
          user={user}
          userLikedBlogs={userLikedBlogs}
        />
      ))}
    </ul>
  )

  const returnSortedPage = sorting === 'default' ? renderBlogsByDefault : renderBlogsByLikes

  return (
    <div>
      <label>
        Sort by:
        <select value={sorting} onChange={(e) => setSorting(e.target.value)}>
          <option value="default">Default</option>
          <option value="likes">Highest Likes</option>
        </select>
      </label>
      {returnSortedPage}
      <h3>
        Thanks for browsing through our site. We hope you enjoyed your stay! 😄
      </h3>
    </div>
  )
}
