import { useContext, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { Button, TextField } from '@mui/material'

import NotificationContext from '../contexts/NotificationContext'
import UserContext from '../contexts/UserContext'
import blogService from '../services/blogs'
import NoContent from './NoContent'
import Alert from './Alert'

const CommentForm = ({ blog }) => {
  const queryClient = useQueryClient()
  const [blogComment, setBlogComment] = useState('')
  const { notificationDispatch } = useContext(NotificationContext)

  const commentBlogMutation = useMutation({
    mutationFn: ({ blog, comment }) => blogService.comment(blog.id, comment),
    onSuccess: (updatedBlog) => {
      updatedBlog.user = blog.user // copy user details as they are not expanded here
      queryClient.setQueryData(['blogs'], (prev) => {
        // If there is no data yet, skip this
        if (!prev) return prev

        return prev.map((b) => (b.id === updatedBlog.id ? updatedBlog : b))
      })

      queryClient.setQueryData(['blog', updatedBlog.id], () => {
        return updatedBlog
      })

      notificationDispatch({
        type: 'SHOW_MESSAGE',
        payload: `Commented on blog '${updatedBlog.title}'`,
      })
      setBlogComment('')
    },
    onError: (error) => {
      console.log(error)
      notificationDispatch({
        type: 'SHOW_ERROR',
        payload: `Error commenting blog: ${error.response.data.error}`,
      })
    },
  })

  const commentBlog = (event, blog) => {
    event.preventDefault()
    console.log(blogComment)
    commentBlogMutation.mutate({ blog, comment: blogComment })
  }

  return (
    <>
      <form
        onSubmit={(event) => commentBlog(event, blog)}
        id="comment-blog-form"
        style={{ marginTop: '1rem' }}
      >
        <TextField
          required
          margin="dense"
          id="comment"
          name="comment"
          label="Comment"
          type="text"
          fullWidth
          variant="standard"
          value={blogComment}
          onChange={(e) => setBlogComment(e.target.value)}
        />
      </form>
      <Button
        type="submit"
        variant="outlined"
        form="comment-blog-form"
        disabled={blogComment.length < 3}
      >
        Add Comment
      </Button>
    </>
  )
}

export default CommentForm
