// route for when a new user is registering.
const userRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')

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

userRouter.delete('/:id', async (req, res, next) => {
  const id = req.params.id

  try {
    console.log('request to delete user:', id)
    const userToDelete = await User.findById(id)
    console.log('Trying to delete user: ', userToDelete)

    const userBlogsToRemove = await Blog.find({ userId: userToDelete._id })
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

})

userRouter.post('/', async (req, res, next) => {
  try {
    const { username, name, password } = req.body
    console.log('New user attempting to register: ', username, name, password)

    if(password.length <= 3) {
      console.log("Registration failed.")
      return res.status(400).json({ error: 'Password must be longer than 3 characters.' })
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