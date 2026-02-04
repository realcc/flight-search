export const API_BASE_URL = import.meta.env.VITE_AMADEUS_BASE_URL || 'https://test.api.amadeus.com'

export const TRAVEL_CLASS_OPTIONS = [
  { value: 'ECONOMY', label: 'Economy' },
  { value: 'PREMIUM_ECONOMY', label: 'Premium Economy' },
  { value: 'BUSINESS', label: 'Business' },
  { value: 'FIRST', label: 'First Class' },
] as const

export const TRIP_TYPE_OPTIONS = [
  { value: 'roundTrip', label: 'Round Trip' },
  { value: 'oneWay', label: 'One Way' },
] as const

export const MAX_PASSENGERS = 9
export const MAX_ADULTS = 9
export const MAX_CHILDREN = 8
export const MAX_INFANTS = 4

export const DEBOUNCE_DELAY = 300

export const STORAGE_KEYS = {
  GRID_PREFERENCES: 'flight-search-grid-preferences',
  RECENT_SEARCHES: 'flight-search-recent-searches',
  AUTH_TOKEN: 'flight-search-auth-token',
} as const

export const DEFAULT_FILTER_STATE = {
  stops: [],
  priceRange: [0, 10000] as [number, number],
  airlines: [],
  departureTimeRange: [0, 24] as [number, number],
  arrivalTimeRange: [0, 24] as [number, number],
  maxDuration: null,
}
