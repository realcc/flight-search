import { Box, Slider, Typography } from '@mui/material'
import { formatDurationMinutes } from '../../utils/formatters'

interface DurationFilterProps {
  value: number | null
  onChange: (value: number | null) => void
  max: number
}

export function DurationFilter({ value, onChange, max }: DurationFilterProps) {
  const effectiveMax = Math.max(max, 60)
  const displayValue = value ?? effectiveMax

  const handleChange = (_: Event, newValue: number | number[]) => {
    const val = newValue as number
    onChange(val >= effectiveMax ? null : val)
  }

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Max Duration
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {value === null ? 'Any' : formatDurationMinutes(value)}
      </Typography>
      <Box sx={{ px: 1 }}>
        <Slider
          value={displayValue}
          onChange={handleChange}
          valueLabelDisplay="auto"
          valueLabelFormat={formatDurationMinutes}
          min={60}
          max={effectiveMax}
          step={15}
          aria-label="Maximum duration"
        />
      </Box>
    </Box>
  )
}
