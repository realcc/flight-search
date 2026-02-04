import { describe, it, expect } from 'vitest'
import {
  transformFlightsToChartData,
  calculateAveragePrice,
  getMinMaxPrices,
} from '../../src/services/chartDataTransform'
import type { ProcessedFlight } from '../../src/types'

describe('Chart Data Transform', () => {
  const createMockFlight = (hour: number, price: number): ProcessedFlight => ({
    id: `${hour}-${price}`,
    airline: 'Test Airline',
    airlineCode: 'TA',
    price,
    currency: 'USD',
    departureTime: new Date(`2024-12-20T${hour.toString().padStart(2, '0')}:00:00`),
    arrivalTime: new Date(`2024-12-20T${(hour + 3).toString().padStart(2, '0')}:00:00`),
    duration: 180,
    stops: 0,
    origin: 'JFK',
    destination: 'LAX',
    segments: [],
    rawOffer: {} as any,
  })

  describe('transformFlightsToChartData', () => {
    it('should return empty array for no flights', () => {
      const result = transformFlightsToChartData([])
      expect(result).toEqual([])
    })

    it('should group flights by departure hour', () => {
      const flights = [
        createMockFlight(8, 200),
        createMockFlight(8, 300),
        createMockFlight(10, 250),
      ]

      const result = transformFlightsToChartData(flights)

      expect(result).toHaveLength(2)
      expect(result.find((d) => d.hour === '8 AM')).toBeDefined()
      expect(result.find((d) => d.hour === '10 AM')).toBeDefined()
    })

    it('should calculate average price per hour', () => {
      const flights = [
        createMockFlight(8, 200),
        createMockFlight(8, 400),
      ]

      const result = transformFlightsToChartData(flights)
      const hour8 = result.find((d) => d.hour === '8 AM')

      expect(hour8?.price).toBe(300)
      expect(hour8?.count).toBe(2)
    })

    it('should sort by hour', () => {
      const flights = [
        createMockFlight(14, 200),
        createMockFlight(8, 250),
        createMockFlight(12, 300),
      ]

      const result = transformFlightsToChartData(flights)
      const hours = result.map((d) => d.hour)

      expect(hours).toEqual(['8 AM', '12 PM', '2 PM'])
    })

    it('should format hours correctly (AM/PM)', () => {
      const flights = [
        createMockFlight(0, 200),
        createMockFlight(12, 250),
        createMockFlight(23, 300),
      ]

      const result = transformFlightsToChartData(flights)
      const hours = result.map((d) => d.hour)

      expect(hours).toContain('12 AM')
      expect(hours).toContain('12 PM')
      expect(hours).toContain('11 PM')
    })
  })

  describe('calculateAveragePrice', () => {
    it('should return 0 for empty array', () => {
      expect(calculateAveragePrice([])).toBe(0)
    })

    it('should calculate average correctly', () => {
      const flights = [
        createMockFlight(8, 200),
        createMockFlight(9, 300),
        createMockFlight(10, 500),
      ]

      expect(calculateAveragePrice(flights)).toBe(333)
    })

    it('should round to nearest integer', () => {
      const flights = [
        createMockFlight(8, 100),
        createMockFlight(9, 200),
      ]

      expect(calculateAveragePrice(flights)).toBe(150)
    })
  })

  describe('getMinMaxPrices', () => {
    it('should return 0,0 for empty array', () => {
      expect(getMinMaxPrices([])).toEqual({ min: 0, max: 0 })
    })

    it('should find min and max prices', () => {
      const flights = [
        createMockFlight(8, 500),
        createMockFlight(9, 200),
        createMockFlight(10, 300),
      ]

      expect(getMinMaxPrices(flights)).toEqual({ min: 200, max: 500 })
    })

    it('should handle single flight', () => {
      const flights = [createMockFlight(8, 250)]

      expect(getMinMaxPrices(flights)).toEqual({ min: 250, max: 250 })
    })
  })
})
