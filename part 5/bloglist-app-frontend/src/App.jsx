import './style.css'
import { useState, useEffect } from 'react'
import loginService from './services/handleLogin'
import blogService from './services/handleBlogs'
import userLikesService from './services/handleUserLikes'
import AddBlog from './components/addBlogForm'
import CreateLoginForm from './components/createLoginForm'
import UserBlog from './components/UserBlog'
import { NotificationError, NotificationSuccess, } from './components/Notification'
import ExplorePage from './components/ExplorePage'

export default function App() {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [blogs, setUserBlogs] = useState([])
  const [notificationError, setNotificationError] = useState(null)
  const [notificationSuccess, setNotificationSuccess] = useState(null)
  const [explorePageState, setExplorePageState] = useState([])
  const [showUserPosts, setShowUserPosts] = useState(true)
  const [userLikedPosts, setUserLikedPosts] = useState([])

  // Renders and set's the "explore page", this goes to ExplorePage.jsx. Whenever a new post is made with addBlogForm, this gets updated, and then finally ExplorePage.
  useEffect(() => {
    const createExplorePage = async () => {
      try {
        const explorePageState = await blogService.getAllBlogs()
        setExplorePageState(explorePageState)

      } catch(err) {
        console.log(err)
      }
    }
    createExplorePage()
  }, [])

  // If user is logged in: retrieve the user once on mount and store it. Give token to relevant services.
  useEffect(() => {
    const loggedInUser = window.localStorage.getItem('loggedInBlogAppUser')

    if (loggedInUser) {
      const user = JSON.parse(loggedInUser)
      setUser(user)
      blogService.setToken(user.token)
      userLikesService.setToken(user.token)
    }
  }, [])

  //If user is logged in, we render their posts and initial liked posts. This needs to only run once when the initial login happens.
  useEffect(() => {
    if (user) {
      const fetchUserBlogs = async () => {
        try {
          const blogs = await blogService.getUserBlogs(user)
          const userLikedPosts = await userLikesService.getLikedPosts(user)

          setUserBlogs(blogs)
          setUserLikedPosts(userLikedPosts)
        } catch (err) {
          console.log(err)
          showErrorNotification(err.message)
        }
      }
      fetchUserBlogs()
    }
  }, [user])

  function resetForm() {
    setUsername('')
    setPassword('')
    setUserBlogs([])
    setUser(null)
    localStorage.removeItem('loggedInBlogAppUser')
  }

  function showErrorNotification(message) {
    setNotificationError(message)

    setTimeout(() => {
      setNotificationError(null)
    }, 5000)
  }

  function showSuccessNotification(message) {
    setNotificationSuccess(message)

    setTimeout(() => {
      setNotificationSuccess(null)
    }, 5000)
  }

  function createLoginForm() {
    return (
      <CreateLoginForm
        handleLogin={handleLogin}
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
      />
    )
  }
  // returns the form for adding blogs. Whenever a blog is added, App.jsx receives the data so we can update states.
  function addBlog() {
    return <AddBlog updateUserPageState={handleBlogSubmitCallback}/>
  }

  // updates USER and EXPLORE page state when a user adds a new post from addBlogForm.jsx
  function handleBlogSubmitCallback(blogObject) {
    const oldUserBlogs = blogs
    const oldExploreBlogs = explorePageState

    setUserBlogs(oldUserBlogs.concat(blogObject))
    setExplorePageState(oldExploreBlogs.concat(blogObject))
  }

  async function handleLogin(e) {
    e.preventDefault()

    try {
      const user = await loginService.login({ username, password }) // should return user: username, name, token

      window.localStorage.setItem('loggedInBlogAppUser', JSON.stringify(user))
      setUser(user)
      blogService.setToken(user.token) // changes the private "token" variable in our services to current auth-user token, enabling our services to use the token for requests. These requests will also need an 'Authorization' header with the token sent with them.
      setUsername('')
      setPassword('')
      showSuccessNotification('Logged in successfully.')
    } catch (err) {
      showErrorNotification('Login failed. Check login details: ', err.message)
      console.log('Error from catch block in LoginComponent frontend, login failed: ', err)
      resetForm()
    }
  }
  // updates user blogs and the explore page when a user deletes one of his blogs.
  async function handleDelete(ourBlog) {
    const confirm = window.confirm(`Are you sure you want to delete ${ourBlog.title}`)

    if(confirm) {

      const deleteBlog = await blogService.deleteBlog(ourBlog.id)
      console.log(deleteBlog)

      const updatedUserBlogs = blogs.filter(blog => blog.id !== ourBlog.id)
      const updatedExplorePageBlogs = explorePageState.filter(blog => blog.id !== ourBlog.id)
      setUserBlogs(updatedUserBlogs)
      setExplorePageState(updatedExplorePageBlogs)

      return deleteBlog.data

    } else {
      return null
    }
  }

  function handleLogout() {
    setUser(null)
    setUserLikedPosts([])
    blogService.setToken(null)
    resetForm()
  }

  function handleUserPosts() {
    if(showUserPosts) {
      return (
        <div>
          <button onClick={toggleUserPosts}>Hide posts</button>
          <ul>{blogs.map((blog) => (<UserBlog key={blog.id} blogObject={blog} handleDeleteCallback={handleDelete}/>))}</ul>
        </div>
      )
    } else {
      return <button onClick={toggleUserPosts}>Show your posts</button>
    }
  }

  function toggleUserPosts() {
    setShowUserPosts(!showUserPosts)
  }

  return (
    <>
      <NotificationError message={notificationError} />
      <NotificationSuccess message={notificationSuccess} />
      <h1>Blog saving app.</h1>
      <h3>Save your favorite blogs and their details to never lose them again!</h3>
      {user && (<h2>{user.name} is logged in</h2>)}
      {!user && createLoginForm()}
      {user && <button onClick={handleLogout}>Log out</button>}
      {user && (<div>{addBlog()}<h1>Your blogs</h1>{handleUserPosts()}</div>)}
      <h1>Front Page</h1>
      <h3>Explore blogs posted by others and interact with them.</h3>
      <ExplorePage explorePageState={explorePageState} user={user} userLikedBlogs={userLikedPosts}/>
    </>
  )
}
