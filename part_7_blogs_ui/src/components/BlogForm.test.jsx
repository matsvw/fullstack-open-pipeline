import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

vi.mock('../services/blogs') // Mock the blog service

beforeAll(() => {
  vi.spyOn(window, 'confirm').mockImplementation(() => true) // Mock window.confirm to always return true
})

describe('<BlogForm />', () => {
  const blogUser = {
    name: 'Test User',
    username: 'testuser',
  }

  test('renders content', async () => {
    const mockCreatedHandler = vi.fn()
    const mockTimeoutMessage = vi.fn()

    render(
      <BlogForm
        user={blogUser}
        handleBlogCreated={mockCreatedHandler}
        setTimeoutMessage={mockTimeoutMessage}
      />
    )
    // user this to dump the rendered HTML to the console
    //screen.debug()

    // these will throw an error if the elements are not found
    screen.getByLabelText(/title/i)
    screen.getByLabelText(/author/i)
    screen.getByLabelText(/url/i)
  })

  test('renders content', async () => {
    const mockCreatedHandler = vi.fn()
    const mockTimeoutMessage = vi.fn()

    const user = userEvent.setup()

    render(
      <BlogForm
        user={blogUser}
        handleBlogCreated={mockCreatedHandler}
        setTimeoutMessage={mockTimeoutMessage}
      />
    )
    // user this to dump the rendered HTML to the console
    screen.debug()

    const titleInput = screen.getByLabelText(/title/i)
    const authorInput = screen.getByLabelText(/author/i)
    const urlInput = screen.getByLabelText(/url/i)

    await user.type(titleInput, 'Blog title')
    await user.type(authorInput, 'Blog author')
    await user.type(urlInput, 'http://blogurl.com')

    const sendButton = screen.getByText('create')

    await user.click(sendButton)

    expect(mockTimeoutMessage.mock.calls).toHaveLength(0) //successful creation should not trigger message

    expect(mockCreatedHandler.mock.calls).toHaveLength(1)
    expect(mockCreatedHandler.mock.calls[0][0].title).toBe('Blog title')
    expect(mockCreatedHandler.mock.calls[0][0].author).toBe('Blog author')
    expect(mockCreatedHandler.mock.calls[0][0].url).toBe('http://blogurl.com')
  })
})
