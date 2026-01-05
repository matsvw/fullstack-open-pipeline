import { useContext, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link as RouterLink } from 'react-router-dom'

import { Typography, Box, Stack, Paper, IconButton } from '@mui/material'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

import NoContent from './NoContent'
import NotificationContext from '../contexts/NotificationContext'
import UserContext from '../contexts/UserContext'
import userService from '../services/users'

const UserList = () => {
  const { userState } = useContext(UserContext)
  const { notificationDispatch } = useContext(NotificationContext)

  // Conditionally fetch when user exists
  const {
    data: users = [],
    isLoading,
    isError,
    error: loadingError,
  } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getAll(true),
    enabled: !!userState.user,
    refetchOnWindowFocus: false,
    retry: 1,
  })

  useEffect(() => {
    if (isError) {
      notificationDispatch({
        type: 'SHOW_ERROR',
        payload: loadingError?.message ?? 'Failed to load users',
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
  if (!isError) {
    return (
      <Box sx={{ width: '100%' }}>
        <Typography variant="h5" component="div" sx={{ mb: '1.5rem' }}>
          Users
        </Typography>
        <Stack spacing={1}>
          {users.map((user) => (
            <Paper
              key={`div_${user.id}`}
              sx={{ padding: '0.2rem' }}
              variant="outlined"
            >
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr auto',
                  gap: 1,
                  alignItems: 'center',
                  ml: '0.5rem',
                  mr: '0.5rem',
                }}
              >
                <Typography variant="body1" component="div">
                  {user.name}
                </Typography>
                <Typography variant="body1" component="div">
                  {user.username}
                </Typography>
                <Typography variant="body1" component="div">
                  {user.blogs.length}{' '}
                  {user.blogs.length === 1 ? 'blog' : 'blogs '} created
                </Typography>
                <IconButton
                  component={RouterLink}
                  aria-label="delete"
                  to={`/users/${user.id}`}
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
}

export default UserList
