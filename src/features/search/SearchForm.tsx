import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { Search, SwapHoriz } from '@mui/icons-material'
import { addDays, startOfDay } from 'date-fns'
import { AsyncAutocomplete, PassengerSelector } from '../../components/common'
import { useSearch } from '../../providers'
import { TRAVEL_CLASS_OPTIONS } from '../../utils/constants'
import type { SearchFormValues } from '../../types'

const locationSchema = z.object({
  iataCode: z.string(),
  name: z.string(),
  cityName: z.string(),
  countryCode: z.string(),
  subType: z.enum(['AIRPORT', 'CITY']),
})

const searchSchema = z
  .object({
    origin: locationSchema.nullable().refine((val) => val !== null, {
      message: 'Origin is required',
    }),
    destination: locationSchema.nullable().refine((val) => val !== null, {
      message: 'Destination is required',
    }),
    departureDate: z.date({
      required_error: 'Departure date is required',
    }),
    returnDate: z.date().nullable(),
    adults: z.number().min(1).max(9),
    children: z.number().min(0).max(8),
    infants: z.number().min(0).max(4),
    travelClass: z.enum(['ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST']),
    tripType: z.enum(['roundTrip', 'oneWay']),
  })
  .refine(
    (data) => {
      if (data.tripType === 'roundTrip' && data.returnDate) {
        return data.returnDate >= data.departureDate
      }
      return true
    },
    {
      message: 'Return date must be after departure date',
      path: ['returnDate'],
    }
  )
  .refine(
    (data) => data.infants <= data.adults,
    {
      message: 'Infants cannot exceed adults',
      path: ['infants'],
    }
  )
  .refine(
    (data) => {
      if (!data.origin || !data.destination) return true
      return data.origin.iataCode !== data.destination.iataCode
    },
    {
      message: 'Origin and destination must be different',
      path: ['destination'],
    }
  )

const defaultValues: SearchFormValues = {
  origin: null,
  destination: null,
  departureDate: addDays(startOfDay(new Date()), 7),
  returnDate: addDays(startOfDay(new Date()), 14),
  adults: 1,
  children: 0,
  infants: 0,
  travelClass: 'ECONOMY',
  tripType: 'roundTrip',
}

export function SearchForm() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { setSearchParams, isLoading } = useSearch()

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues,
  })

  const tripType = watch('tripType')
  const origin = watch('origin')
  const destination = watch('destination')

  const handleSwapLocations = () => {
    setValue('origin', destination)
    setValue('destination', origin)
  }

  const onSubmit = (data: SearchFormValues) => {
    setSearchParams(data)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper
        component="form"
        onSubmit={handleSubmit(onSubmit, (errors) => {
          console.error('Form validation failed:', errors)
        })}
        sx={{
          p: { xs: 2, md: 3 },
          mb: 3,
        }}
      >
        <Box sx={{ mb: 2 }}>
          <Controller
            name="tripType"
            control={control}
            render={({ field }) => (
              <ToggleButtonGroup
                {...field}
                exclusive
                size="small"
                aria-label="Trip type"
                disabled={isLoading}
              >
                <ToggleButton value="roundTrip">Round Trip</ToggleButton>
                <ToggleButton value="oneWay">One Way</ToggleButton>
              </ToggleButtonGroup>
            )}
          />
        </Box>

        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              xs: '1fr',
              sm: '1fr 1fr',
              md: '1fr auto 1fr 1fr 1fr auto auto',
            },
            alignItems: 'start',
          }}
        >
          <Controller
            name="origin"
            control={control}
            render={({ field }) => (
              <AsyncAutocomplete
                value={field.value}
                onChange={field.onChange}
                label="From"
                placeholder="City or airport"
                error={!!errors.origin}
                helperText={errors.origin?.message || errors.origin?.root?.message}
                disabled={isLoading}
              />
            )}
          />

          {!isMobile && (
            <Button
              variant="outlined"
              onClick={handleSwapLocations}
              disabled={isLoading}
              sx={{ minWidth: 40, px: 1, height: 40, alignSelf: 'start' }}
              aria-label="Swap origin and destination"
            >
              <SwapHoriz />
            </Button>
          )}

          <Controller
            name="destination"
            control={control}
            render={({ field }) => (
              <AsyncAutocomplete
                value={field.value}
                onChange={field.onChange}
                label="To"
                placeholder="City or airport"
                error={!!errors.destination}
                helperText={errors.destination?.message || errors.destination?.root?.message}
                disabled={isLoading}
              />
            )}
          />

          <Controller
            name="departureDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                label="Departure"
                value={field.value}
                onChange={field.onChange}
                minDate={new Date()}
                disabled={isLoading}
                slotProps={{
                  textField: {
                    error: !!errors.departureDate,
                    helperText: errors.departureDate?.message,
                    size: 'small',
                  },
                }}
              />
            )}
          />

          {tripType === 'roundTrip' && (
            <Controller
              name="returnDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="Return"
                  value={field.value}
                  onChange={field.onChange}
                  minDate={watch('departureDate') || new Date()}
                  disabled={isLoading}
                  slotProps={{
                    textField: {
                      error: !!errors.returnDate,
                      helperText: errors.returnDate?.message,
                      size: 'small',
                    },
                  }}
                />
              )}
            />
          )}

          <Controller
            name="adults"
            control={control}
            render={({ field: adultsField }) => (
              <Controller
                name="children"
                control={control}
                render={({ field: childrenField }) => (
                  <Controller
                    name="infants"
                    control={control}
                    render={({ field: infantsField }) => (
                      <PassengerSelector
                        adults={adultsField.value}
                        children={childrenField.value}
                        infants={infantsField.value}
                        onAdultsChange={adultsField.onChange}
                        onChildrenChange={childrenField.onChange}
                        onInfantsChange={infantsField.onChange}
                        disabled={isLoading}
                      />
                    )}
                  />
                )}
              />
            )}
          />

          <Controller
            name="travelClass"
            control={control}
            render={({ field }) => (
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Class</InputLabel>
                <Select {...field} label="Class" disabled={isLoading}>
                  {TRAVEL_CLASS_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Box>

        <Box
          sx={{
            mt: 2,
            display: 'flex',
            justifyContent: { xs: 'stretch', md: 'flex-end' },
          }}
        >
          <Button
            type="submit"
            variant="contained"
            size="large"
            startIcon={<Search />}
            disabled={isLoading}
            sx={{ minWidth: { xs: '100%', md: 150 } }}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </Box>
      </Paper>
    </LocalizationProvider>
  )
}
