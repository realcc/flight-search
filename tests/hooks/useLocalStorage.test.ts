import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from '../../src/hooks/useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should return initial value when storage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'default'))
    expect(result.current[0]).toBe('default')
  })

  it('should return stored value when storage has data', () => {
    localStorage.setItem('key', JSON.stringify('stored'))
    const { result } = renderHook(() => useLocalStorage('key', 'default'))
    expect(result.current[0]).toBe('stored')
  })

  it('should update localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'initial'))

    act(() => {
      result.current[1]('updated')
    })

    expect(result.current[0]).toBe('updated')
    expect(JSON.parse(localStorage.getItem('key')!)).toBe('updated')
  })

  it('should support functional updates', () => {
    const { result } = renderHook(() => useLocalStorage('count', 0))

    act(() => {
      result.current[1]((prev) => prev + 1)
    })

    expect(result.current[0]).toBe(1)
  })

  it('should handle complex objects', () => {
    const initialValue = { name: 'test', items: [1, 2, 3] }
    const { result } = renderHook(() => useLocalStorage('obj', initialValue))

    expect(result.current[0]).toEqual(initialValue)

    act(() => {
      result.current[1]({ name: 'updated', items: [4, 5] })
    })

    expect(result.current[0]).toEqual({ name: 'updated', items: [4, 5] })
  })

  it('should handle invalid JSON in storage gracefully', () => {
    localStorage.setItem('key', 'invalid json')
    const { result } = renderHook(() => useLocalStorage('key', 'default'))
    expect(result.current[0]).toBe('default')
  })
})
