import axios from 'axios'
let id = null

let token = null

// if the user is logged in, we get the token so we can use it for requests.
const setToken = newToken => {
  token = `Bearer ${newToken}`
}

// retrieve user's liked posts.
const getLikedPosts = async userId => {
  try {
    id = userId.username
    const baseUrl = `http://localhost:3003/api/users/${id}/likes`

    console.log('getLikedPosts service, userId: ', id)
    const response = await axios.get(baseUrl)

    console.log(response.data)
    return response.data
  } catch (err) {
    console.log(err)
  }
}

const handleLikeDislike = async (blog, type) => {

  const config = {
    headers: { Authorization: token }
  }

  const id = blog.id
  const newBlog = blog
  const baseUrl = `http://localhost:3003/api/blogs/${id}`

  if(type === 'like') {
    newBlog.likes += 1

    try {
      const response = await axios.put(baseUrl, newBlog, config)
      console.log(response.data)
      return response.data

    } catch (err) {
      console.log(err)
    }
  }

  newBlog.likes -= 1

  try {
    const response = await axios.put(baseUrl, newBlog, config)
    console.log(response.data)
    return response.data

  } catch (err) {
    console.log(err)
  }

}

export default { getLikedPosts, handleLikeDislike, setToken }