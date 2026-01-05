import { useState, useContext, useMemo, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

import { Typography, Box, Stack, Paper, IconButton } from '@mui/material'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import AddIcon from '@mui/icons-material/Add'

import NotificationContext from '../contexts/NotificationContext'
import UserContext from '../contexts/UserContext'
import blogService from '../services/blogs'
import NoContent from './NoContent'
import BlogForm from './BlogForm'

const BlogList = () => {
  const { userState } = useContext(UserContext)
  const { notificationDispatch } = useContext(NotificationContext)
  const [sortAscending, setSortAscending] = useState(true)
  const [showBlogForm, setShowBlogForm] = useState(false)

  // Conditionally fetch when user exists
  const {
    data: blogs = [],
    isLoading,
    isError,
    error: loadingError,
  } = useQuery({
    queryKey: ['blogs'],
    queryFn: () => blogService.getAll(true),
    enabled: !!userState.user,
    refetchOnWindowFocus: false,
    retry: 1,
  })

  const closeBlogForm = () => {
    setShowBlogForm(false)
  }

  const sortedBlogs = useMemo(() => {
    const list = blogs ?? []
    const copy = [...list]
    copy.sort((a, b) => (sortAscending ? a.likes - b.likes : b.likes - a.likes))
    return copy
  }, [blogs, sortAscending])

  const toggleSort = () => setSortAscending((s) => !s)

  useEffect(() => {
    if (isError) {
      notificationDispatch({
        type: 'SHOW_ERROR',
        payload: loadingError?.message ?? 'Failed to load blogs',
      })
    }
  }, [isError, loadingError, notificationDispatch])

  if (isLoading || !userState.user) {
    return (
      <NoContent
        isError={false}
        isLoading={isLoading}
        noUser={!userState.user}
      />
    )
  }
  return (
    <Box sx={{ width: '100%' }}>
      <BlogForm open={showBlogForm} onClose={closeBlogForm} />
      <Typography variant="h5" sx={{ mb: '1.5rem' }}>
        Blogs
      </Typography>
      <Box sx={{ display: 'flex' }}>
        <IconButton
          aria-label="create-blog"
          onClick={() => setShowBlogForm(true)}
        >
          <AddIcon />
        </IconButton>
        <IconButton
          aria-label="sort-blogs"
          sx={{ ml: 'auto', mr: '0.5rem' }}
          onClick={toggleSort}
        >
          <SwapVertIcon />
        </IconButton>
      </Box>

      <Stack spacing={1}>
        {sortedBlogs.map((blog) => (
          <Paper
            key={`div_${blog.id}`}
            sx={{ padding: '0.2rem' }}
            variant="outlined"
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr auto',
                gap: 1,
                alignItems: 'center',
                ml: '0.5rem',
                mr: '0.5rem',
              }}
            >
              <Typography variant="body1" component="div">
                {blog.title}
              </Typography>
              <Typography variant="body1" component="div">
                Liked {blog.likes} times
              </Typography>
              <IconButton
                component={Link}
                aria-label="open-blog"
                to={`/blogs/${blog.id}`}
                sx={{ ml: 'auto' }}
              >
                <OpenInNewIcon />
              </IconButton>
            </Box>
          </Paper>
        ))}
      </Stack>
    </Box>
  )
}

export default BlogList
