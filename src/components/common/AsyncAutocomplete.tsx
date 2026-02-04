import { useState } from 'react'
import {
  Autocomplete,
  TextField,
  CircularProgress,
  Box,
  Typography,
  type AutocompleteInputChangeReason,
} from '@mui/material'
import { FlightTakeoff, LocationCity } from '@mui/icons-material'
import { useLocationSearch } from '../../hooks'
import type { Location, LocationOption } from '../../types'

interface AsyncAutocompleteProps {
  value: LocationOption | null
  onChange: (value: LocationOption | null) => void
  label: string
  placeholder?: string
  error?: boolean
  helperText?: string
  disabled?: boolean
}

function locationToOption(location: Location): LocationOption {
  return {
    iataCode: location.iataCode,
    name: location.name,
    cityName: location.address.cityName,
    countryCode: location.address.countryCode,
    subType: location.subType,
  }
}

function formatOptionLabel(option: LocationOption | null): string {
  return option ? `${option.cityName} (${option.iataCode})` : ''
}

export function AsyncAutocomplete({
  value,
  onChange,
  label,
  placeholder,
  error,
  helperText,
  disabled,
}: AsyncAutocompleteProps) {
  const [inputValue, setInputValue] = useState(() => formatOptionLabel(value))
  const { data: locations, isLoading } = useLocationSearch(inputValue)

  const handleInputChange = (
    _: React.SyntheticEvent,
    newInputValue: string,
    reason: AutocompleteInputChangeReason
  ) => {
    if (reason === 'reset' && value) {
      setInputValue(formatOptionLabel(value))
    } else {
      setInputValue(newInputValue)
    }
  }

  const options: LocationOption[] = (locations || []).map(locationToOption)

  return (
    <Autocomplete
      key={value?.iataCode ?? 'empty'}
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      options={options}
      loading={isLoading}
      disabled={disabled}
      getOptionLabel={(option) =>
        `${option.cityName} (${option.iataCode})`
      }
      getOptionKey={(option) => `${option.iataCode}-${option.subType}`}
      isOptionEqualToValue={(option, val) => option.iataCode === val.iataCode}
      filterOptions={(x) => x}
      renderOption={({ key, ...props }, option) => (
        <Box
          component="li"
          key={key}
          {...props}
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          {option.subType === 'AIRPORT' ? (
            <FlightTakeoff fontSize="small" color="action" />
          ) : (
            <LocationCity fontSize="small" color="action" />
          )}
          <Box>
            <Typography variant="body2" fontWeight={500}>
              {option.cityName} ({option.iataCode})
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {option.name} - {option.countryCode}
            </Typography>
          </Box>
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <>
                  {isLoading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
    />
  )
}
