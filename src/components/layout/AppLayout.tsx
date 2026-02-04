import { type ReactNode } from 'react'
import { Box, Container } from '@mui/material'
import { Header } from './Header'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Container
        maxWidth="xl"
        sx={{
          flex: 1,
          py: { xs: 2, md: 3 },
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </Container>
    </Box>
  )
}
