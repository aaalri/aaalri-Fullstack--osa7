const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const config = require('../utils/config')
const middleware = require('../utils/middleware')
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  blogs.sort((firstBlog, secondBlog) => {
    return secondBlog.likes - firstBlog.likes
  })
  response.json(blogs.map(u => u.toJSON()))
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const decodedToken = jwt.verify(request.token, config.SECRET)
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)

  const blog = new Blog(
    {
      title: body.title,
      author: body.author,
      user: user,
      url: body.url,
      likes: body.likes,
    })


  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)

})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {

  const decodedToken = jwt.verify(request.token, config.SECRET)
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', middleware.userExtractor, async (request, response) => {

  const decodedToken = jwt.verify(request.token, config.SECRET)
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = request.body
  await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.status(200).end()
})

blogsRouter.post('/:id/comments', middleware.userExtractor, async (request, response) => {

  const decodedToken = jwt.verify(request.token, config.SECRET)
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const comment = request.body.comment
  await Blog.findByIdAndUpdate(request.params.id, { $push: { comments: comment } }, { new: true })
  response.status(200).send()
})


module.exports = blogsRouter