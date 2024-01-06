import { decodeLocationHash, deepClone, replaceEncodedLocationHash } from '@/utils'
import createPersistentStore from './createPersistentStore'
import { DEBOUNCE_DELAY } from './debouncedHashStorage'
import { gridPresets } from './presets'
import { PlaygroundState, PlaygroundStore } from './types'

const DEFAULT_PRESET_INDEX = 0

function generateLastModified(): number {
  return Date.now()
}

function getCurrentPreset(state: PlaygroundState): PlaygroundState {
  return gridPresets[state.presetIndex ?? DEFAULT_PRESET_INDEX].createState()
}

export const usePersistentStore = createPersistentStore<PlaygroundStore>((set, get) => {
  return {
    ...gridPresets[DEFAULT_PRESET_INDEX].createState(),
    reloadState: () => {
      const state = JSON.parse(decodeLocationHash() ?? '{}')
      set({
        ...get(),
        ...state,
      })
    },
    clearState: () => {
      set(gridPresets[get().presetIndex ?? DEFAULT_PRESET_INDEX].createState())
      setTimeout(() => {
        replaceEncodedLocationHash('')
      }, DEBOUNCE_DELAY * 1.1)
    },
    setTitle: (title) => set({ title, lastModified: generateLastModified() }),
    selectPreset: (presetIndex) => {
      const currentState = get()
      const newPreset = gridPresets[presetIndex].createState()
      set({
        ...currentState,
        ...newPreset,
        presetIndex,
        lastModified: undefined,
      })
    },
    //
    setWrapperStyles: (wrapperStyles) => set({ wrapperStyles: wrapperStyles, lastModified: generateLastModified() }),
    resetWrapperStyles: () => {
      const currentState = get()
      const currentPreset = getCurrentPreset(currentState)
      return set({ wrapperStyles: currentPreset.wrapperStyles, lastModified: generateLastModified() })
    },
    setGridStyles: (gridStyles) => {
      const grids = get().grids.map((grid) => ({ ...grid, styles: gridStyles }))
      set({ grids, gridStyles: gridStyles, lastModified: generateLastModified() })
    },
    resetGridStyles: () => {
      const currentState = get()
      const currentPreset = getCurrentPreset(currentState)
      const grids = currentState.grids.map((grid) => ({ ...grid, styles: currentPreset.gridStyles }))
      set({ grids, gridStyles: currentPreset.gridStyles, lastModified: generateLastModified() })
    },
    setGridItemStyles: (gridItemStyles) => {
      set({ gridItemStyles: gridItemStyles, lastModified: generateLastModified() })
    },
    resetGridItemStyles: () => {
      const currentState = get()
      const currentPreset = getCurrentPreset(currentState)
      set({ gridItemStyles: currentPreset.gridItemStyles, lastModified: generateLastModified() })
    },
    //
    addGrid: () => {
      const currentState = get()
      const currentGrids = currentState.grids
      const currentPreset = getCurrentPreset(currentState)
      const lastGridCopy = currentGrids.length > 0 ? deepClone(currentGrids[currentGrids.length - 1]) : undefined

      return set({
        grids: [
          ...currentGrids,
          lastGridCopy ?? {
            styles: currentPreset.gridStyles,
            items: [],
          },
        ],
        lastModified: generateLastModified(),
      })
    },
    removeLastGrid: () => {
      const grids = [...get().grids]
      if (grids.length === 0) {
        return
      }
      grids.pop()
      set({ grids, lastModified: generateLastModified() })
    },
    //
    addGridItem: (gridIndex) => {
      const grids = [...get().grids]
      grids[gridIndex].items.push({})
      set({ grids, lastModified: generateLastModified() })
    },
    removeLastGridItem: (gridIndex) => {
      const grids = [...get().grids]
      if (grids.length === 0 || grids[gridIndex].items.length === 0) {
        return
      }
      grids[gridIndex].items.pop()
      set({ grids, lastModified: generateLastModified() })
    },
  }
})
