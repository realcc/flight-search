import apiClient from '../client'
import type { LocationSearchResponse, Location } from '../../types'

export interface LocationSearchParams {
  keyword: string
  subType?: 'AIRPORT' | 'CITY' | 'AIRPORT,CITY'
}

export async function searchLocations(
  params: LocationSearchParams
): Promise<Location[]> {
  if (!params.keyword || params.keyword.length < 2) {
    return []
  }

  const response = await apiClient.get<LocationSearchResponse>(
    '/v1/reference-data/locations',
    {
      params: {
        keyword: params.keyword,
        subType: params.subType || 'AIRPORT,CITY',
        'page[limit]': 10,
      },
    }
  )

  return response.data.data
}
