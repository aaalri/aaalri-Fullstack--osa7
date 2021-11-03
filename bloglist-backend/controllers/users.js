const bcrypt = require('bcrypt')
const config = require('../utils/config')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { url: 1, title: 1, author:1 })
  response.json(users.map(u => u.toJSON()))
})

usersRouter.post('/', async (request, response) => {
  const body = request.body

  if (body.password.length < 3){
    return response.status(400).send({ error: 'password has to be at least 3 letters long' })
  }

  const saltRounds = parseInt(config.SALT_ROUNDS)
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(200).json(savedUser)
})

usersRouter.delete('/:id', async (request, response) => {
  await User.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

usersRouter.put('/:id', async (request, response) => {
  const user = request.body
  await User.findByIdAndUpdate(request.params.id, user, { new: true })
  response.status(200).end()
})


module.exports = usersRouter