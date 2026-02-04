import { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Fab,
  Badge,
  useMediaQuery,
  useTheme,
  Alert,
} from '@mui/material'
import { FilterList } from '@mui/icons-material'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { theme } from './styles/theme'
import { SearchProvider, useSearch } from './providers'
import { AppLayout, ErrorBoundary, SkeletonCardList } from './components'
import { SearchForm } from './features/search'
import { FlightDataGrid } from './features/results'
import { FilterPanel } from './features/filters'
import { PriceChart } from './features/analytics'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function SearchResults() {
  const muiTheme = useTheme()
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'))
  const [filterOpen, setFilterOpen] = useState(false)

  const {
    hasSearched,
    isLoading,
    isError,
    error,
    filters,
  } = useSearch()

  const activeFilterCount = [
    filters.stops.length > 0,
    filters.priceRange[0] > 0 || filters.priceRange[1] < 10000,
    filters.airlines.length > 0,
    filters.departureTimeRange[0] > 0 || filters.departureTimeRange[1] < 24,
    filters.arrivalTimeRange[0] > 0 || filters.arrivalTimeRange[1] < 24,
    filters.maxDuration !== null,
  ].filter(Boolean).length

  if (!hasSearched) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Find Your Perfect Flight
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Enter your travel details above to search for flights
        </Typography>
      </Paper>
    )
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error?.message || 'Failed to search flights. Please try again.'}
      </Alert>
    )
  }

  if (isLoading) {
    return <SkeletonCardList count={5} />
  }

  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: {
            xs: '1fr',
            md: '280px 1fr',
          },
        }}
      >
        {!isMobile && (
          <Box>
            <FilterPanel open={true} onClose={() => {}} />
          </Box>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <PriceChart />

          <Paper sx={{
            flex: 1,
            minHeight: { xs: 0, sm: 400 },
            backgroundColor: { xs: 'transparent', sm: 'background.paper' },
            boxShadow: { xs: 'none', sm: undefined },
          }}>
            <FlightDataGrid />
          </Paper>
        </Box>
      </Box>

      {isMobile && (
        <>
          <Fab
            color="primary"
            aria-label="Open filters"
            onClick={() => setFilterOpen(true)}
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
            }}
          >
            <Badge badgeContent={activeFilterCount} color="secondary">
              <FilterList />
            </Badge>
          </Fab>
          <FilterPanel open={filterOpen} onClose={() => setFilterOpen(false)} />
        </>
      )}
    </>
  )
}

function AppContent() {
  return (
    <AppLayout>
      <Box sx={{ display: 'grid', width: { md: 'max-content' }, minWidth: '100%' }}>
        <SearchForm />
        <SearchResults />
      </Box>
    </AppLayout>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorBoundary>
          <SearchProvider>
            <AppContent />
          </SearchProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
