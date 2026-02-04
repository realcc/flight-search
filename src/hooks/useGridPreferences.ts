import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { STORAGE_KEYS } from '../utils/constants'
import type { GridPreferences } from '../types'

const DEFAULT_PREFERENCES: GridPreferences = {
  columnVisibility: {},
  sortModel: [],
}

export function useGridPreferences() {
  const [preferences, setPreferences] = useLocalStorage<GridPreferences>(
    STORAGE_KEYS.GRID_PREFERENCES,
    DEFAULT_PREFERENCES
  )

  const updateColumnVisibility = useCallback(
    (columnVisibility: Record<string, boolean>) => {
      setPreferences((prev) => ({
        ...prev,
        columnVisibility,
      }))
    },
    [setPreferences]
  )

  const updateSortModel = useCallback(
    (sortModel: GridPreferences['sortModel']) => {
      setPreferences((prev) => ({
        ...prev,
        sortModel,
      }))
    },
    [setPreferences]
  )

  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES)
  }, [setPreferences])

  return {
    preferences,
    updateColumnVisibility,
    updateSortModel,
    resetPreferences,
  }
}
