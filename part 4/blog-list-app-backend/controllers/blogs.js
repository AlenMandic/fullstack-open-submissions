// route for creating new blogs, verifying which user the blog belongs to, and making sure only logged in users ( bearer with JWT token is present in request header ) can create and manipulate blogs.
const blogRouter = require('express').Router()
const Blog = require("../models/blog")
const User = require("../models/user")
const middleware = require("../utils/middleware")


blogRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({}).populate('userId', { username: 1, name: 1 })

  res.json(blogs)
})

// only available if logged in with JWT. If user is logged in they will have an assigned token with their username and ID which we can then use here.
blogRouter.post("/", middleware.userExtractor, async (req, res, next) => {

  try {
    console.log("Logging request authorization header for protected route -> Posting to: /api/blogs/: ", req.headers.authorization)
    console.log('User is attempting to save blog: ', req.body)

    const user = req.user

    const blog = new Blog({
      title: req.body.title,
      author: req.body.author,
      url: req.body.url,
      likes: req.body.likes,
      userId: user.id
    })

    if(blog.likes === undefined) {
      blog.likes = 0
    }

    if(blog.title === '') {
      return res.status(400).end()
    } else {

      const newBlog = await blog.save()

      user.blogs = user.blogs.concat(newBlog._id) // update the user's blog array with the new blog they're saving.
      await user.save() // save updated user information to the 'User' collection

      console.log(user.username, 'saved new blog: ', newBlog.title)
      console.log("Database user and blog info has been updated.")
      res.status(201).json(newBlog)
    }
  } catch(err) {
    next(err)
  }

})

blogRouter.get("/:id", async (req, res, next) => {
  const id = req.params.id

  try {
    const result = await Blog.findById(id).populate('userId', { username: 1, name: 1 })

    if(result) {
      return res.json(result)
    } else {
      return res.status(404).json({ error: "ID doesnt exist" })
    }

  } catch(err) {
    next(err)
  }
})

blogRouter.delete("/:id", middleware.userExtractor, async (req, res, next) => {
  const id = req.params.id

  try {

    const blogToDelete = await Blog.findById(id)
    console.log('trying to delete: ', blogToDelete)

    const userToUpdateArray = req.user
    console.log('trying to update user blog-array after deletion for: ', userToUpdateArray)

    await Blog.findByIdAndRemove(id)
    console.log('Blog removed.')

    await User.findByIdAndUpdate(
      userToUpdateArray,
      { $pull: { blogs: blogToDelete._id } },  // remove that item from User.blogs array
      { new: true } // return updated document
    )

    console.log('Updated users blog array')
    return res.status(204).end()

  } catch(err) {
    next(err)
  }

})

blogRouter.put("/:id", async(req, res, next) => {
  const body = req.body

  try {
    const newLikes = body.likes
    const blogToUpdate = await Blog.findById(req.params.id)
    console.log("before likes updated:", blogToUpdate)

    blogToUpdate.likes = newLikes
    console.log('after likes updated:', blogToUpdate)

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blogToUpdate, { new: true, runValidators: true, context: 'query' })
    console.log("updated blog: ", updatedBlog)
    res.json(updatedBlog)

  } catch(err) {
    next(err)
  }
})

module.exports = blogRouter