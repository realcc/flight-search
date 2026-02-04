import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material'
import { theme } from '../../src/styles/theme'
import { FlightCard } from '../../src/features/results/FlightCard'
import type { ProcessedFlight } from '../../src/types'

const renderWithTheme = (component: React.ReactNode) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>)
}

describe('FlightCard', () => {
  const mockFlight: ProcessedFlight = {
    id: '1',
    airline: 'American Airlines',
    airlineCode: 'AA',
    price: 299,
    currency: 'USD',
    departureTime: new Date('2024-12-20T08:00:00'),
    arrivalTime: new Date('2024-12-20T11:30:00'),
    duration: 330,
    stops: 0,
    origin: 'JFK',
    destination: 'LAX',
    segments: [
      {
        id: '1',
        airline: 'American Airlines',
        flightNumber: 'AA123',
        departureAirport: 'JFK',
        departureTime: new Date('2024-12-20T08:00:00'),
        arrivalAirport: 'LAX',
        arrivalTime: new Date('2024-12-20T11:30:00'),
        duration: 330,
      },
    ],
    rawOffer: {} as any,
  }

  it('should display airline name', () => {
    renderWithTheme(<FlightCard flight={mockFlight} />)
    expect(screen.getByText('American Airlines')).toBeInTheDocument()
  })

  it('should display price', () => {
    renderWithTheme(<FlightCard flight={mockFlight} />)
    expect(screen.getByText('$299')).toBeInTheDocument()
  })

  it('should display departure and arrival times', () => {
    renderWithTheme(<FlightCard flight={mockFlight} />)
    expect(screen.getByText('08:00')).toBeInTheDocument()
    expect(screen.getByText('11:30')).toBeInTheDocument()
  })

  it('should display origin and destination codes', () => {
    renderWithTheme(<FlightCard flight={mockFlight} />)
    expect(screen.getByText('JFK')).toBeInTheDocument()
    expect(screen.getByText('LAX')).toBeInTheDocument()
  })

  it('should display duration', () => {
    renderWithTheme(<FlightCard flight={mockFlight} />)
    expect(screen.getByText('5h 30m')).toBeInTheDocument()
  })

  it('should display nonstop label for direct flights', () => {
    renderWithTheme(<FlightCard flight={mockFlight} />)
    expect(screen.getByText('Nonstop')).toBeInTheDocument()
  })

  it('should display stop count for connecting flights', () => {
    const connectingFlight: ProcessedFlight = {
      ...mockFlight,
      stops: 1,
      segments: [
        mockFlight.segments[0],
        {
          id: '2',
          airline: 'American Airlines',
          flightNumber: 'AA456',
          departureAirport: 'DEN',
          departureTime: new Date('2024-12-20T13:00:00'),
          arrivalAirport: 'LAX',
          arrivalTime: new Date('2024-12-20T15:00:00'),
          duration: 120,
        },
      ],
    }
    renderWithTheme(<FlightCard flight={connectingFlight} />)
    expect(screen.getByText('1 stop')).toBeInTheDocument()
  })

  it('should display layover airports for connecting flights', () => {
    const connectingFlight: ProcessedFlight = {
      ...mockFlight,
      stops: 1,
      segments: [
        mockFlight.segments[0],
        {
          id: '2',
          airline: 'American Airlines',
          flightNumber: 'AA456',
          departureAirport: 'DEN',
          departureTime: new Date('2024-12-20T13:00:00'),
          arrivalAirport: 'LAX',
          arrivalTime: new Date('2024-12-20T15:00:00'),
          duration: 120,
        },
      ],
    }
    renderWithTheme(<FlightCard flight={connectingFlight} />)
    expect(screen.getByText(/DEN/)).toBeInTheDocument()
  })
})
