// route for when a new user is registering and fetching  user information.
const userRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')
const middleware = require("../utils/middleware")

userRouter.get('/', async (req, res) => {
  const ourUsers = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })
  res.json(ourUsers)
})

userRouter.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id

    const result = await User.findById(id).populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })
    if(result !== null) {
      res.json(result)
    }
    res.status(404).send('Error: Invalid ID')

  } catch(err) {
    next(err)
  }
})

// retrieve a user's liked blogposts
userRouter.get('/:id/likes', async (req, res, next) => {
  try {

    const id = req.params.id

    const user = await User.findOne({ username: id })
    console.log('Trying to view bloglist for user: ', user.username)
    console.log("User's liked blogposts: ", user.likedBlogs)

    res.status(200).json(user.likedBlogs)

  } catch(err) {
    next(err)
  }
})

// retrieve blogs belonging to a specific user
userRouter.get('/:id/blogs', async (req, res, next) => {
  try {

    const id = req.params.id

    const user = await User.findOne({ username: id })
    console.log('Trying to view bloglist for user: ', user.username)
    console.log("User's liked blogposts: ", user.likedBlogs)

    const userBlogsToDisplay = await Blog.find({ userId: user._id })

    res.status(200).json(userBlogsToDisplay)

  } catch(err) {
    next(err)
  }
})

// deletes an entire user profile, and all of the user's associated blogs
userRouter.delete('/:id', middleware.userExtractor, async (req, res, next) => {
  const id = req.params.id
  const user = req.user
  console.log("User resolved from token: ", user)

  // if user is authenticated and is trying to delete his own content
  if(user && (user.id === id)) {
    try {
      console.log('request to delete user:', id)
      const userToDelete = user
      console.log('Trying to delete user: ', userToDelete.id)

      // NEED TO CHECK IF THIS IS REDUNDANT
      const userBlogsToRemove = user
      console.log('User blogs which also need to be removed: ', userBlogsToRemove)

      if(userBlogsToRemove.length === 0) {
        console.log('User blog array is empty. Delete the user.')
        await User.findByIdAndRemove(userToDelete._id)
        res.status(204).end()
      }

      await Blog.deleteMany({ userId: userToDelete._id })
      console.log('Removed user blogs')

      await User.findByIdAndRemove(userToDelete._id)
      console.log('User removed')

      res.status(204).end()
    } catch(err) {
      next(err)
    }
  }

  res.status(400).json({ error: "You must be logged in to perform this action." })

})
// sign-up new user route
userRouter.post('/', async (req, res, next) => {
  try {
    const { username, name, password } = req.body
    console.log('New user attempting to register: ', username, name, password)

    if(password.length <= 10) {
      console.log("Registration failed.")
      return res.status(400).json({ error: 'Password must be longer than 10 characters.' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds) // hashed, secured password with 10 salt rounds.
    // we don't store the actual password to the db, we only store the hashed version.

    const user = new User({
      username,
      name,
      passwordHash
    })

    const savedUser = await user.save()
    console.log("Registration successful. User saved to DB.")
    res.status(201).json(savedUser)

  } catch(err) {
    next(err)
  }

})

module.exports = userRouter