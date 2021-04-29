const supertest = require('supertest')
const app = require('../app')

const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'First blog',
    author: 'Daniel Elias',
    url: 'https://danielelias.org',
    likes: 0,
  },
  {
    title: 'Second blog',
    author: 'Denis Santeri',
    url: 'https://denissanteri.org',
    likes: 0,
  },
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})

  return users.map((user) => user.toJSON())
}

const loggedUser = async () => {
  const userCredentials = {
    username: 'denis',
    password: 'qwertyIsStrong',
  }

  return await api.post('/api/login').send(userCredentials)
}

module.exports = {
  initialBlogs,
  blogsInDb,
  usersInDb,
  loggedUser,
}
