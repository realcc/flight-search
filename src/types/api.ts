export interface AmadeusAuthResponse {
  type: string
  username: string
  application_name: string
  client_id: string
  token_type: string
  access_token: string
  expires_in: number
  state: string
  scope: string
}

export interface LocationAddress {
  cityName: string
  cityCode: string
  countryName: string
  countryCode: string
  regionCode?: string
}

export interface Location {
  type: string
  subType: 'AIRPORT' | 'CITY'
  name: string
  detailedName: string
  id: string
  iataCode: string
  address: LocationAddress
}

export interface LocationSearchResponse {
  meta: { count: number }
  data: Location[]
}

export interface FlightSegment {
  departure: {
    iataCode: string
    terminal?: string
    at: string
  }
  arrival: {
    iataCode: string
    terminal?: string
    at: string
  }
  carrierCode: string
  number: string
  aircraft: { code: string }
  operating?: { carrierCode: string }
  duration: string
  id: string
  numberOfStops: number
  blacklistedInEU: boolean
}

export interface FlightItinerary {
  duration: string
  segments: FlightSegment[]
}

export interface FlightPrice {
  currency: string
  total: string
  base: string
  fees?: { amount: string; type: string }[]
  grandTotal: string
}

export interface TravelerPricing {
  travelerId: string
  fareOption: string
  travelerType: 'ADULT' | 'CHILD' | 'INFANT'
  price: {
    currency: string
    total: string
    base: string
  }
  fareDetailsBySegment: {
    segmentId: string
    cabin: string
    fareBasis: string
    class: string
    includedCheckedBags?: {
      weight?: number
      weightUnit?: string
      quantity?: number
    }
  }[]
}

export interface FlightOffer {
  type: string
  id: string
  source: string
  instantTicketingRequired: boolean
  nonHomogeneous: boolean
  oneWay: boolean
  lastTicketingDate: string
  numberOfBookableSeats: number
  itineraries: FlightItinerary[]
  price: FlightPrice
  pricingOptions: {
    fareType: string[]
    includedCheckedBagsOnly: boolean
  }
  validatingAirlineCodes: string[]
  travelerPricings: TravelerPricing[]
}

export interface FlightDictionaries {
  locations: Record<string, { cityCode: string; countryCode: string }>
  aircraft: Record<string, string>
  currencies: Record<string, string>
  carriers: Record<string, string>
}

export interface FlightOffersResponse {
  meta: { count: number }
  data: FlightOffer[]
  dictionaries: FlightDictionaries
}

export interface FlightSearchParams {
  originLocationCode: string
  destinationLocationCode: string
  departureDate: string
  returnDate?: string
  adults: number
  children?: number
  infants?: number
  travelClass?: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST'
  nonStop?: boolean
  maxPrice?: number
  max?: number
}
