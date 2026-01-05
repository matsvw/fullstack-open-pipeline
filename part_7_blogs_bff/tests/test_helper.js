const bcrypt = require('bcrypt')
const logger = require('../utils/logger')
const Blog = require('../models/blog')
const User = require('../models/user')
const { blogList, defaultUser } = require('./testdata.js')

const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const createDefaultUser = async (prefix, cleanStart=true) => {
  if (cleanStart) {
    await User.deleteMany( {})
  }

  const currentUsers = await usersInDb()
  const userName = `${prefix}${defaultUser.username}` //username needs to be unique for each test file as deleteMany might not be fast enough between tests.
  logger.info('create default user: ',userName)
  const oldDefault = currentUsers.find(u => u.username === userName)
  if (oldDefault) {
    return oldDefault.id
  }

  const passwordHash = await bcrypt.hash(defaultUser.password, 10)
  // eslint-disable-next-line no-unused-vars
  const { password, ...newUser } = defaultUser //remove password
  const user = new User({ ...newUser, passwordHash, username: userName }) //add password hash and username

  const response = await user.save()
  return response._id
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  blogList, nonExistingId, blogsInDb, usersInDb, createDefaultUser
}