import { useState, useEffect } from 'react'
import {
  Box,
  Slider,
  Typography,
  TextField,
  InputAdornment,
} from '@mui/material'
import { useDebounce } from '../../hooks'
import { formatPrice } from '../../utils/formatters'

interface PriceRangeSliderProps {
  value: [number, number]
  onChange: (value: [number, number]) => void
  min: number
  max: number
}

export function PriceRangeSlider({
  value,
  onChange,
  min,
  max,
}: PriceRangeSliderProps) {
  const [localValue, setLocalValue] = useState<[number, number]>(value)
  const debouncedValue = useDebounce(localValue, 300)

  useEffect(() => {
    if (debouncedValue[0] !== value[0] || debouncedValue[1] !== value[1]) {
      onChange(debouncedValue)
    }
  }, [debouncedValue, onChange, value])

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    setLocalValue(newValue as [number, number])
  }

  const handleMinInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.max(min, Math.min(Number(event.target.value) || min, localValue[1]))
    setLocalValue([newMin, localValue[1]])
  }

  const handleMaxInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.min(max, Math.max(Number(event.target.value) || max, localValue[0]))
    setLocalValue([localValue[0], newMax])
  }

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Price Range
      </Typography>
      <Box sx={{ px: 1 }}>
        <Slider
          value={localValue}
          onChange={handleSliderChange}
          valueLabelDisplay="auto"
          valueLabelFormat={(v) => formatPrice(v)}
          min={min}
          max={max}
          step={10}
          aria-label="Price range"
        />
      </Box>
      <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
        <TextField
          label="Min"
          type="number"
          size="small"
          value={localValue[0]}
          onChange={handleMinInputChange}
          slotProps={{
            input: {
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            },
          }}
          sx={{ flex: 1 }}
        />
        <TextField
          label="Max"
          type="number"
          size="small"
          value={localValue[1]}
          onChange={handleMaxInputChange}
          slotProps={{
            input: {
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            },
          }}
          sx={{ flex: 1 }}
        />
      </Box>
    </Box>
  )
}
