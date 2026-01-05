import { screen } from '@testing-library/react'
import { vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'
import { renderWithProviders } from '../helpers/testHelper'

vi.mock('../services/blogs') // Mock the blog service

beforeAll(() => {
  vi.spyOn(window, 'confirm').mockImplementation(() => true) // Mock window.confirm to always return true
})

describe('<BlogForm />', () => {
  test('renders content', async () => {
    renderWithProviders(<BlogForm open={true} onClose={vi.fn()} />)
    // user this to dump the rendered HTML to the console
    //screen.debug()

    // these will throw an error if the elements are not found
    screen.getByLabelText(/title/i)
    screen.getByLabelText(/author/i)
    screen.getByLabelText(/url/i)
  })

  test('renders content', async () => {
    const user = userEvent.setup()

    renderWithProviders(<BlogForm open={true} onClose={vi.fn()} />)
    // user this to dump the rendered HTML to the console
    screen.debug()

    const titleInput = screen.getByLabelText(/title/i)
    const authorInput = screen.getByLabelText(/author/i)
    const urlInput = screen.getByLabelText(/url/i)

    await user.type(titleInput, 'Blog title')
    await user.type(authorInput, 'Blog author')
    await user.type(urlInput, 'http://blogurl.com')

    const sendButton = await screen.findByRole('button', {
      name: 'Create Blog',
    })

    await user.click(sendButton)
  })
})
