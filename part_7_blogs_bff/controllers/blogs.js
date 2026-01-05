const blogsRouter = require('express').Router()

const logger = require('../utils/logger')
const { tokenValidator } = require('../utils/middleware')
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const expand = request.query.expand === 'true'

  let blogs
  if (expand) {
    logger.info('Expanding blog entries')
    blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  } else {
    blogs = await Blog.find({})
  }

  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const expand = request.query.expand === 'true'

  let blog
  if (expand) {
    blog = await Blog.findById(request.params.id).populate('user', { username: 1, name: 1 })
  } else {
    blog = await Blog.findById(request.params.id)
  }

  if (blog) {
    response.json(blog)
  }
  else {
    response.status(404).end()
  }
})

blogsRouter.post('/', tokenValidator, async (request, response, next) => {
  try {

    const body = request.body

    const authUser = request.user
    const blogUser = (await User.findById(body.userId)) ?? authUser //default to authenticated user if userId is missing or invalid

    if (!blogUser) {
      return response.status(400).json({ error: 'userId missing or not valid' })
    }
    logger.info('post blog - valid user found')

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: blogUser._id
    })

    const savedBlog = await blog.save()
    blogUser.blogs = blogUser.blogs.concat(savedBlog._id)
    await blogUser.save()
    response.status(201).json(savedBlog)

  }
  catch (error) {
    next(error)
  }
})

blogsRouter.post('/:id/comments', tokenValidator, async (request, response, next) => {
  try {
    //const authUser = request.user

    const oldBlog = await Blog.findById(request.params.id)
    if (!oldBlog) {
      return response.status(404).end()
    }

    const comment = {
      comment: request.body.comment,
    }
    oldBlog.comments = oldBlog.comments ? oldBlog.comments.concat(comment) : [comment]
    console.log(oldBlog)
    const savedBlog = await oldBlog.save()
    response.status(201).json(savedBlog)
  }
  catch (error) {
    next(error)
  }
})

blogsRouter.delete('/:id', tokenValidator, async (request, response) => {

  const authUser = request.user
  const blogToDelete = await Blog.findById(request.params.id)

  if (blogToDelete.user?.toString() !== authUser.id) {
    return response.status(403).json({ error: 'only the creator is allowed to delete a blog' })
  }

  await Blog.deleteOne(blogToDelete)
  //await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', tokenValidator, async (request, response, next) => {
  try {
    const authUser = request.user
    const { title, author, url, likes } = request.body

    const oldBlog = await Blog.findById(request.params.id)
    if (!oldBlog) {
      return response.status(404).end()
    }

    if (oldBlog.user?.toString() !== authUser.id) {
      return response.status(403).json({ error: 'only the creator is allowed to update a blog' })
    }

    oldBlog.title = title
    oldBlog.author = author
    oldBlog.url = url
    oldBlog.likes = likes

    const updatedBlog = await oldBlog.save()
    response.json(updatedBlog)
  }
  catch (error) {
    next(error)
  }
})

module.exports = blogsRouter