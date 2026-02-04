import { Box, Typography, Chip } from '@mui/material'

interface AirlineFilterProps {
  airlines: { code: string; name: string }[]
  value: string[]
  onChange: (value: string[]) => void
}

export function AirlineFilter({ airlines, value, onChange }: AirlineFilterProps) {
  const handleToggle = (code: string) => {
    if (value.includes(code)) {
      onChange(value.filter((c) => c !== code))
    } else {
      onChange([...value, code])
    }
  }

  if (airlines.length === 0) {
    return null
  }

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Airlines
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {airlines.map((airline) => (
          <Chip
            key={airline.code}
            label={airline.name}
            size="small"
            variant={value.includes(airline.code) ? 'filled' : 'outlined'}
            color={value.includes(airline.code) ? 'primary' : 'default'}
            onClick={() => handleToggle(airline.code)}
            aria-pressed={value.includes(airline.code)}
          />
        ))}
      </Box>
    </Box>
  )
}
