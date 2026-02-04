import { Popper, Paper, Box, Typography, Divider, ClickAwayListener, Fade } from '@mui/material'
import { FlightTakeoff, FlightLand } from '@mui/icons-material'
import type { ProcessedSegment } from '../../types'
import { formatTime, formatDurationMinutes, calculateLayoverMinutes } from '../../utils/formatters'

interface StopDetailsPopupProps {
  segments: ProcessedSegment[]
  anchorEl: HTMLElement | null
  onClose: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

export function StopDetailsPopup({ segments, anchorEl, onClose, onMouseEnter, onMouseLeave }: StopDetailsPopupProps) {
  const open = Boolean(anchorEl)

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement="bottom"
      transition
      style={{ zIndex: 1300 }}
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={200}>
          <Paper
            elevation={8}
            sx={{ maxWidth: 360, mt: 1 }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            <ClickAwayListener onClickAway={onClose}>
              <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          Layover Details
        </Typography>

        {segments.map((segment, index) => (
          <Box key={segment.id}>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" fontWeight={500}>
                Flight {index + 1} - {segment.flightNumber}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {segment.airline}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <FlightTakeoff fontSize="small" color="action" />
              <Typography variant="body2">
                {formatTime(segment.departureTime)} {segment.departureAirport}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                →
              </Typography>
              <FlightLand fontSize="small" color="action" />
              <Typography variant="body2">
                {formatTime(segment.arrivalTime)} {segment.arrivalAirport}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ({formatDurationMinutes(segment.duration)})
              </Typography>
            </Box>

            {index < segments.length - 1 && (
              <Box sx={{ my: 2 }}>
                <Divider>
                  <Typography variant="caption" color="text.secondary">
                    Layover at {segment.arrivalAirport}:{' '}
                    {formatDurationMinutes(
                      calculateLayoverMinutes(segment.arrivalTime, segments[index + 1].departureTime)
                    )}
                  </Typography>
                </Divider>
              </Box>
            )}
          </Box>
        ))}
              </Box>
            </ClickAwayListener>
          </Paper>
        </Fade>
      )}
    </Popper>
  )
}
