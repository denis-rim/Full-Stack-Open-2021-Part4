const mongoose = require('mongoose')
const supertest = require('supertest')

const helper = require('./test_helper')
const app = require('../app')

const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

describe('when there is initially some notes saved', () => {
  test('blogs in JSON format', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })
})

describe('creating and authorization user', () => {
  test('new user can be created', async () => {
    await User.deleteMany({})

    const newUser = {
      username: 'denis',
      name: 'denismz',
      password: 'qwertyIsStrong',
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('created user can login and receive token', async () => {
    const userCredentials = {
      username: 'denis',
      password: 'qwertyIsStrong',
    }

    const loggedInUser = await api
      .post('/api/login')
      .send(userCredentials)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(loggedInUser.body.token).toBeDefined()
  })
})

describe('adding a new blog', () => {
  test('a blog post can be added', async () => {
    const newBlog = {
      title: 'Add a new blog Test',
      author: 'New Blog',
      url: 'https://danielelias.org',
      likes: 0,
    }

    const loggedUser = await helper.loggedUser()

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${loggedUser.body.token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const contents = blogsAtEnd.map((n) => n.title)
    expect(contents).toContain(newBlog.title)
  })

  test('a blog failed if token is not provided', async () => {
    const newBlog = {
      title: 'This blog must not be added',
      author: 'New Blog',
      url: 'https://danielelias.org',
      likes: 0,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    const contents = blogsAtEnd.map((n) => n.title)
    expect(contents).not.toContain(newBlog.title)
  })

  test('a blog post with missing likes field set likes by default to 0', async () => {
    const newBlog = {
      title: 'Added blog post without likes',
      author: 'Daniel Elias',
      url: 'https://danielelias.org',
    }

    const loggedUser = await helper.loggedUser()

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${loggedUser.body.token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.likes).toEqual(0)
  })

  test('a blog post with missing author and url fields throw 400 error', async () => {
    const newBlog = {
      author: 'Daniel Elias',
      likes: 0,
    }

    const loggedUser = await helper.loggedUser()

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${loggedUser.body.token}`)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const newBlogToDelete = {
      title: 'Added blog post to delete',
      author: 'Daniel Elias',
      url: 'https://danielelias.org',
    }

    const loggedUser = await helper.loggedUser()

    const addedBlog = await api
      .post('/api/blogs')
      .send(newBlogToDelete)
      .set('Authorization', `bearer ${loggedUser.body.token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAfterAddOne = await helper.blogsInDb()

    await api
      .delete(`/api/blogs/${addedBlog.body.id}`)
      .set('Authorization', `bearer ${loggedUser.body.token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(blogsAfterAddOne.length - 1)

    const titles = blogsAtEnd.map((r) => r.title)

    expect(titles).not.toContain(addedBlog.title)
  })
})

describe('updating a specific blog', () => {
  test('blogs like updated successfully', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const firstBlog = blogsAtStart[0]

    firstBlog.likes = 1

    const response = await api
      .put(`/api/blogs/${firstBlog.id}`)
      .send(firstBlog)
      .expect(200)

    expect(response.body.likes).toEqual(1)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
