import { useMemo, useCallback, useState, useRef } from 'react'
import {
  DataGrid,
  type GridColDef,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
  type GridSortModel,
  type GridColumnVisibilityModel,
} from '@mui/x-data-grid'
import { Box, Chip, Typography, useTheme, useMediaQuery } from '@mui/material'
import { useSearch } from '../../providers'
import { useGridPreferences } from '../../hooks'
import { formatPrice, formatTime, formatDurationMinutes, getStopsLabel, getDayOffset, formatDayOffset } from '../../utils/formatters'
import type { ProcessedFlight, ProcessedSegment } from '../../types'
import { FlightCard } from './FlightCard'
import { StopDetailsPopup } from './StopDetailsPopup'

interface StopsChipProps {
  stops: number
  segments: ProcessedSegment[]
}

function StopsChip({ stops, segments }: StopsChipProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimeouts = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
  }

  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    clearTimeouts()
    const target = event.currentTarget
    hoverTimeoutRef.current = setTimeout(() => {
      setAnchorEl(target)
    }, 300)
  }

  const handleMouseLeave = () => {
    clearTimeouts()
    closeTimeoutRef.current = setTimeout(() => {
      setAnchorEl(null)
    }, 400)
  }

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    clearTimeouts()
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }

  const handleClose = () => {
    clearTimeouts()
    setAnchorEl(null)
  }

  const handlePopupMouseEnter = () => {
    clearTimeouts()
  }

  const handlePopupMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setAnchorEl(null)
    }, 400)
  }

  if (stops === 0) {
    return (
      <Chip
        label={getStopsLabel(stops)}
        size="small"
        color="success"
        variant="filled"
      />
    )
  }

  return (
    <>
      <Chip
        label={getStopsLabel(stops)}
        size="small"
        color="default"
        variant="outlined"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{ cursor: 'pointer' }}
      />
      <StopDetailsPopup
        segments={segments}
        anchorEl={anchorEl}
        onClose={handleClose}
        onMouseEnter={handlePopupMouseEnter}
        onMouseLeave={handlePopupMouseLeave}
      />
    </>
  )
}

function CustomToolbar() {
  return (
    <GridToolbarContainer sx={{ p: 1, gap: 1 }}>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <Box sx={{ flexGrow: 1 }} />
      <GridToolbarQuickFilter debounceMs={200} />
    </GridToolbarContainer>
  )
}

const columns: GridColDef<ProcessedFlight>[] = [
  {
    field: 'airline',
    headerName: 'Airline',
    flex: 1,
    minWidth: 140,
    renderCell: ({ row }) => (
      <Box>
        <Typography variant="body2" fontWeight={500}>
          {row.airline}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {row.airlineCode}
        </Typography>
      </Box>
    ),
  },
  {
    field: 'price',
    headerName: 'Price',
    width: 100,
    type: 'number',
    renderCell: ({ row }) => (
      <Typography variant="body2" fontWeight={600} color="primary">
        {formatPrice(row.price, row.currency)}
      </Typography>
    ),
  },
  {
    field: 'departureTime',
    headerName: 'Departure',
    width: 120,
    type: 'dateTime',
    valueGetter: (_, row) => row.departureTime,
    renderCell: ({ row }) => (
      <Box>
        <Typography variant="body2" fontWeight={500}>
          {formatTime(row.departureTime)}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {row.origin}
        </Typography>
      </Box>
    ),
  },
  {
    field: 'arrivalTime',
    headerName: 'Arrival',
    width: 120,
    type: 'dateTime',
    valueGetter: (_, row) => row.arrivalTime,
    renderCell: ({ row }) => (
      <Box>
        <Typography variant="body2" fontWeight={500}>
          {formatTime(row.arrivalTime)}
          {getDayOffset(row.departureTime, row.arrivalTime) > 0 && (
            <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.5, fontSize: '0.7rem' }}>
              {formatDayOffset(getDayOffset(row.departureTime, row.arrivalTime))}
            </Typography>
          )}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {row.destination}
        </Typography>
      </Box>
    ),
  },
  {
    field: 'duration',
    headerName: 'Duration',
    width: 100,
    type: 'number',
    renderCell: ({ row }) => (
      <Typography variant="body2">
        {formatDurationMinutes(row.duration)}
      </Typography>
    ),
  },
  {
    field: 'stops',
    headerName: 'Stops',
    width: 100,
    type: 'number',
    renderCell: ({ row }) => (
      <StopsChip stops={row.stops} segments={row.segments} />
    ),
  },
  {
    field: 'route',
    headerName: 'Route',
    width: 120,
    valueGetter: (_, row) => `${row.origin} → ${row.destination}`,
    renderCell: ({ row }) => (
      <Typography variant="body2">
        {row.origin} → {row.destination}
      </Typography>
    ),
  },
  {
    field: 'returnDepartureTime',
    headerName: 'Return Dep.',
    width: 120,
    type: 'dateTime',
    valueGetter: (_, row) => row.returnDepartureTime,
    renderCell: ({ row }) =>
      row.returnDepartureTime ? (
        <Box>
          <Typography variant="body2" fontWeight={500}>
            {formatTime(row.returnDepartureTime)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.destination}
          </Typography>
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary">
          —
        </Typography>
      ),
  },
  {
    field: 'returnArrivalTime',
    headerName: 'Return Arr.',
    width: 120,
    type: 'dateTime',
    valueGetter: (_, row) => row.returnArrivalTime,
    renderCell: ({ row }) =>
      row.returnArrivalTime && row.returnDepartureTime ? (
        <Box>
          <Typography variant="body2" fontWeight={500}>
            {formatTime(row.returnArrivalTime)}
            {getDayOffset(row.returnDepartureTime, row.returnArrivalTime) > 0 && (
              <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.5, fontSize: '0.7rem' }}>
                {formatDayOffset(getDayOffset(row.returnDepartureTime, row.returnArrivalTime))}
              </Typography>
            )}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.origin}
          </Typography>
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary">
          —
        </Typography>
      ),
  },
  {
    field: 'returnDuration',
    headerName: 'Return Dur.',
    width: 100,
    type: 'number',
    valueGetter: (_, row) => row.returnDuration,
    renderCell: ({ row }) => (
      <Typography variant="body2">
        {row.returnDuration ? formatDurationMinutes(row.returnDuration) : '—'}
      </Typography>
    ),
  },
  {
    field: 'returnStops',
    headerName: 'Return Stops',
    width: 110,
    type: 'number',
    valueGetter: (_, row) => row.returnStops,
    renderCell: ({ row }) =>
      row.returnStops !== undefined && row.returnSegments ? (
        <StopsChip stops={row.returnStops} segments={row.returnSegments} />
      ) : (
        <Typography variant="body2" color="text.secondary">
          —
        </Typography>
      ),
  },
]

export function FlightDataGrid() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { filteredFlights, isLoading, searchParams } = useSearch()
  const { preferences, updateColumnVisibility, updateSortModel } = useGridPreferences()

  const visibleColumns = useMemo(
    () =>
      searchParams?.tripType === 'oneWay'
        ? columns.filter((col) => !col.field.startsWith('return'))
        : columns,
    [searchParams?.tripType]
  )

  const handleColumnVisibilityChange = useCallback(
    (model: GridColumnVisibilityModel) => {
      updateColumnVisibility(model)
    },
    [updateColumnVisibility]
  )

  const handleSortModelChange = useCallback(
    (model: GridSortModel) => {
      updateSortModel(
        model.map((item) => ({
          field: item.field,
          sort: item.sort || 'asc',
        }))
      )
    },
    [updateSortModel]
  )

  const sortModel = useMemo<GridSortModel>(
    () =>
      preferences.sortModel.map((item) => ({
        field: item.field,
        sort: item.sort,
      })),
    [preferences.sortModel]
  )

  if (isMobile) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {filteredFlights.map((flight) => (
          <FlightCard key={flight.id} flight={flight} />
        ))}
        {filteredFlights.length === 0 && !isLoading && (
          <Typography variant="body1" color="text.secondary" textAlign="center">
            No flights match your criteria
          </Typography>
        )}
      </Box>
    )
  }

  return (
    <DataGrid
      rows={filteredFlights}
      columns={visibleColumns}
      loading={isLoading}
      disableRowSelectionOnClick
      pageSizeOptions={[10, 25, 50, 100]}
      initialState={{
        pagination: { paginationModel: { pageSize: 25 } },
      }}
      columnVisibilityModel={preferences.columnVisibility}
      onColumnVisibilityModelChange={handleColumnVisibilityChange}
      sortModel={sortModel}
      onSortModelChange={handleSortModelChange}
      slots={{
        toolbar: CustomToolbar,
      }}
      getRowHeight={() => 'auto'}
      sx={{
        border: 'none',
        '& .MuiDataGrid-cell': {
          display: 'flex',
          alignItems: 'center',
          py: 1,
        },
        '& .MuiDataGrid-row': {
          minHeight: '52px !important',
        },
      }}
      localeText={{
        noRowsLabel: 'No flights found. Try adjusting your search criteria.',
      }}
    />
  )
}
