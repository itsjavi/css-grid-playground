import { decodeLocationHash, decodeLocationState, pushEncodedLocationHash } from '@/utils'
import { StateStorage } from 'zustand/middleware'

type DebouncedHashStorage = StateStorage & {
  updateTimeout: NodeJS.Timeout | number | undefined
  updateDelay: number
}

type DebouncedLocalStorage = StateStorage & {
  updateTimeout: NodeJS.Timeout | number | undefined
  updateDelay: number
}

export const DEBOUNCE_DELAY = 1000

const hashStorage: StateStorage = {
  getItem: (): string => {
    return decodeLocationHash() ?? ''
  },
  setItem: (_, newValue): void => {
    const decodedValue = decodeLocationState()
    if (decodedValue && decodedValue.noPersist === true) {
      return
    }
    pushEncodedLocationHash(newValue)
    //replaceEncodedLocationHash(newValue)
  },
  removeItem: (): void => {
    location.hash = ''
  },
}

// Updates hash every DEBOUNCE_DELAY ms
export const debouncedHashStorage: DebouncedHashStorage = {
  updateTimeout: undefined,
  updateDelay: DEBOUNCE_DELAY,
  getItem: hashStorage.getItem,
  removeItem: hashStorage.removeItem,
  setItem: (name, newValue): void => {
    if (debouncedHashStorage.updateTimeout) {
      clearTimeout(debouncedHashStorage.updateTimeout)
    }
    debouncedHashStorage.updateTimeout = setTimeout(() => {
      hashStorage.setItem(name, newValue)
    }, debouncedHashStorage.updateDelay)
  },
}

export const debouncedLocalStorage: DebouncedLocalStorage = {
  updateTimeout: undefined,
  updateDelay: DEBOUNCE_DELAY,
  getItem: localStorage.getItem,
  removeItem: localStorage.removeItem,
  setItem: (name, newValue): void => {
    if (debouncedLocalStorage.updateTimeout) {
      clearTimeout(debouncedLocalStorage.updateTimeout)
    }
    debouncedLocalStorage.updateTimeout = setTimeout(() => {
      localStorage.setItem(name, newValue)
    }, debouncedLocalStorage.updateDelay)
  },
}
