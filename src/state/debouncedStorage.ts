import { StateStorage } from 'zustand/middleware'

type DebouncedLocalStorage = StateStorage & {
  updateTimeout: NodeJS.Timeout | number | undefined
  updateDelay: number
}

export const DEBOUNCE_DELAY = 1000

export const localStorageWrapper = {
  getItem: (name: string) => {
    const str = localStorage.getItem(name)
    if (!str) {
      return null
    }
    return str
  },
  setItem: (name: string, value: string) => {
    localStorage.setItem(name, value)
  },
  removeItem: (name: string) => localStorage.removeItem(name),
}

const MAX_HISTORY_LENGTH = 25

function updateLocalStorageStateHistory(name: string, oldValue: string): void {
  const key = `${name}__history`
  const prevHistory: string[] = JSON.parse(localStorageWrapper.getItem(key) ?? '[]')

  prevHistory.push(JSON.parse(oldValue).state)
  while (prevHistory.length > MAX_HISTORY_LENGTH) {
    prevHistory.shift()
  }

  localStorageWrapper.setItem(key, JSON.stringify(prevHistory))
}

export function getLocalStorageStateHistory<T>(name: string): T[] {
  return JSON.parse(localStorageWrapper.getItem(`${name}__history`) ?? '[]')
}

/**
 * Updates localStorage with a delay and keeps a history of previous values,
 * to be able use undo/redo functionality.
 */
export const debouncedLocalStorageWithHistory: DebouncedLocalStorage = {
  updateTimeout: undefined,
  updateDelay: DEBOUNCE_DELAY,
  getItem: localStorageWrapper.getItem,
  removeItem: localStorageWrapper.removeItem,
  setItem: (name, newValue): void => {
    if (debouncedLocalStorageWithHistory.updateTimeout) {
      clearTimeout(debouncedLocalStorageWithHistory.updateTimeout)
    }
    debouncedLocalStorageWithHistory.updateTimeout = setTimeout(() => {
      const oldValue = localStorageWrapper.getItem(name)
      if (oldValue) {
        updateLocalStorageStateHistory(name, oldValue)
      }
      localStorageWrapper.setItem(name, newValue)
    }, debouncedLocalStorageWithHistory.updateDelay)
  },
}
