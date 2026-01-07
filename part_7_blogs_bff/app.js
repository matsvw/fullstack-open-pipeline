const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

const loginRouter = require('./controllers/login')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')

const app = express()

const uri = config.MONGODB_URI
const clientOptions = {
  serverApi: { version: '1', strict: true, deprecationErrors: true },
}

// Create a Mongoose client with a MongoClientOptions object to set the Stable API version
logger.info('connecting to', uri)
mongoose
  .connect(uri, clientOptions)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(middleware.requestLogger)
// with my implementation, the token is automatically validated, so we do not want it before all routes, but instead we inject it as needed
//app.use(middleware.tokenValidator)

app.use('/api/login', loginRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
