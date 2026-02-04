import { http, HttpResponse } from 'msw'

const BASE_URL = 'https://test.api.amadeus.com'

export const handlers = [
  http.post(`${BASE_URL}/v1/security/oauth2/token`, () => {
    return HttpResponse.json({
      type: 'amadeusOAuth2Token',
      username: 'test@test.com',
      application_name: 'Test App',
      client_id: 'test-client-id',
      token_type: 'Bearer',
      access_token: 'test-access-token',
      expires_in: 1799,
      state: 'approved',
      scope: '',
    })
  }),

  http.get(`${BASE_URL}/v1/reference-data/locations`, ({ request }) => {
    const url = new URL(request.url)
    const keyword = url.searchParams.get('keyword')

    if (!keyword || keyword.length < 2) {
      return HttpResponse.json({ data: [] })
    }

    return HttpResponse.json({
      meta: { count: 2 },
      data: [
        {
          type: 'location',
          subType: 'AIRPORT',
          name: 'JOHN F KENNEDY INTL',
          detailedName: 'NEW YORK/JOHN F KENNEDY INTL',
          id: 'AJFK',
          iataCode: 'JFK',
          address: {
            cityName: 'NEW YORK',
            cityCode: 'NYC',
            countryName: 'UNITED STATES OF AMERICA',
            countryCode: 'US',
            regionCode: 'NAMER',
          },
        },
        {
          type: 'location',
          subType: 'AIRPORT',
          name: 'LA GUARDIA',
          detailedName: 'NEW YORK/LA GUARDIA',
          id: 'ALGA',
          iataCode: 'LGA',
          address: {
            cityName: 'NEW YORK',
            cityCode: 'NYC',
            countryName: 'UNITED STATES OF AMERICA',
            countryCode: 'US',
            regionCode: 'NAMER',
          },
        },
      ],
    })
  }),

  http.get(`${BASE_URL}/v2/shopping/flight-offers`, () => {
    return HttpResponse.json({
      meta: { count: 2 },
      data: [
        {
          type: 'flight-offer',
          id: '1',
          source: 'GDS',
          instantTicketingRequired: false,
          nonHomogeneous: false,
          oneWay: false,
          lastTicketingDate: '2024-12-15',
          numberOfBookableSeats: 9,
          itineraries: [
            {
              duration: 'PT5H30M',
              segments: [
                {
                  departure: {
                    iataCode: 'JFK',
                    terminal: '1',
                    at: '2024-12-20T08:00:00',
                  },
                  arrival: {
                    iataCode: 'LAX',
                    terminal: '4',
                    at: '2024-12-20T11:30:00',
                  },
                  carrierCode: 'AA',
                  number: '123',
                  aircraft: { code: '738' },
                  operating: { carrierCode: 'AA' },
                  duration: 'PT5H30M',
                  id: '1',
                  numberOfStops: 0,
                  blacklistedInEU: false,
                },
              ],
            },
          ],
          price: {
            currency: 'USD',
            total: '299.00',
            base: '250.00',
            fees: [{ amount: '0.00', type: 'SUPPLIER' }],
            grandTotal: '299.00',
          },
          pricingOptions: {
            fareType: ['PUBLISHED'],
            includedCheckedBagsOnly: true,
          },
          validatingAirlineCodes: ['AA'],
          travelerPricings: [
            {
              travelerId: '1',
              fareOption: 'STANDARD',
              travelerType: 'ADULT',
              price: { currency: 'USD', total: '299.00', base: '250.00' },
              fareDetailsBySegment: [
                {
                  segmentId: '1',
                  cabin: 'ECONOMY',
                  fareBasis: 'EOBAU',
                  class: 'E',
                  includedCheckedBags: { weight: 23, weightUnit: 'KG' },
                },
              ],
            },
          ],
        },
        {
          type: 'flight-offer',
          id: '2',
          source: 'GDS',
          instantTicketingRequired: false,
          nonHomogeneous: false,
          oneWay: false,
          lastTicketingDate: '2024-12-15',
          numberOfBookableSeats: 5,
          itineraries: [
            {
              duration: 'PT7H15M',
              segments: [
                {
                  departure: {
                    iataCode: 'JFK',
                    terminal: '2',
                    at: '2024-12-20T10:00:00',
                  },
                  arrival: {
                    iataCode: 'DEN',
                    terminal: 'E',
                    at: '2024-12-20T13:00:00',
                  },
                  carrierCode: 'UA',
                  number: '456',
                  aircraft: { code: '320' },
                  operating: { carrierCode: 'UA' },
                  duration: 'PT4H00M',
                  id: '2',
                  numberOfStops: 0,
                  blacklistedInEU: false,
                },
                {
                  departure: {
                    iataCode: 'DEN',
                    terminal: 'E',
                    at: '2024-12-20T14:15:00',
                  },
                  arrival: {
                    iataCode: 'LAX',
                    terminal: '7',
                    at: '2024-12-20T16:15:00',
                  },
                  carrierCode: 'UA',
                  number: '789',
                  aircraft: { code: '737' },
                  operating: { carrierCode: 'UA' },
                  duration: 'PT2H00M',
                  id: '3',
                  numberOfStops: 0,
                  blacklistedInEU: false,
                },
              ],
            },
          ],
          price: {
            currency: 'USD',
            total: '249.00',
            base: '200.00',
            fees: [{ amount: '0.00', type: 'SUPPLIER' }],
            grandTotal: '249.00',
          },
          pricingOptions: {
            fareType: ['PUBLISHED'],
            includedCheckedBagsOnly: true,
          },
          validatingAirlineCodes: ['UA'],
          travelerPricings: [
            {
              travelerId: '1',
              fareOption: 'STANDARD',
              travelerType: 'ADULT',
              price: { currency: 'USD', total: '249.00', base: '200.00' },
              fareDetailsBySegment: [
                {
                  segmentId: '2',
                  cabin: 'ECONOMY',
                  fareBasis: 'KOBAU',
                  class: 'K',
                  includedCheckedBags: { weight: 23, weightUnit: 'KG' },
                },
                {
                  segmentId: '3',
                  cabin: 'ECONOMY',
                  fareBasis: 'KOBAU',
                  class: 'K',
                  includedCheckedBags: { weight: 23, weightUnit: 'KG' },
                },
              ],
            },
          ],
        },
      ],
      dictionaries: {
        locations: {
          JFK: { cityCode: 'NYC', countryCode: 'US' },
          LAX: { cityCode: 'LAX', countryCode: 'US' },
          DEN: { cityCode: 'DEN', countryCode: 'US' },
        },
        aircraft: {
          '738': 'BOEING 737-800',
          '320': 'AIRBUS A320',
          '737': 'BOEING 737',
        },
        currencies: { USD: 'US DOLLAR' },
        carriers: { AA: 'AMERICAN AIRLINES', UA: 'UNITED AIRLINES' },
      },
    })
  }),
]
