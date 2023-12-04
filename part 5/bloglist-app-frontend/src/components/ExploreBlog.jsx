import { useState, useEffect } from 'react'
import userLikeService from '../services/handleUserLikes'

export default function ExploreBlog({ blogObject, user, userLikedBlogs }) {

  const [showFullBlogs, setShowFullBlogs] = useState(false)
  //
  const [isLiked, setIsLiked] = useState(() => {
    const isThisLiked = userLikedBlogs.includes(blogObject.id)
    return isThisLiked
  })

  // Making sure liked posts state persists through page refresh.
  useEffect(() => {

    if(userLikedBlogs.includes(blogObject.id)) {
      setIsLiked(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLikedBlogs])

  function handleShowBlogs() {
    setShowFullBlogs(!showFullBlogs)
  }

  async function handleBlogLike() {
    if (!user) {
      alert('Please log in to like blogs.')
      return null
    }

    console.log('Fire like service for: ', blogObject.id)
    // Toggle the state based on the current state, not the previous state
    setIsLiked(true)

    const result = await userLikeService.handleLikeDislike(blogObject, 'like')
    return result.data
  }

  async function handleBlogDislike() {
    if (!user) {
      alert('Please log in to like blogs.')
      return null
    }

    console.log('Fire dislike service for: ', blogObject.id)
    // Toggle the state based on the current state, not the previous state
    setIsLiked(false)

    const result = await userLikeService.handleLikeDislike(blogObject, 'dislike')
    return result.data
  }

  function showLikeButton() {
    if(!isLiked || user === null) {
      return <button onClick={handleBlogLike}>Like</button>
    }
    return <button onClick={handleBlogDislike}>Unlike</button>
  }

  function renderBlogs() {
    if(showFullBlogs) {
      return (
        <div className="full-blog">
          <h2>{blogObject.title}</h2>
          <h3>{blogObject.author}</h3>
          <p>{blogObject.url}</p>
          <p>Likes: {blogObject.likes}</p>
          <p>Posted by: {blogObject.postedBy}</p>
          {showLikeButton()}
          <button onClick={handleShowBlogs}>Hide</button>
        </div>
      )
    } else {
      return (
        <div className="half-blog">
          <h2>{blogObject.title}:</h2>
          <h2>{blogObject.author}</h2>
          <button onClick={handleShowBlogs}>View more</button>
        </div>
      )
    }
  }

  return renderBlogs()
}