const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const app = require('../app')
const api = supertest(app)

beforeEach(async () => {
  jest.spyOn(console, 'error')
  console.error.mockImplementation(() => null)
})


describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('suomisuola', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('login succeeds', async () => {

    const login = {
      username: 'root',
      password: 'suomisuola'
    }

    await api
      .post('/api/login')
      .send(login)
      .expect(200)
      .expect('Content-Type', /application\/json/)

  })

  test('login fails with wrong password', async () => {

    const login = {
      username: 'root',
      password: 'suomisuolat'
    }

    await api
      .post('/api/login')
      .send(login)
      .expect(401)

  })

  test('login fails with wrong user', async () => {

    const login = {
      username: 'groot',
      password: 'suomisuola'
    }

    await api
      .post('/api/login')
      .send(login)
      .expect(401)

  })


  afterAll(() => {
    console.error.mockRestore()
    mongoose.connection.close()
  })
})