import { useState, useContext } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import FormHelperText from '@mui/material/FormHelperText'

import NotificationContext from '../contexts/NotificationContext'
import UserContext from '../contexts/UserContext'

import blogService from '../services/blogs'

const BlogForm = ({ open, onClose }) => {
  const queryClient = useQueryClient()
  const { notificationDispatch } = useContext(NotificationContext)
  const { userState } = useContext(UserContext)
  const user = userState.user
  const [blogError, setBlogError] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      // add expanded user details, as the return from the backend will not contain this
      newBlog.user = { username: user.username, name: user.name, id: user.id }
      queryClient.setQueryData(['blogs'], (prev) => {
        // If there is no data yet, skip this
        if (!prev) return prev

        return prev.concat(newBlog)
      })

      notificationDispatch({
        type: 'SHOW_MESSAGE',
        payload: `Blog '${newBlog.title}' by ${newBlog.author} added`,
      })
      handleClose()
    },
    onError: (error) => {
      console.log(error)
      // Do not dispatch notification. Show on form and keep user here.
      setBlogError(`Error creating blog: ${error.response.data.error}`)
    },
  })

  const createBlog = async (event) => {
    event.preventDefault()

    newBlogMutation.mutate({
      title,
      author,
      url,
    })
  }

  const handleClose = () => {
    //Reset all fields and close
    setBlogError('')
    setTitle('')
    setAuthor('')
    setUrl('')
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create Blog</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Fill in the details of the new blog
        </DialogContentText>
        <form onSubmit={createBlog} id="create-blog-form">
          <TextField
            autoFocus
            required
            margin="dense"
            id="title"
            name="title"
            label="Title"
            type="text"
            fullWidth
            variant="standard"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
          <TextField
            required
            margin="dense"
            id="author"
            name="author"
            label="author"
            type="author"
            fullWidth
            variant="standard"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
          <TextField
            required
            margin="dense"
            id="url"
            name="url"
            label="url"
            type="url"
            fullWidth
            variant="standard"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
          <FormHelperText
            id="blog-error-text"
            error="true"
            sx={{
              display: blogError ? 'block' : 'none',
              marginTop: '1rem',
            }}
          >
            {blogError}
          </FormHelperText>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit" form="create-blog-form">
          Create Blog
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default BlogForm
