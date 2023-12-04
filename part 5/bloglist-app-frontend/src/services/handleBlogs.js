import axios from 'axios'
const baseUrl = 'http://localhost:3003/api/blogs'

let token = null

// if the user is logged in, we get the token so we can use it for requests.
const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAllBlogs = async () => {

  try {
    const response = await axios.get(baseUrl)
    return response.data

  } catch(err) {
    console.log(err)
  }
}

// whenever our requests go to the protected routes which require authentication, we need to send an authorization header with our token along the request, token will be present on the front-end if the user is authenticated.
const addBlog = async blogData => {

  const config = {
    headers: { Authorization: token }
  }

  try {
    const response = await axios.post(baseUrl, blogData, config)
    return response

  } catch(err) {
    console.log(err)
  }
}

const deleteBlog = async blogId => {

  const config = {
    headers: { Authorization: token }
  }

  const url = `${baseUrl}/${blogId}`

  try {
    const response = await axios.delete(url, config)
    console.log(response)
    return response

  } catch(err) {
    console.log(err)
  }
}

const getUserBlogs = async userInfo => {
  // if user is logged in, all of their blogs should be rendered on the page.
  if (token !== null) {
    try {
      let userId
      userId = userInfo.username
      console.log('userId in getUserBlogs service: ', userId)

      let userBlogsUrl = `http://localhost:3003/api/users/${userId}/blogs`
      console.log('userBlogsUrl in getUserBlogs service: ', userBlogsUrl)

      const response = await axios.get(userBlogsUrl)

      const result = response.data.map(blog => blog)
      return result

    } catch(err) {
      console.error(err)
      alert(err.message)
      return []
    }
  }
  return []
}

export default { setToken, addBlog, getUserBlogs, getAllBlogs, deleteBlog }