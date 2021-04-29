const postRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

postRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
    id: 1,
  })
  response.json(blogs)
})

postRouter.post('/', async (request, response) => {
  const { title, url, author, likes } = request.body
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!decodedToken.id) {
    return response
      .status(401)
      .json({ errorMessage: 'token missing or invalid' })
  }

  if (!title && !url) {
    return response.status(400).json({})
  }

  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: user._id,
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)

  await user.save()

  response.json(savedBlog)
})

postRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!decodedToken.id) {
    return response
      .status(401)
      .json({ errorMessage: 'token missing or invalid' })
  }

  const blogId = request.params.id
  const blog = await Blog.findById(blogId)

  if (blog.user.toString() !== decodedToken.id.toString()) {
    response.status(403).json({ errorMessage: 'invalid user' })
  }

  await Blog.deleteOne({ _id: blogId })

  response.sendStatus(204)
})

postRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  })
  response.json(updatedBlog)
})

module.exports = postRouter
