import { useQuery } from '@tanstack/react-query'
import { searchLocations } from '../api'
import { useDebounce } from './useDebounce'
import { DEBOUNCE_DELAY } from '../utils/constants'

export function useLocationSearch(keyword: string) {
  const debouncedKeyword = useDebounce(keyword, DEBOUNCE_DELAY)

  return useQuery({
    queryKey: ['locations', debouncedKeyword],
    queryFn: () => searchLocations({ keyword: debouncedKeyword }),
    enabled: debouncedKeyword.length >= 2,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}
