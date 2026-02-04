import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDebounce } from '../../src/hooks/useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500))
    expect(result.current).toBe('initial')
  })

  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'initial' } }
    )

    expect(result.current).toBe('initial')

    rerender({ value: 'updated' })
    expect(result.current).toBe('initial')

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(result.current).toBe('updated')
  })

  it('should reset timer on rapid changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'a' } }
    )

    rerender({ value: 'b' })
    act(() => {
      vi.advanceTimersByTime(200)
    })

    rerender({ value: 'c' })
    act(() => {
      vi.advanceTimersByTime(200)
    })

    expect(result.current).toBe('a')

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current).toBe('c')
  })

  it('should work with different delay values', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 100),
      { initialProps: { value: 'fast' } }
    )

    rerender({ value: 'updated' })

    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(result.current).toBe('updated')
  })
})
