const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
let token

beforeEach(async () => {
  jest.spyOn(console, 'error')
  console.error.mockImplementation(() => null)
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('suomisuola', 10)
  const user = new User({ username: 'root', name:'Overlord', passwordHash: passwordHash })
  await user.save()
  const passwordHash2 = await bcrypt.hash('sillisalaatti', 10)
  const user2 = new User({ username: 'vine', name:'Underlord', passwordHash: passwordHash2 })
  await user2.save()
})

describe('GET', () => {

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are all blogs', async () => {
    const blogs = await helper.blogsInDb()
    expect(blogs).toHaveLength(helper.initialBlogs.length)
  })

  test('the first blog is about React patterns', async () => {
    const blogs = await helper.blogsInDb()
    expect(blogs[0].title).toContain(
      'React patterns'
    )
  })

  test('blog identifier is id', async () => {
    const blogs = await helper.blogsInDb()
    expect(blogs[0].id).toBeDefined()
  })

})

describe('POST', () => {

  beforeEach(async () => {
    const login = {
      username: 'root',
      password: 'suomisuola'
    }

    let result = await api
      .post('/api/login')
      .send(login)
    token = result.body.token
  })

  test('a valid blog can be added', async () => {

    const newBlog = {
      title: 'React patterinos',
      author: 'Michael Chani',
      url: 'https://reactpatterninos.com/',
      likes: 77,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + token)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)


    const blogs = await helper.blogsInDb()
    expect(blogs).toHaveLength(helper.initialBlogs.length + 1)
    expect(blogs[helper.initialBlogs.length].title).toContain(
      'React patterinos'
    )
    expect(blogs[helper.initialBlogs.length].likes).toEqual(
      Number(77)
    )
  })

  test('a valid blog without likes can be added and likes is 0', async () => {
    const newBlog = {
      title: 'React patterinos',
      author: 'Michael Chani',
      url: 'https://reactpatterninos.com/',
    }

    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + token)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)


    const blogs = await helper.blogsInDb()
    expect(blogs).toHaveLength(helper.initialBlogs.length + 1)
    expect(blogs[helper.initialBlogs.length].likes).toEqual(
      Number(0)
    )
  })

  test('a blog without url can\'t be added', async () => {
    const newBlog = {
      title: 'React patterinos',
      author: 'Michael Chani',
    }

    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + token)
      .send(newBlog)
      .expect(400)
  })

  test('a blog without title can\'t be added', async () => {
    const newBlog = {
      author: 'Michael Chani',
      url: 'https://reactpatterninos.com/',
    }

    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + token)
      .send(newBlog)
      .expect(400)
  })

  test('a blog without title and url can\'t be added', async () => {
    const newBlog = {
      author: 'Michael Chani',
    }

    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + token)
      .send(newBlog)
      .expect(400)
  })

  test('unauthorized if missing token', async () => {

    const newBlog = {
      title: 'React patterinos',
      author: 'Michael Chani',
      url: 'https://reactpatterninos.com/',
      likes: 77,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

  })

})

describe('DELETE', () => {

  beforeEach(async () => {
    const login = {
      username: 'root',
      password: 'suomisuola'
    }

    let result = await api
      .post('/api/login')
      .send(login)
    token = result.body.token
  })

  test('a blog can be deleted', async () => {
    const blogs = await helper.blogsInDb()
    await api
      .delete(`/api/blogs/${blogs[0].id}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(204)

    const afterBlogs = await helper.blogsInDb()
    expect(afterBlogs).toHaveLength(blogs.length - 1)
  })

  test('unauthorized if missing token', async () => {
    const blogs = await helper.blogsInDb()
    await api
      .delete(`/api/blogs/${blogs[0].id}`)
      .expect(401)
  })

})

describe('UPDATE', () => {

  beforeEach(async () => {
    const login = {
      username: 'root',
      password: 'suomisuola'
    }

    let result = await api
      .post('/api/login')
      .send(login)
    token = result.body.token
  })

  test('a blog can be updated', async () => {
    const newBlog = {
      title: 'React patterns',
      author: 'Michael Chani',
      url: 'https://reactpatterns.com/',
      likes: 0
    }
    const blogs = await helper.blogsInDb()
    await api
      .put(`/api/blogs/${blogs[0].id}`)
      .set('Authorization', 'Bearer ' + token)
      .send(newBlog)
      .expect(200)

    const afterBlogs = await helper.blogsInDb()
    expect(afterBlogs[0].likes).toEqual(
      Number(0)
    )
  })

  test('unauthorized if missing token', async () => {
    const newBlog = {
      title: 'React patterns',
      author: 'Michael Chani',
      url: 'https://reactpatterns.com/',
      likes: 0
    }
    const blogs = await helper.blogsInDb()
    await api
      .put(`/api/blogs/${blogs[0].id}`)
      .send(newBlog)
      .expect(401)
  })

})


afterAll(() => {
  console.error.mockRestore()
  mongoose.connection.close()
})