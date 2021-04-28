const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const helper = require('./test_helper')

const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('secret', 10)
  const user = new User({ username: 'adminco', passwordHash })

  await user.save()
})

describe('when there is initially one user in db', () => {
  test('all users are returned', async () => {
    const response = await api.get('/api/users')
    expect(response.body).toHaveLength(1)
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Denis',
      name: 'Denis Maz',
      password: 'verysecret',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map((u) => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('invalid user is not created and returns a 400 code and error message', async () => {
    const usersAtStart = await helper.usersInDb()

    const errorMessage = { errorMessage: 'Please enter all required fields.' }

    const malformedUser = {
      username: '',
      name: 'Denis Maz',
      password: 'verysecret',
    }

    const response = await api
      .post('/api/users')
      .send(malformedUser)
      .expect(400)

    expect(response.body).toEqual(errorMessage)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('user or password length less then 3, user is not created and return a 400 code and error message', async () => {
    const usersAtStart = await helper.usersInDb()

    const errorMessage = {
      errorMessage: 'Username and password must be at least 3 characters.',
    }

    const malformedUser = {
      username: 'De',
      name: 'Denis Maz',
      password: 've',
    }

    const response = await api
      .post('/api/users')
      .send(malformedUser)
      .expect(400)

    expect(response.body).toEqual(errorMessage)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
