import { format, formatDuration, intervalToDuration, differenceInCalendarDays } from 'date-fns'
import type { FlightOffer, FlightDictionaries, ProcessedFlight, ProcessedSegment } from '../types'

export function formatPrice(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatTime(date: Date): string {
  return format(date, 'HH:mm')
}

export function formatDate(date: Date): string {
  return format(date, 'MMM d, yyyy')
}

export function formatDateTime(date: Date): string {
  return format(date, 'MMM d, HH:mm')
}

export function parseDuration(isoDuration: string): number {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
  if (!match) return 0
  const hours = parseInt(match[1] || '0', 10)
  const minutes = parseInt(match[2] || '0', 10)
  return hours * 60 + minutes
}

export function formatDurationMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

export function getDayOffset(departureTime: Date, arrivalTime: Date): number {
  return differenceInCalendarDays(arrivalTime, departureTime)
}

export function formatDayOffset(offset: number): string {
  if (offset <= 0) return ''
  if (offset === 1) return '+1 day'
  return `+${offset} days`
}

export function formatDurationFromDates(start: Date, end: Date): string {
  const duration = intervalToDuration({ start, end })
  return formatDuration(duration, { format: ['hours', 'minutes'] })
}

export function calculateLayoverMinutes(prevArrival: Date, nextDeparture: Date): number {
  return Math.round((nextDeparture.getTime() - prevArrival.getTime()) / 60000)
}

export function getStopsLabel(stops: number): string {
  if (stops === 0) return 'Nonstop'
  if (stops === 1) return '1 stop'
  return `${stops} stops`
}

export function processFlightOffer(
  offer: FlightOffer,
  dictionaries: FlightDictionaries
): ProcessedFlight {
  const firstItinerary = offer.itineraries[0]
  const firstSegment = firstItinerary.segments[0]
  const lastSegment = firstItinerary.segments[firstItinerary.segments.length - 1]

  const airlineCode = offer.validatingAirlineCodes[0]
  const airline = dictionaries.carriers[airlineCode] || airlineCode

  const segments: ProcessedSegment[] = firstItinerary.segments.map((seg) => ({
    id: seg.id,
    airline: dictionaries.carriers[seg.carrierCode] || seg.carrierCode,
    flightNumber: `${seg.carrierCode}${seg.number}`,
    departureAirport: seg.departure.iataCode,
    departureTime: new Date(seg.departure.at),
    arrivalAirport: seg.arrival.iataCode,
    arrivalTime: new Date(seg.arrival.at),
    duration: parseDuration(seg.duration),
  }))

  const result: ProcessedFlight = {
    id: offer.id,
    airline,
    airlineCode,
    price: parseFloat(offer.price.grandTotal),
    currency: offer.price.currency,
    departureTime: new Date(firstSegment.departure.at),
    arrivalTime: new Date(lastSegment.arrival.at),
    duration: parseDuration(firstItinerary.duration),
    stops: firstItinerary.segments.length - 1,
    origin: firstSegment.departure.iataCode,
    destination: lastSegment.arrival.iataCode,
    segments,
    rawOffer: offer,
  }

  // Process return flight if present (round-trip)
  const returnItinerary = offer.itineraries[1]
  if (returnItinerary) {
    const returnFirstSegment = returnItinerary.segments[0]
    const returnLastSegment = returnItinerary.segments[returnItinerary.segments.length - 1]

    result.returnDepartureTime = new Date(returnFirstSegment.departure.at)
    result.returnArrivalTime = new Date(returnLastSegment.arrival.at)
    result.returnDuration = parseDuration(returnItinerary.duration)
    result.returnStops = returnItinerary.segments.length - 1
    result.returnSegments = returnItinerary.segments.map((seg) => ({
      id: seg.id,
      airline: dictionaries.carriers[seg.carrierCode] || seg.carrierCode,
      flightNumber: `${seg.carrierCode}${seg.number}`,
      departureAirport: seg.departure.iataCode,
      departureTime: new Date(seg.departure.at),
      arrivalAirport: seg.arrival.iataCode,
      arrivalTime: new Date(seg.arrival.at),
      duration: parseDuration(seg.duration),
    }))
  }

  return result
}

export function getUniqueAirlines(
  flights: ProcessedFlight[]
): { code: string; name: string }[] {
  const airlinesMap = new Map<string, string>()
  flights.forEach((flight) => {
    if (!airlinesMap.has(flight.airlineCode)) {
      airlinesMap.set(flight.airlineCode, flight.airline)
    }
  })
  return Array.from(airlinesMap.entries()).map(([code, name]) => ({
    code,
    name,
  }))
}

export function getPriceRange(flights: ProcessedFlight[]): [number, number] {
  if (flights.length === 0) return [0, 10000]
  const prices = flights.map((f) => f.price)
  return [Math.min(...prices), Math.max(...prices)]
}

export function getDurationRange(flights: ProcessedFlight[]): [number, number] {
  if (flights.length === 0) return [0, 1440]
  const durations = flights.map((f) => f.duration)
  return [Math.min(...durations), Math.max(...durations)]
}
