import { useContext } from 'react'
import Snackbar from '@mui/material/Snackbar'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

import NotificationContext from '../contexts/NotificationContext'

const Notification = () => {
  const { notification } = useContext(NotificationContext)
  const { notificationDispatch } = useContext(NotificationContext)
  const isOpen = !!notification?.message

  const handleClose = (event, reason) => {
    console.log('Handle snackbar close reason: ', reason)
    if (reason === 'clickaway') {
      return // do not hide even if user clicks outside of the notificaton
    }
    notificationDispatch({
      type: 'HIDE',
    })
  }

  console.log('Snackbar notification: ', notification)
  console.log('Snackbar open: ', isOpen)

  const action = (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={handleClose}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  )

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      severity={notification?.isError ? 'error' : 'success'}
      open={isOpen}
      autoHideDuration={3000}
      onClose={handleClose}
      message={notification?.message}
      action={action}
    />
  )
}

export default Notification
