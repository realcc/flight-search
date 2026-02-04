import { useState } from 'react'
import {
  Button,
  Popover,
  Box,
  Typography,
  IconButton,
  Divider,
} from '@mui/material'
import { Add, Remove, Person } from '@mui/icons-material'
import { MAX_ADULTS, MAX_CHILDREN, MAX_INFANTS, MAX_PASSENGERS } from '../../utils/constants'

interface PassengerSelectorProps {
  adults: number
  children: number
  infants: number
  onAdultsChange: (value: number) => void
  onChildrenChange: (value: number) => void
  onInfantsChange: (value: number) => void
  disabled?: boolean
}

interface CounterProps {
  label: string
  description: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  disabled?: boolean
}

function Counter({
  label,
  description,
  value,
  onChange,
  min,
  max,
  disabled,
}: CounterProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 1,
      }}
    >
      <Box>
        <Typography variant="body1">{label}</Typography>
        <Typography variant="caption" color="text.secondary">
          {description}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton
          size="small"
          onClick={() => onChange(value - 1)}
          disabled={disabled || value <= min}
          aria-label={`Decrease ${label}`}
        >
          <Remove />
        </IconButton>
        <Typography sx={{ minWidth: 24, textAlign: 'center' }}>{value}</Typography>
        <IconButton
          size="small"
          onClick={() => onChange(value + 1)}
          disabled={disabled || value >= max}
          aria-label={`Increase ${label}`}
        >
          <Add />
        </IconButton>
      </Box>
    </Box>
  )
}

export function PassengerSelector({
  adults,
  children,
  infants,
  onAdultsChange,
  onChildrenChange,
  onInfantsChange,
  disabled,
}: PassengerSelectorProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const open = Boolean(anchorEl)

  const totalPassengers = adults + children + infants
  const remainingSeats = MAX_PASSENGERS - totalPassengers

  const label =
    totalPassengers === 1
      ? '1 Passenger'
      : `${totalPassengers} Passengers`

  return (
    <>
      <Button
        variant="outlined"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        startIcon={<Person />}
        disabled={disabled}
        sx={{
          justifyContent: 'flex-start',
          textTransform: 'none',
          minWidth: 150,
        }}
        aria-label="Select passengers"
      >
        {label}
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 2, minWidth: 280 }}>
          <Counter
            label="Adults"
            description="Age 12+"
            value={adults}
            onChange={onAdultsChange}
            min={1}
            max={Math.min(MAX_ADULTS, adults + remainingSeats)}
          />
          <Divider />
          <Counter
            label="Children"
            description="Age 2-11"
            value={children}
            onChange={onChildrenChange}
            min={0}
            max={Math.min(MAX_CHILDREN, children + remainingSeats)}
          />
          <Divider />
          <Counter
            label="Infants"
            description="Under 2"
            value={infants}
            onChange={onInfantsChange}
            min={0}
            max={Math.min(MAX_INFANTS, infants + remainingSeats, adults)}
          />
          {infants > adults && (
            <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
              Infants cannot exceed the number of adults
            </Typography>
          )}
        </Box>
      </Popover>
    </>
  )
}
