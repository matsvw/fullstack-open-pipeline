import { useState, useContext } from 'react'

import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
//import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'

import UserContext from '../contexts/UserContext'

const LoginForm = ({ open, onClose }) => {
  const { login } = useContext(UserContext)
  const [loginError, setLoginError] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()

    const ret = await login({ username, password })

    if (ret.status === 'authenticated') {
      handleClose()
    } else {
      setLoginError(true)
    }
  }

  const handleClose = () => {
    // reset all fields on close
    setUsername('')
    setPassword('')
    setLoginError(false)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} keepMounted>
      <DialogTitle>Login</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Log in with your username and password
        </DialogContentText>
        <form onSubmit={handleLogin} id="login-form">
          <TextField
            autoFocus
            required
            autoComplete="username"
            margin="dense"
            id="username"
            name="username"
            label="Username"
            type="text"
            fullWidth
            variant="standard"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
          <TextField
            required
            autoComplete="password"
            margin="dense"
            id="password"
            name="password"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
          <FormHelperText
            id="login-error-text"
            error="loginError"
            sx={{
              display: loginError ? 'block' : 'none',
              marginTop: '1rem',
            }}
          >
            There was an error logging in! Check your username and password.
          </FormHelperText>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit" form="login-form">
          Login
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default LoginForm
