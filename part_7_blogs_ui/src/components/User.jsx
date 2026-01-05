import { useParams, Link } from 'react-router-dom'
import { useContext } from 'react'
import { useQuery } from '@tanstack/react-query'

import { Typography, Box, IconButton } from '@mui/material'
//import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import LinkIcon from '@mui/icons-material/Link'

import UserContext from '../contexts/UserContext'
import userService from '../services/users'
import NoContent from './NoContent'

const User = () => {
  const { id: userId } = useParams()
  const { userState } = useContext(UserContext)

  const {
    data: user = null,
    isLoading,
    isError,
    error: _,
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => userService.getOne(userId, true),
    enabled: !!userState.user,
    refetchOnWindowFocus: false,
    retry: 1,
  })

  if (isLoading || !userState.user) {
    return (
      <NoContent
        isError={false}
        isLoading={isLoading}
        noUser={!userState.user}
      />
    )
  }
  if (!isError && user) {
    return (
      <Box
        sx={{
          width: '100%',
        }}
      >
        <Typography variant="h6" sx={{ mb: '1.5rem' }}>
          {user.name}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 600, mt: '1.5rem' }}>
          Added blogs
        </Typography>
        <ul>
          {user.blogs.map((blog) => (
            <li key={blog.id}>
              <Typography variant="body1">
                {blog.title}
                <IconButton
                  component={Link}
                  aria-label="open-blog"
                  to={`/blogs/${blog.id}`}
                  sx={{ ml: 'auto' }}
                >
                  <LinkIcon />
                </IconButton>
              </Typography>
            </li>
          ))}
        </ul>
      </Box>
    )
  }
}

export default User
