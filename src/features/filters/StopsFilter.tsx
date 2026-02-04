import {
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material'

interface StopsFilterProps {
  value: number[]
  onChange: (value: number[]) => void
}

const STOP_OPTIONS = [
  { value: 0, label: 'Nonstop' },
  { value: 1, label: '1 stop' },
  { value: 2, label: '2+ stops' },
]

export function StopsFilter({ value, onChange }: StopsFilterProps) {
  const handleChange = (stopValue: number) => {
    if (value.includes(stopValue)) {
      onChange(value.filter((v) => v !== stopValue))
    } else {
      onChange([...value, stopValue])
    }
  }

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Stops</FormLabel>
      <FormGroup>
        {STOP_OPTIONS.map((option) => (
          <FormControlLabel
            key={option.value}
            control={
              <Checkbox
                checked={value.includes(option.value)}
                onChange={() => handleChange(option.value)}
                size="small"
              />
            }
            label={option.label}
          />
        ))}
      </FormGroup>
    </FormControl>
  )
}
