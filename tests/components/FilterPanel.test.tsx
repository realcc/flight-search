import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '@mui/material'
import { theme } from '../../src/styles/theme'
import { StopsFilter } from '../../src/features/filters/StopsFilter'
import { AirlineFilter } from '../../src/features/filters/AirlineFilter'
import { DurationFilter } from '../../src/features/filters/DurationFilter'

const renderWithTheme = (component: React.ReactNode) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>)
}

describe('Filter Components', () => {
  describe('StopsFilter', () => {
    it('should render all stop options', () => {
      renderWithTheme(<StopsFilter value={[]} onChange={() => {}} />)

      expect(screen.getByText('Nonstop')).toBeInTheDocument()
      expect(screen.getByText('1 stop')).toBeInTheDocument()
      expect(screen.getByText('2+ stops')).toBeInTheDocument()
    })

    it('should call onChange when checkbox is clicked', () => {
      const onChange = vi.fn()
      renderWithTheme(<StopsFilter value={[]} onChange={onChange} />)

      fireEvent.click(screen.getByText('Nonstop'))
      expect(onChange).toHaveBeenCalledWith([0])
    })

    it('should uncheck when already selected', () => {
      const onChange = vi.fn()
      renderWithTheme(<StopsFilter value={[0, 1]} onChange={onChange} />)

      fireEvent.click(screen.getByText('Nonstop'))
      expect(onChange).toHaveBeenCalledWith([1])
    })

    it('should show checked state for selected values', () => {
      renderWithTheme(<StopsFilter value={[0]} onChange={() => {}} />)

      const nonstopCheckbox = screen.getByRole('checkbox', { name: /nonstop/i })
      expect(nonstopCheckbox).toBeChecked()
    })
  })

  describe('AirlineFilter', () => {
    const airlines = [
      { code: 'AA', name: 'American Airlines' },
      { code: 'UA', name: 'United Airlines' },
    ]

    it('should render all airlines as chips', () => {
      renderWithTheme(
        <AirlineFilter airlines={airlines} value={[]} onChange={() => {}} />
      )

      expect(screen.getByText('American Airlines')).toBeInTheDocument()
      expect(screen.getByText('United Airlines')).toBeInTheDocument()
    })

    it('should call onChange when chip is clicked', () => {
      const onChange = vi.fn()
      renderWithTheme(
        <AirlineFilter airlines={airlines} value={[]} onChange={onChange} />
      )

      fireEvent.click(screen.getByText('American Airlines'))
      expect(onChange).toHaveBeenCalledWith(['AA'])
    })

    it('should deselect when clicking selected chip', () => {
      const onChange = vi.fn()
      renderWithTheme(
        <AirlineFilter airlines={airlines} value={['AA']} onChange={onChange} />
      )

      fireEvent.click(screen.getByText('American Airlines'))
      expect(onChange).toHaveBeenCalledWith([])
    })

    it('should render nothing when airlines is empty', () => {
      const { container } = renderWithTheme(
        <AirlineFilter airlines={[]} value={[]} onChange={() => {}} />
      )

      expect(container.firstChild).toBeNull()
    })
  })

  describe('DurationFilter', () => {
    it('should show "Any" when value is null', () => {
      renderWithTheme(
        <DurationFilter value={null} onChange={() => {}} max={600} />
      )

      expect(screen.getByText('Any')).toBeInTheDocument()
    })

    it('should show formatted duration when value is set', () => {
      renderWithTheme(
        <DurationFilter value={180} onChange={() => {}} max={600} />
      )

      const elements = screen.getAllByText('3h')
      expect(elements.length).toBeGreaterThan(0)
    })

    it('should have a slider', () => {
      renderWithTheme(
        <DurationFilter value={null} onChange={() => {}} max={600} />
      )

      expect(screen.getByRole('slider')).toBeInTheDocument()
    })
  })
})
