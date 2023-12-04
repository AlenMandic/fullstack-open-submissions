import { useState } from 'react'

export default function UserBlog({ blogObject, handleDeleteCallback }) {

  const[showFullBlogs, setShowFullBlogs] = useState(false)

  function handleShowBlogs() {
    setShowFullBlogs(!showFullBlogs)
  }

  function handleDelete() {
    handleDeleteCallback(blogObject)
  }

  function renderBlogs() {
    if(showFullBlogs) {
      return (
        <div className="full-blog">
          <h2>{blogObject.title}</h2>
          <h3>{blogObject.author}</h3>
          <p>{blogObject.url}</p>
          <p>Likes: {blogObject.likes}</p>
          <button onClick={handleDelete}>Delete blog</button>
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