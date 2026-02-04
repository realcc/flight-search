import { useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { Box, Paper, Typography, useTheme } from '@mui/material'
import { useSearch } from '../../providers'
import {
  transformFlightsToChartData,
  calculateAveragePrice,
} from '../../services/chartDataTransform'
import { formatPrice } from '../../utils/formatters'

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    value: number
    payload: { hour: string; price: number; count: number }
  }>
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  const data = payload[0].payload

  return (
    <Paper sx={{ p: 1.5 }}>
      <Typography variant="subtitle2">{label}</Typography>
      <Typography variant="body2" color="primary">
        Average: {formatPrice(data.price)}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {data.count} flight{data.count !== 1 ? 's' : ''}
      </Typography>
    </Paper>
  )
}

export function PriceChart() {
  const theme = useTheme()
  const { filteredFlights, flights, hasSearched } = useSearch()

  const chartData = useMemo(
    () => transformFlightsToChartData(filteredFlights),
    [filteredFlights]
  )

  const averagePrice = useMemo(
    () => calculateAveragePrice(filteredFlights),
    [filteredFlights]
  )

  if (!hasSearched) {
    return null
  }

  if (flights.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No flight data available for price analysis
        </Typography>
      </Paper>
    )
  }

  if (chartData.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No flights match current filters
        </Typography>
      </Paper>
    )
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Price by Departure Time
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Average price: {formatPrice(averagePrice)} ({filteredFlights.length} flights)
        </Typography>
      </Box>

      <Box sx={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis
              dataKey="hour"
              tick={{ fontSize: 12 }}
              stroke={theme.palette.text.secondary}
            />
            <YAxis
              tickFormatter={(value) => `$${value}`}
              tick={{ fontSize: 12 }}
              stroke={theme.palette.text.secondary}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <ReferenceLine
              y={averagePrice}
              stroke={theme.palette.secondary.main}
              strokeDasharray="5 5"
              label={{
                value: `Avg: ${formatPrice(averagePrice)}`,
                position: 'right',
                fill: theme.palette.secondary.main,
                fontSize: 12,
              }}
            />
            <Line
              type="monotone"
              dataKey="price"
              name="Average Price"
              stroke={theme.palette.primary.main}
              strokeWidth={2}
              dot={{ fill: theme.palette.primary.main, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  )
}
