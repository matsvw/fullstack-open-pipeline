import { Routes, Route } from 'react-router-dom'

import { CssBaseline, Typography, Box, Container } from '@mui/material'

import UserContext from './contexts/UserContext'
import MenuBar from './components/MenuBar'
import BlogList from './components/BlogList'
import Blog from './components/Blog'
import UserList from './components/UserList'
import User from './components/User'
import Notification from './components/Notification'

const App = () => {
  return (
    <>
      <CssBaseline enableColorScheme />
      <MenuBar maxWidth="md" />
      <Notification />

      <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Routes>
            <Route path="/users" element={<UserList />} />
            <Route path="/users/:id" element={<User />} />
            <Route path="/blogs" element={<BlogList />} />
            <Route path="/blogs/:id" element={<Blog />} />
            <Route path="/" element={<BlogList />} />
          </Routes>
        </Box>
      </Container>

      <Box component="footer" sx={{ py: 3, bgcolor: 'background.paper' }}>
        <Container maxWidth="md">
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Blogs Galore Ltd.
          </Typography>
        </Container>
      </Box>
    </>
  )
}

export default App
