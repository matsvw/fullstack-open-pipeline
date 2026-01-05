import { useState, useContext } from 'react'
import { NavLink } from 'react-router-dom'

import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Menu,
  MenuItem,
  Box,
  Container,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'

import UserContext from '../contexts/UserContext'
import LoginForm from './LoginForm'

const MenuBar = ({ maxWidth: maxMenuWidth }) => {
  const { userState, logout } = useContext(UserContext)
  const [anchorEl, setAnchorEl] = useState(null)
  const [loginOpen, setLoginOpen] = useState(false)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLoginLogout = () => {
    if (userState.user) {
      logout()
    } else {
      setLoginOpen(true)
    }
  }

  const menuButtonStyle = {
    color: 'inherit',
    '&.active': {
      fontWeight: 600,
    },
  }

  return (
    <AppBar position="static">
      <LoginForm open={loginOpen} onClose={() => setLoginOpen(false)} />
      <Container maxWidth={maxMenuWidth}>
        <Toolbar
          sx={{ paddingLeft: '0 !important', paddingRight: '0 !important' }}
        >
          {isMobile && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={handleMenuOpen}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography variant="h6" component="div">
            Blogs!
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', ml: 2 }}>
              <Button
                component={NavLink}
                to="/blogs"
                sx={menuButtonStyle}
                variant="outlined"
              >
                Blogs
              </Button>
              <Button
                component={NavLink}
                to="/users"
                sx={menuButtonStyle}
                variant="outlined"
              >
                Users
              </Button>
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
            <Typography variant="subtitle1" component="div" sx={{ mr: 2 }}>
              {userState?.user?.name ?? ''}
            </Typography>
            <Button color="inherit" onClick={handleLoginLogout}>
              {userState.user ? 'LOGOUT' : 'LOGIN'}
            </Button>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem component={NavLink} to="/blogs" onClick={handleMenuClose}>
              Blogs
            </MenuItem>
            <MenuItem component={NavLink} to="/users" onClick={handleMenuClose}>
              Users
            </MenuItem>
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default MenuBar
