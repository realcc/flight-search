import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react'
import { format } from 'date-fns'
import { useFlightSearch } from '../hooks/useFlightSearch'
import {
  type SearchFormValues,
  type FilterState,
  type ProcessedFlight,
  type FlightSearchParams,
  type FlightDictionaries,
} from '../types'
import {
  DEFAULT_FILTER_STATE,
  getPriceRange,
  getUniqueAirlines,
  getDurationRange,
} from '../utils'

interface SearchContextValue {
  searchParams: SearchFormValues | null
  setSearchParams: (params: SearchFormValues) => void
  flights: ProcessedFlight[]
  filteredFlights: ProcessedFlight[]
  dictionaries: FlightDictionaries | null
  isLoading: boolean
  isError: boolean
  error: Error | null
  hasSearched: boolean
  filters: FilterState
  setFilters: (filters: FilterState | ((prev: FilterState) => FilterState)) => void
  resetFilters: () => void
  availableAirlines: { code: string; name: string }[]
  priceRange: [number, number]
  durationRange: [number, number]
}

const SearchContext = createContext<SearchContextValue | null>(null)

interface SearchProviderProps {
  children: ReactNode
}

export function SearchProvider({ children }: SearchProviderProps) {
  const [searchParams, setSearchParamsState] = useState<SearchFormValues | null>(null)
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTER_STATE)
  const [hasSearched, setHasSearched] = useState(false)

  const apiParams: FlightSearchParams | null = useMemo(() => {
    if (!searchParams?.origin || !searchParams?.destination || !searchParams?.departureDate) {
      return null
    }

    return {
      originLocationCode: searchParams.origin.iataCode,
      destinationLocationCode: searchParams.destination.iataCode,
      departureDate: format(searchParams.departureDate, 'yyyy-MM-dd'),
      returnDate:
        searchParams.tripType === 'roundTrip' && searchParams.returnDate
          ? format(searchParams.returnDate, 'yyyy-MM-dd')
          : undefined,
      adults: searchParams.adults,
      children: searchParams.children > 0 ? searchParams.children : undefined,
      infants: searchParams.infants > 0 ? searchParams.infants : undefined,
      travelClass: searchParams.travelClass,
    }
  }, [searchParams])

  const { flights, dictionaries, isLoading, isError, error } = useFlightSearch(
    apiParams,
    hasSearched
  )

  const priceRange = useMemo(() => getPriceRange(flights), [flights])
  const durationRange = useMemo(() => getDurationRange(flights), [flights])
  const availableAirlines = useMemo(() => getUniqueAirlines(flights), [flights])

  const filteredFlights = useMemo(() => {
    return flights.filter((flight) => {
      if (filters.stops.length > 0) {
        const outboundCategory = flight.stops >= 2 ? 2 : flight.stops
        if (!filters.stops.includes(outboundCategory)) {
          return false
        }
        if (flight.returnStops !== undefined) {
          const returnCategory = flight.returnStops >= 2 ? 2 : flight.returnStops
          if (!filters.stops.includes(returnCategory)) {
            return false
          }
        }
      }

      if (
        flight.price < filters.priceRange[0] ||
        flight.price > filters.priceRange[1]
      ) {
        return false
      }

      if (
        filters.airlines.length > 0 &&
        !filters.airlines.includes(flight.airlineCode)
      ) {
        return false
      }

      const departureHour = flight.departureTime.getHours()
      if (
        departureHour < filters.departureTimeRange[0] ||
        departureHour > filters.departureTimeRange[1]
      ) {
        return false
      }

      const arrivalHour = flight.arrivalTime.getHours()
      if (
        arrivalHour < filters.arrivalTimeRange[0] ||
        arrivalHour > filters.arrivalTimeRange[1]
      ) {
        return false
      }

      if (filters.maxDuration !== null && flight.duration > filters.maxDuration) {
        return false
      }

      return true
    })
  }, [flights, filters])

  const setSearchParams = useCallback((params: SearchFormValues) => {
    setSearchParamsState(params)
    setHasSearched(true)
    setFilters(DEFAULT_FILTER_STATE)
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTER_STATE)
  }, [])

  const value: SearchContextValue = {
    searchParams,
    setSearchParams,
    flights,
    filteredFlights,
    dictionaries,
    isLoading,
    isError,
    error,
    hasSearched,
    filters,
    setFilters,
    resetFilters,
    availableAirlines,
    priceRange,
    durationRange,
  }

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}
