const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const expand = request.query.expand === 'true'

  let users
  if (expand) {
    users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1 })
  } else {
    users = await User.find({})
  }

  response.json(users)
})

usersRouter.get('/:id', async (request, response) => {
  const expand = request.query.expand === 'true'

  let user
  if (expand) {
    user = await User.findById(request.params.id).populate('blogs', { url: 1, title: 1, author: 1 })
  } else {
    user = await User.findById(request.params.id)
  }

  if (user) {
    response.json(user)
  }
  else {
    response.status(404).end()
  }
})

usersRouter.post('/', async (request, response) => {
  const pwdLen = 3
  const { username, name, password } = request.body

  if (password.length < pwdLen) {
    return response.status(400).json({ error: `password needs to be at least ${pwdLen} characters long` })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter