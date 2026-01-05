const logger = require('./logger')
const lodash = require('lodash')

const dummy = (blogs) => {
  logger.info(blogs)
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const mostLikes = blogs.reduce((max, current) =>
    current.likes > max.likes ? current : max
  )
  logger.info('Most liked blog:', mostLikes)
  return mostLikes
}

const mostLikes = (blogs) => {
  // lodash feels like LINQ from C#
  const topAuthor = lodash(blogs)
    .groupBy('author')
    .map((items, author) => ({ author, likes: lodash.sumBy(items, 'likes') }))
    .maxBy('likes')

  return topAuthor
}

const mostBlogs = (blogs) => {
  // lodash feels like LINQ from C#
  const topAuthor = lodash(blogs)
    .groupBy('author')
    .map((items, author) => ({ author, blogs: items.length }))
    .maxBy('blogs')

  return topAuthor
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostLikes,
  mostBlogs
}