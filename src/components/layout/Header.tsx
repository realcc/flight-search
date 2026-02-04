import { AppBar, Toolbar, Typography, Box } from '@mui/material'
import { FlightTakeoff } from '@mui/icons-material'

export function Header() {
  return (
    <AppBar position="static" color="primary" elevation={0} sx={{ borderRadius: 0 }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FlightTakeoff />
          <Typography variant="h6" component="h1">
            Flight Search
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
