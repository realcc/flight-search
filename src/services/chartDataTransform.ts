import type { ProcessedFlight, PriceChartData } from '../types'

export function transformFlightsToChartData(flights: ProcessedFlight[]): PriceChartData[] {
  if (flights.length === 0) {
    return []
  }

  const hourlyData = new Map<number, { total: number; count: number }>()

  for (let i = 0; i < 24; i++) {
    hourlyData.set(i, { total: 0, count: 0 })
  }

  flights.forEach((flight) => {
    const hour = flight.departureTime.getHours()
    const existing = hourlyData.get(hour)!
    existing.total += flight.price
    existing.count += 1
  })

  const chartData: PriceChartData[] = []

  hourlyData.forEach((data, hour) => {
    if (data.count > 0) {
      chartData.push({
        hour: formatHour(hour),
        price: Math.round(data.total / data.count),
        count: data.count,
      })
    }
  })

  chartData.sort((a, b) => {
    const hourA = parseHour(a.hour)
    const hourB = parseHour(b.hour)
    return hourA - hourB
  })

  return chartData
}

function formatHour(hour: number): string {
  if (hour === 0) return '12 AM'
  if (hour === 12) return '12 PM'
  if (hour < 12) return `${hour} AM`
  return `${hour - 12} PM`
}

function parseHour(hourStr: string): number {
  const match = hourStr.match(/(\d+)\s*(AM|PM)/i)
  if (!match) return 0
  let hour = parseInt(match[1], 10)
  const isPM = match[2].toUpperCase() === 'PM'
  if (hour === 12) {
    return isPM ? 12 : 0
  }
  return isPM ? hour + 12 : hour
}

export function calculateAveragePrice(flights: ProcessedFlight[]): number {
  if (flights.length === 0) return 0
  const total = flights.reduce((sum, flight) => sum + flight.price, 0)
  return Math.round(total / flights.length)
}

export function getMinMaxPrices(flights: ProcessedFlight[]): { min: number; max: number } {
  if (flights.length === 0) return { min: 0, max: 0 }
  const prices = flights.map((f) => f.price)
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  }
}
