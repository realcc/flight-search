import { describe, it, expect } from 'vitest'
import {
  formatPrice,
  formatTime,
  formatDate,
  parseDuration,
  formatDurationMinutes,
  getStopsLabel,
  processFlightOffer,
  getUniqueAirlines,
  getPriceRange,
} from '../../src/utils/formatters'
import type { FlightOffer, FlightDictionaries, ProcessedFlight } from '../../src/types'

describe('Formatters', () => {
  describe('formatPrice', () => {
    it('should format USD prices', () => {
      expect(formatPrice(299, 'USD')).toBe('$299')
      expect(formatPrice(1234, 'USD')).toBe('$1,234')
    })

    it('should format EUR prices', () => {
      expect(formatPrice(299, 'EUR')).toMatch(/299/)
    })

    it('should default to USD', () => {
      expect(formatPrice(100)).toBe('$100')
    })
  })

  describe('formatTime', () => {
    it('should format time in 24-hour format', () => {
      expect(formatTime(new Date('2024-01-01T08:30:00'))).toBe('08:30')
      expect(formatTime(new Date('2024-01-01T14:45:00'))).toBe('14:45')
    })
  })

  describe('formatDate', () => {
    it('should format date as MMM d, yyyy', () => {
      expect(formatDate(new Date('2024-12-20'))).toBe('Dec 20, 2024')
    })
  })

  describe('parseDuration', () => {
    it('should parse ISO 8601 durations', () => {
      expect(parseDuration('PT5H30M')).toBe(330)
      expect(parseDuration('PT2H')).toBe(120)
      expect(parseDuration('PT45M')).toBe(45)
    })

    it('should return 0 for invalid durations', () => {
      expect(parseDuration('invalid')).toBe(0)
    })
  })

  describe('formatDurationMinutes', () => {
    it('should format duration in hours and minutes', () => {
      expect(formatDurationMinutes(330)).toBe('5h 30m')
      expect(formatDurationMinutes(120)).toBe('2h')
      expect(formatDurationMinutes(45)).toBe('45m')
    })
  })

  describe('getStopsLabel', () => {
    it('should return correct labels', () => {
      expect(getStopsLabel(0)).toBe('Nonstop')
      expect(getStopsLabel(1)).toBe('1 stop')
      expect(getStopsLabel(2)).toBe('2 stops')
      expect(getStopsLabel(3)).toBe('3 stops')
    })
  })

  describe('processFlightOffer', () => {
    const mockOffer: FlightOffer = {
      type: 'flight-offer',
      id: '1',
      source: 'GDS',
      instantTicketingRequired: false,
      nonHomogeneous: false,
      oneWay: false,
      lastTicketingDate: '2024-12-15',
      numberOfBookableSeats: 9,
      itineraries: [
        {
          duration: 'PT5H30M',
          segments: [
            {
              departure: { iataCode: 'JFK', at: '2024-12-20T08:00:00' },
              arrival: { iataCode: 'LAX', at: '2024-12-20T11:30:00' },
              carrierCode: 'AA',
              number: '123',
              aircraft: { code: '738' },
              duration: 'PT5H30M',
              id: '1',
              numberOfStops: 0,
              blacklistedInEU: false,
            },
          ],
        },
      ],
      price: {
        currency: 'USD',
        total: '299.00',
        base: '250.00',
        grandTotal: '299.00',
      },
      pricingOptions: {
        fareType: ['PUBLISHED'],
        includedCheckedBagsOnly: true,
      },
      validatingAirlineCodes: ['AA'],
      travelerPricings: [],
    }

    const mockDictionaries: FlightDictionaries = {
      locations: {},
      aircraft: { '738': 'BOEING 737-800' },
      currencies: { USD: 'US DOLLAR' },
      carriers: { AA: 'AMERICAN AIRLINES' },
    }

    it('should process flight offer correctly', () => {
      const result = processFlightOffer(mockOffer, mockDictionaries)

      expect(result.id).toBe('1')
      expect(result.airline).toBe('AMERICAN AIRLINES')
      expect(result.airlineCode).toBe('AA')
      expect(result.price).toBe(299)
      expect(result.currency).toBe('USD')
      expect(result.duration).toBe(330)
      expect(result.stops).toBe(0)
      expect(result.origin).toBe('JFK')
      expect(result.destination).toBe('LAX')
    })

    it('should process segments correctly', () => {
      const result = processFlightOffer(mockOffer, mockDictionaries)

      expect(result.segments).toHaveLength(1)
      expect(result.segments[0]).toMatchObject({
        airline: 'AMERICAN AIRLINES',
        flightNumber: 'AA123',
        departureAirport: 'JFK',
        arrivalAirport: 'LAX',
      })
    })
  })

  describe('getUniqueAirlines', () => {
    it('should return unique airlines', () => {
      const flights: ProcessedFlight[] = [
        { airlineCode: 'AA', airline: 'American Airlines' },
        { airlineCode: 'UA', airline: 'United Airlines' },
        { airlineCode: 'AA', airline: 'American Airlines' },
      ] as ProcessedFlight[]

      const result = getUniqueAirlines(flights)
      expect(result).toHaveLength(2)
      expect(result).toContainEqual({ code: 'AA', name: 'American Airlines' })
      expect(result).toContainEqual({ code: 'UA', name: 'United Airlines' })
    })
  })

  describe('getPriceRange', () => {
    it('should return min and max prices', () => {
      const flights: ProcessedFlight[] = [
        { price: 200 },
        { price: 500 },
        { price: 300 },
      ] as ProcessedFlight[]

      const result = getPriceRange(flights)
      expect(result).toEqual([200, 500])
    })

    it('should return default range for empty array', () => {
      const result = getPriceRange([])
      expect(result).toEqual([0, 10000])
    })
  })
})
