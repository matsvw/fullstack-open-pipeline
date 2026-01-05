const { test, after, before, describe } = require('node:test')
const assert = require('node:assert')

const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const logger = require('../utils/logger')
const Blog = require('../models/blog')
//const User = require('../models/blog')
const helper = require('./test_helper')
const { defaultUser } = require('./testdata.js')

const api = supertest(app)

let blogsAdded = 0
let validToken
let invalidToken
const prefix = 'blog_test_'
const invalidPrefix = 'blog_test_invalid'

// using before instead of beforeEach as we can use the same data set through all tests
before(async () => {
  const userId = await helper.createDefaultUser(prefix, false) // do not clean users as concurrent tests will fail
  await helper.createDefaultUser(invalidPrefix, false) // do not clean users as concurrent tests will fail

  const validTokenResponse = await api.post('/api/login').send(
    {
      'username': `${prefix}${defaultUser.username}`,
      'password': defaultUser.password
    })

  validToken = validTokenResponse.body.token
  assert(validToken, 'valid token not set')
  logger.info('valid token for tests: ', validToken)

  const invalidTokenResponse = await api.post('/api/login').send(
    {
      'username': `${invalidPrefix}${defaultUser.username}`,
      'password': defaultUser.password
    })

  invalidToken = invalidTokenResponse.body.token
  assert(invalidToken, 'invalid token not set')
  logger.info('invalidvalid token for tests: ', invalidToken)

  logger.info(userId)
  for (const blog of helper.blogList) { //update blog list with correct default user
    blog.user = userId
  }
  await Blog.deleteMany({})
  await Blog.insertMany(helper.blogList)
})

describe('initial tests retrieving blogs', () => {
  test('total number of blogs returned with GET is correct', async () => {
    const response = await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, helper.blogList.length)
  })

  test('get one and check content (incl. id)', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const expectedBlog = blogsAtStart.at(-1) // check last
    const response = await api.get(`/api/blogs/${expectedBlog.id}`).expect(200)

    // Normalize user field so that strict comparison does not fail (string vs objectId)
    expectedBlog.user = expectedBlog.user.toString()

    assert.deepStrictEqual(response.body, expectedBlog)
    assert(expectedBlog.id && !expectedBlog._id, 'Blog from DB does not expose correct id field')
    assert(response.body.id && !response.body._id, 'Blog from API does not expose correct id field')
  })
})

describe('adding a new blog', () => {

  test('a valid blog can be added', async () => {
    const title = `API POST test: ${Date.now()}`
    const newBlog = {
      title: title,
      author: 'Timo Testaaja',
      url: 'https://dummy.org',
      likes: 0,
      userId: helper.blogList[0].user
    }

    const resultBlog = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${validToken}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)


    // eslint-disable-next-line no-unused-vars
    const { userId, ...expectedBlog } = { ...newBlog, id: resultBlog.body.id, user: helper.blogList[0].user.toString(), comments: [] } //remove userId and add id + user + default comments
    assert.deepStrictEqual(resultBlog.body, expectedBlog)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.blogList.length + blogsAdded + 1)
    blogsAdded++

    const contents = blogsAtEnd.map(b => b.title)
    assert(contents.includes(title))

  })

  test('adding fails if token is missing', async () => {
    const title = `API POST test: ${Date.now()}`
    const newBlog = {
      title: title,
      author: 'Timo Testaaja',
      url: 'https://dummy.org',
      likes: 0,
      userId: helper.blogList[0].user
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

  })

  test('likes defaults to zero', async () => {
    const title = `API POST default likes test: ${Date.now()}`
    const newBlog = {
      title: title,
      author: 'Timo Testaaja',
      url: 'https://dummy.org',
      userId: helper.blogList[0].user
    }

    const resultBlog = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${validToken}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    // eslint-disable-next-line no-unused-vars
    const { userId, ...expectedBlog } = { ...newBlog, id: resultBlog.body.id, user: helper.blogList[0].user.toString(), likes: 0, comments: [] } //remove userId and add id, user, likes and default comments
    assert.deepStrictEqual(resultBlog.body, expectedBlog)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.blogList.length + blogsAdded + 1)
    blogsAdded++

    const contents = blogsAtEnd.map(b => b.title)
    assert(contents.includes(title))

  })

  test('blog without url is not added', async () => {
    const newBlog = {
      title: 'Testing',
      author: 'Timo Testaaja',
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${validToken}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.blogList.length + blogsAdded)
  })

  test('blog without title is not added', async () => {
    const newBlog = {
      author: 'Timo Testaaja',
      url: 'https://dummy.org',
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${validToken}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.blogList.length + blogsAdded)
  })

})

describe('update blog', () => {

  test('update existing blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const oldBlog = blogsAtStart.at(-1)
    const newTitle = `API PUT test: ${Date.now()}`

    oldBlog.title = newTitle
    await api
      .put(`/api/blogs/${oldBlog.id}`)
      .set('Authorization', `Bearer ${validToken}`)
      .send(oldBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.blogList.length + blogsAdded)

    const savedBlog = blogsAtEnd.find(b => b.title === newTitle)
    assert(savedBlog, 'Updated blog not found with new title')
    assert(savedBlog.id === oldBlog.id, `ID of updated blog does not match: ${savedBlog.id} != ${oldBlog.id}`)
  })

  test('only the creator is allowed to update', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const oldBlog = blogsAtStart.at(-1)
    const newTitle = `API PUT test: ${Date.now()}`

    oldBlog.title = newTitle
    await api
      .put(`/api/blogs/${oldBlog.id}`)
      .set('Authorization', `Bearer ${invalidToken}`)
      .send(oldBlog)
      .expect(403)
      .expect('Content-Type', /application\/json/)
  })

})

describe('delete blog', () => {

  test('delete one and check count', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${validToken}`)
      .expect(204)
    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.blogList.length + blogsAdded - 1) // we have added and removed one, so the length should be the same
    blogsAdded--
  })

  test('only the creator is allowed to delete', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${invalidToken}`)
      .expect(403)
      .expect('Content-Type', /application\/json/)
  })

})

after(async () => {
  await mongoose.connection.close()
})