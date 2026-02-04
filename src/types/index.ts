export * from './api'

export interface SearchFormValues {
  origin: LocationOption | null
  destination: LocationOption | null
  departureDate: Date | null
  returnDate: Date | null
  adults: number
  children: number
  infants: number
  travelClass: TravelClass
  tripType: TripType
}

export interface LocationOption {
  iataCode: string
  name: string
  cityName: string
  countryCode: string
  subType: 'AIRPORT' | 'CITY'
}

export type TravelClass = 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST'

export type TripType = 'roundTrip' | 'oneWay'

export interface FilterState {
  stops: number[]
  priceRange: [number, number]
  airlines: string[]
  departureTimeRange: [number, number]
  arrivalTimeRange: [number, number]
  maxDuration: number | null
}

export interface ProcessedFlight {
  id: string
  airline: string
  airlineCode: string
  price: number
  currency: string
  departureTime: Date
  arrivalTime: Date
  duration: number
  stops: number
  origin: string
  destination: string
  segments: ProcessedSegment[]
  rawOffer: import('./api').FlightOffer

  // Return flight (for round-trips)
  returnDepartureTime?: Date
  returnArrivalTime?: Date
  returnDuration?: number
  returnStops?: number
  returnSegments?: ProcessedSegment[]
}

export interface ProcessedSegment {
  id: string
  airline: string
  flightNumber: string
  departureAirport: string
  departureTime: Date
  arrivalAirport: string
  arrivalTime: Date
  duration: number
}

export interface PriceChartData {
  hour: string
  price: number
  count: number
}

export interface GridPreferences {
  columnVisibility: Record<string, boolean>
  sortModel: { field: string; sort: 'asc' | 'desc' }[]
}
