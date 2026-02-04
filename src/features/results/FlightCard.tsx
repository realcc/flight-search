import { useState } from 'react'
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  Divider,
} from '@mui/material'
import { FlightTakeoff, FlightLand, AccessTime } from '@mui/icons-material'
import { formatPrice, formatTime, formatDurationMinutes, getStopsLabel, getDayOffset, formatDayOffset } from '../../utils/formatters'
import type { ProcessedFlight, ProcessedSegment } from '../../types'
import { StopDetailsPopup } from './StopDetailsPopup'

interface FlightCardProps {
  flight: ProcessedFlight
}

interface FlightLegProps {
  label: string
  departureTime: Date
  arrivalTime: Date
  origin: string
  destination: string
  duration: number
  stops: number
  stopAirports?: string[]
  segments: ProcessedSegment[]
}

function FlightLeg({ label, departureTime, arrivalTime, origin, destination, duration, stops, stopAirports, segments }: FlightLegProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const isInteractive = stops > 0

  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
        {label}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ textAlign: 'center', flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
            <FlightTakeoff fontSize="small" color="action" />
            <Typography variant="h6" fontWeight={500}>
              {formatTime(departureTime)}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {origin}
          </Typography>
        </Box>

        <Box sx={{ flex: 1, textAlign: 'center', px: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 0.5 }}>
            <AccessTime fontSize="small" color="action" />
            <Typography variant="body2">
              {formatDurationMinutes(duration)}
            </Typography>
          </Box>
          <Divider sx={{ my: 0.5 }} />
          {isInteractive ? (
            <>
              <Chip
                label={getStopsLabel(stops)}
                size="small"
                color="default"
                variant="outlined"
                onClick={handleClick}
                sx={{ cursor: 'pointer' }}
              />
              <StopDetailsPopup
                segments={segments}
                anchorEl={anchorEl}
                onClose={handleClose}
              />
            </>
          ) : (
            <Chip
              label={getStopsLabel(stops)}
              size="small"
              color="success"
              variant="filled"
            />
          )}
        </Box>

        <Box sx={{ textAlign: 'center', flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
            <FlightLand fontSize="small" color="action" />
            <Typography variant="h6" fontWeight={500}>
              {formatTime(arrivalTime)}
            </Typography>
            {getDayOffset(departureTime, arrivalTime) > 0 && (
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                {formatDayOffset(getDayOffset(departureTime, arrivalTime))}
              </Typography>
            )}
          </Box>
          <Typography variant="body2" color="text.secondary">
            {destination}
          </Typography>
        </Box>
      </Box>
      {stops > 0 && stopAirports && stopAirports.length > 0 && (
        <Box sx={{ mt: 0.5 }}>
          <Typography variant="caption" color="text.secondary">
            Stops: {stopAirports.join(', ')}
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export function FlightCard({ flight }: FlightCardProps) {
  const isRoundTrip = flight.returnDepartureTime !== undefined

  return (
    <Card variant="outlined">
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 2,
          }}
        >
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              {flight.airline}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {flight.airlineCode}
            </Typography>
          </Box>
          <Typography variant="h6" color="primary" fontWeight={700}>
            {formatPrice(flight.price, flight.currency)}
          </Typography>
        </Box>

        <FlightLeg
          label={isRoundTrip ? 'Outbound' : 'Flight'}
          departureTime={flight.departureTime}
          arrivalTime={flight.arrivalTime}
          origin={flight.origin}
          destination={flight.destination}
          duration={flight.duration}
          stops={flight.stops}
          stopAirports={flight.segments.slice(1).map((seg) => seg.departureAirport)}
          segments={flight.segments}
        />

        {isRoundTrip && flight.returnDepartureTime && flight.returnArrivalTime && (
          <>
            <Divider sx={{ my: 2 }} />
            <FlightLeg
              label="Return"
              departureTime={flight.returnDepartureTime}
              arrivalTime={flight.returnArrivalTime}
              origin={flight.destination}
              destination={flight.origin}
              duration={flight.returnDuration!}
              stops={flight.returnStops!}
              stopAirports={flight.returnSegments?.slice(1).map((seg) => seg.departureAirport)}
              segments={flight.returnSegments || []}
            />
          </>
        )}
      </CardContent>
    </Card>
  )
}
