import { describe, it, expect, beforeEach, vi } from 'vitest'
import { searchLocations, searchFlightOffers } from '../../src/api/endpoints'
import { invalidateToken } from '../../src/api/auth'

describe('API Endpoints', () => {
  beforeEach(() => {
    invalidateToken()
    localStorage.clear()
    vi.stubEnv('VITE_AMADEUS_CLIENT_ID', 'test-client-id')
    vi.stubEnv('VITE_AMADEUS_CLIENT_SECRET', 'test-client-secret')
  })

  describe('searchLocations', () => {
    it('should return empty array for short keywords', async () => {
      const result = await searchLocations({ keyword: 'N' })
      expect(result).toEqual([])
    })

    it('should return locations for valid keywords', async () => {
      const result = await searchLocations({ keyword: 'NYC' })
      expect(result).toHaveLength(2)
      expect(result[0]).toHaveProperty('iataCode', 'JFK')
      expect(result[1]).toHaveProperty('iataCode', 'LGA')
    })

    it('should include location details', async () => {
      const result = await searchLocations({ keyword: 'New York' })
      expect(result[0]).toMatchObject({
        type: 'location',
        subType: 'AIRPORT',
        name: 'JOHN F KENNEDY INTL',
        address: {
          cityName: 'NEW YORK',
          countryCode: 'US',
        },
      })
    })
  })

  describe('searchFlightOffers', () => {
    it('should return flight offers', async () => {
      const result = await searchFlightOffers({
        originLocationCode: 'JFK',
        destinationLocationCode: 'LAX',
        departureDate: '2024-12-20',
        adults: 1,
      })

      expect(result.data).toHaveLength(2)
      expect(result.dictionaries).toBeDefined()
    })

    it('should include price information', async () => {
      const result = await searchFlightOffers({
        originLocationCode: 'JFK',
        destinationLocationCode: 'LAX',
        departureDate: '2024-12-20',
        adults: 1,
      })

      expect(result.data[0].price).toMatchObject({
        currency: 'USD',
        total: '299.00',
      })
    })

    it('should include itinerary details', async () => {
      const result = await searchFlightOffers({
        originLocationCode: 'JFK',
        destinationLocationCode: 'LAX',
        departureDate: '2024-12-20',
        adults: 1,
      })

      const firstFlight = result.data[0]
      expect(firstFlight.itineraries).toHaveLength(1)
      expect(firstFlight.itineraries[0].segments).toHaveLength(1)
    })

    it('should include carrier dictionaries', async () => {
      const result = await searchFlightOffers({
        originLocationCode: 'JFK',
        destinationLocationCode: 'LAX',
        departureDate: '2024-12-20',
        adults: 1,
      })

      expect(result.dictionaries.carriers).toMatchObject({
        AA: 'AMERICAN AIRLINES',
        UA: 'UNITED AIRLINES',
      })
    })
  })
})
