import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { Close, FilterList, Refresh } from '@mui/icons-material'
import { useSearch } from '../../providers'
import { StopsFilter } from './StopsFilter'
import { PriceRangeSlider } from './PriceRangeSlider'
import { AirlineFilter } from './AirlineFilter'
import { TimeRangeFilter } from './TimeRangeFilter'
import { DurationFilter } from './DurationFilter'

interface FilterPanelProps {
  open: boolean
  onClose: () => void
}

function FilterContent() {
  const {
    filters,
    setFilters,
    resetFilters,
    availableAirlines,
    priceRange,
    durationRange,
    flights,
    filteredFlights,
  } = useSearch()

  if (flights.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Search for flights to see filter options
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle1" fontWeight={600}>
          Filters
        </Typography>
        <Button
          size="small"
          startIcon={<Refresh />}
          onClick={resetFilters}
        >
          Reset
        </Button>
      </Box>

      <Typography variant="body2" color="text.secondary">
        Showing {filteredFlights.length} of {flights.length} flights
      </Typography>

      <Divider />

      <StopsFilter
        value={filters.stops}
        onChange={(stops) => setFilters((prev) => ({ ...prev, stops }))}
      />

      <Divider />

      <PriceRangeSlider
        value={filters.priceRange}
        onChange={(priceRange) => setFilters((prev) => ({ ...prev, priceRange }))}
        min={Math.floor(priceRange[0])}
        max={Math.ceil(priceRange[1])}
      />

      <Divider />

      <AirlineFilter
        airlines={availableAirlines}
        value={filters.airlines}
        onChange={(airlines) => setFilters((prev) => ({ ...prev, airlines }))}
      />

      <Divider />

      <TimeRangeFilter
        label="Departure Time"
        value={filters.departureTimeRange}
        onChange={(departureTimeRange) =>
          setFilters((prev) => ({ ...prev, departureTimeRange }))
        }
      />

      <Divider />

      <TimeRangeFilter
        label="Arrival Time"
        value={filters.arrivalTimeRange}
        onChange={(arrivalTimeRange) =>
          setFilters((prev) => ({ ...prev, arrivalTimeRange }))
        }
      />

      <Divider />

      <DurationFilter
        value={filters.maxDuration}
        onChange={(maxDuration) => setFilters((prev) => ({ ...prev, maxDuration }))}
        max={durationRange[1]}
      />
    </Box>
  )
}

export function FilterPanel({ open, onClose }: FilterPanelProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  if (isMobile) {
    return (
      <Drawer
        anchor="bottom"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            maxHeight: '80vh',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterList />
              <Typography variant="h6">Filters</Typography>
            </Box>
            <IconButton onClick={onClose} aria-label="Close filters">
              <Close />
            </IconButton>
          </Box>
          <FilterContent />
        </Box>
      </Drawer>
    )
  }

  return (
    <Paper
      sx={{
        p: 2,
        position: 'sticky',
        top: 16,
        maxHeight: 'calc(100vh - 32px)',
        overflow: 'auto',
      }}
    >
      <FilterContent />
    </Paper>
  )
}
