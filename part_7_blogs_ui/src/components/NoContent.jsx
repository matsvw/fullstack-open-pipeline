import { Typography, Box, Container } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'

const NoContent = ({ isError, isLoading, noUser }) => {
  const msg = isError
    ? 'There was an unhandled error loading data'
    : noUser
      ? 'Log in to see data'
      : ''

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center', // horizontal center
        alignItems: 'center', // vertical center
        height: '60vh', // full viewport height
      }}
    >
      {isLoading && <CircularProgress color="inherit" sx={{ mt: '2rem' }} />}
      {!isLoading && (
        <Typography variant="h5" component="div" sx={{ mb: '1.5rem' }}>
          {msg}
        </Typography>
      )}
    </Box>
  )
}

export default NoContent
