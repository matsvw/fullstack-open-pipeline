import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

export default function AlertDialog({
  open,
  action,
  title,
  prompt,
  onClose,
  payload,
}) {
  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      keepMounted
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {prompt}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose('cancel', null)}>Cancel</Button>
        <Button onClick={() => onClose(action, payload)} autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}
