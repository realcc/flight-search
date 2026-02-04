import { Box, Slider, Typography } from '@mui/material'

interface TimeRangeFilterProps {
  label: string
  value: [number, number]
  onChange: (value: [number, number]) => void
}

function formatHour(hour: number): string {
  if (hour === 0 || hour === 24) return '12 AM'
  if (hour === 12) return '12 PM'
  if (hour < 12) return `${hour} AM`
  return `${hour - 12} PM`
}

const marks = [
  { value: 0, label: '12 AM' },
  { value: 6, label: '6 AM' },
  { value: 12, label: '12 PM' },
  { value: 18, label: '6 PM' },
  { value: 24, label: '12 AM' },
]

export function TimeRangeFilter({ label, value, onChange }: TimeRangeFilterProps) {
  const handleChange = (_: Event, newValue: number | number[]) => {
    onChange(newValue as [number, number])
  }

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        {label}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {formatHour(value[0])} - {formatHour(value[1])}
      </Typography>
      <Box sx={{ px: 1 }}>
        <Slider
          value={value}
          onChange={handleChange}
          valueLabelDisplay="auto"
          valueLabelFormat={formatHour}
          min={0}
          max={24}
          step={1}
          marks={marks}
          aria-label={label}
        />
      </Box>
    </Box>
  )
}
