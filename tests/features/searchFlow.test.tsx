import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@mui/material'
import { theme } from '../../src/styles/theme'
import { SearchProvider, useSearch } from '../../src/providers'
import { invalidateToken } from '../../src/api/auth'

function SearchTestComponent() {
  const {
    hasSearched,
    isLoading,
    flights,
    filteredFlights,
    filters,
    setFilters,
  } = useSearch()

  return (
    <div>
      <div data-testid="has-searched">{hasSearched ? 'true' : 'false'}</div>
      <div data-testid="is-loading">{isLoading ? 'true' : 'false'}</div>
      <div data-testid="flights-count">{flights.length}</div>
      <div data-testid="filtered-flights-count">{filteredFlights.length}</div>
      <div data-testid="stops-filter">{JSON.stringify(filters.stops)}</div>
      <button
        onClick={() => setFilters((prev) => ({ ...prev, stops: [0] }))}
        data-testid="set-nonstop-filter"
      >
        Nonstop Only
      </button>
      <button
        onClick={() => setFilters((prev) => ({ ...prev, airlines: ['AA'] }))}
        data-testid="set-airline-filter"
      >
        AA Only
      </button>
    </div>
  )
}

const renderWithProviders = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <SearchProvider>
          <SearchTestComponent />
        </SearchProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

describe('Search Flow Integration', () => {
  beforeEach(() => {
    invalidateToken()
    localStorage.clear()
    vi.stubEnv('VITE_AMADEUS_CLIENT_ID', 'test-client-id')
    vi.stubEnv('VITE_AMADEUS_CLIENT_SECRET', 'test-client-secret')
  })

  it('should start with no search performed', () => {
    renderWithProviders()

    expect(screen.getByTestId('has-searched').textContent).toBe('false')
    expect(screen.getByTestId('flights-count').textContent).toBe('0')
  })

  it('should apply stops filter correctly', async () => {
    renderWithProviders()

    expect(screen.getByTestId('stops-filter').textContent).toBe('[]')

    fireEvent.click(screen.getByTestId('set-nonstop-filter'))

    await waitFor(() => {
      expect(screen.getByTestId('stops-filter').textContent).toBe('[0]')
    })
  })

  it('should maintain filter state across renders', async () => {
    const user = userEvent.setup()
    renderWithProviders()

    await user.click(screen.getByTestId('set-nonstop-filter'))
    await user.click(screen.getByTestId('set-airline-filter'))

    expect(screen.getByTestId('stops-filter').textContent).toBe('[0]')
  })
})
