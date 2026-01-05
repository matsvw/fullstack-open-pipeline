import { screen } from '@testing-library/react'
import { expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { renderWithProviders } from '../helpers/testHelper'
import blogService from '../services/blogs'

vi.mock('../services/blogs')
vi.mock('../services/login')
vi.mock('../services/users')

beforeAll(() => {
  vi.spyOn(window, 'confirm').mockImplementation(() => true) // Mock window.confirm to always return true
})

describe('<Blog />', () => {
  const blog = {
    title: 'Test blog title',
    author: 'Test blog author',
    url: 'http://testurl.com',
    likes: 5,
    id: 'abc123',
  }

  const blogUser = {
    name: 'Test User',
    username: 'root',
  }

  beforeEach(() => {
    vi.clearAllMocks()
    blogService.getOne.mockResolvedValue({
      ...blog,
      user: blogUser,
      comments: [],
    })
  })

  test('renders content after loading', async () => {
    renderWithProviders(<Blog />)

    // wait for the async query to resolve and the title to appear
    await screen.findByText(blog.title)

    // details are shown by the component after loading
    expect(screen.getByText(`Author: ${blog.author}`)).toBeTruthy()
    expect(screen.getByText(blog.url)).toBeTruthy()
  })

  test('like button calls update twice', async () => {
    blogService.update.mockResolvedValue({ ...blog, likes: blog.likes + 1 })

    const user = userEvent.setup()
    renderWithProviders(<Blog />)

    await screen.findByText(blog.title)

    const likeButton = screen.getByText('Like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(blogService.update).toHaveBeenCalledTimes(2)
  })

  test('remove button calls remove after confirm', async () => {
    blogService.remove.mockResolvedValue({ success: true, id: blog.id })

    const user = userEvent.setup()
    renderWithProviders(<Blog />)

    await screen.findByText(blog.title)

    const deleteButton = screen.getByText('Delete')
    await user.click(deleteButton)

    // the Alert dialog uses an 'OK' button to confirm
    const okButton = await screen.findByText('OK')
    await user.click(okButton)

    expect(blogService.remove).toHaveBeenCalledTimes(1)
  })
})
