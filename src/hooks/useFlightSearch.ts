import { useQuery } from '@tanstack/react-query'
import { searchFlightOffers } from '../api'
import type { FlightSearchParams, ProcessedFlight, FlightDictionaries } from '../types'
import { processFlightOffer } from '../utils/formatters'

interface UseFlightSearchResult {
  flights: ProcessedFlight[]
  dictionaries: FlightDictionaries | null
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: () => void
}

export function useFlightSearch(
  params: FlightSearchParams | null,
  enabled: boolean = true
): UseFlightSearchResult {
  const query = useQuery({
    queryKey: ['flights', params],
    queryFn: () => searchFlightOffers(params!),
    enabled: enabled && params !== null,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  })

  const flights = query.data
    ? query.data.data.map((offer) =>
        processFlightOffer(offer, query.data.dictionaries)
      )
    : []

  return {
    flights,
    dictionaries: query.data?.dictionaries || null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}
