import apiClient from '../client'
import type { FlightOffersResponse, FlightSearchParams } from '../../types'

export async function searchFlightOffers(
  params: FlightSearchParams
): Promise<FlightOffersResponse> {
  const queryParams: Record<string, string | number | boolean> = {
    originLocationCode: params.originLocationCode,
    destinationLocationCode: params.destinationLocationCode,
    departureDate: params.departureDate,
    adults: params.adults,
    max: params.max || 250,
    currencyCode: 'USD',
  }

  if (params.returnDate) {
    queryParams.returnDate = params.returnDate
  }

  if (params.children && params.children > 0) {
    queryParams.children = params.children
  }

  if (params.infants && params.infants > 0) {
    queryParams.infants = params.infants
  }

  if (params.travelClass) {
    queryParams.travelClass = params.travelClass
  }

  if (params.nonStop) {
    queryParams.nonStop = true
  }

  if (params.maxPrice) {
    queryParams.maxPrice = params.maxPrice
  }

  const response = await apiClient.get<FlightOffersResponse>(
    '/v2/shopping/flight-offers',
    { params: queryParams }
  )

  return response.data
}
