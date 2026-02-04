import { Box, CircularProgress, Typography } from '@mui/material'

interface LoadingOverlayProps {
  message?: string
}

export function LoadingOverlay({ message = 'Loading...' }: LoadingOverlayProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
    </Box>
  )
}
