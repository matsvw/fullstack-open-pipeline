const { singleBlog, mostLikedBlog, blogList } = require('./testdata.js')

const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('common', () => {
  test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
  })
})

describe('total likes', () => {
  test('empty list returns zero', () => {
    const blogs = []
    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 0)
  })

  test('list with one entry matches the likes of that entry', () => {
    const result = listHelper.totalLikes([singleBlog])
    assert.strictEqual(result, singleBlog.likes)
  })

  test('list with multiple entries returns the correct total', () => {
    const totLikes = blogList.reduce((sum, blog) => sum + blog.likes, 0)
    const result = listHelper.totalLikes(blogList)
    assert.strictEqual(result, totLikes)
  })

  describe('most liked blog', () => {
    test('empty list returns null', () => {
      const blogs = []
      const result = listHelper.favoriteBlog(blogs)
      assert.strictEqual(result, null)
    })

    test('list with one entry returns that entry', () => {
      const result = listHelper.favoriteBlog([mostLikedBlog])
      assert.deepStrictEqual(result, mostLikedBlog)
    })

    test('most liked blog is first in list', () => {
      const blogs = [mostLikedBlog, ...blogList]
      const result = listHelper.favoriteBlog(blogs)
      assert.deepStrictEqual(result, mostLikedBlog)
    })

    test('most liked blog is last in list', () => {
      const blogs = [...blogList, mostLikedBlog]
      const result = listHelper.favoriteBlog(blogs)
      assert.deepStrictEqual(result, mostLikedBlog)
    })

    test('most liked blog is at random position in middle of list', () => {
      const pos = Math.floor(Math.random() * (blogList.length-2)) +1
      const blogs = [
        ...blogList.slice(0, pos),
        mostLikedBlog,
        ...blogList.slice(pos)
      ]
      const result = listHelper.favoriteBlog(blogs)
      assert.deepStrictEqual(result, mostLikedBlog)
    })
  })

  describe('most active and liked authors', () => {
    test('find author with most blogs', () => {
      // add mostLikedBlog, the author of that will also have most blogs from the set
      const blogs = [...blogList, mostLikedBlog]
      const result = listHelper.mostBlogs(blogs)
      assert.strictEqual(result.author, mostLikedBlog.author)
      assert.strictEqual(result.blogs, 3)
    })
    test('find most liked author', () => {
      // add mostLikedBlog, the author of that will be the most liked from the set
      const blogs = [...blogList, mostLikedBlog]
      const result = listHelper.mostLikes(blogs)
      assert.strictEqual(result.author, mostLikedBlog.author)
      assert(result.likes > mostLikedBlog.likes, 'Total likes should be larger than likes for most liked blog')
    })
  })

})