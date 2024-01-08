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
    ...{
      ...{
        selectedGrid: -1,
        selectedGridItem: -1,
      },
      ...gridPresets[DEFAULT_PRESET_INDEX].createState(),
    },
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
    setGridStyles: (gridStyles, gridIndex) => {
      const grids = get().grids
      if (gridIndex !== undefined) {
        if (!grids[gridIndex]) {
          throw new Error(`Grid not found: #${gridIndex}`)
        }
        grids[gridIndex].styles = gridStyles
        set({ grids, lastModified: generateLastModified() })
        return
      }
      set({ grids, gridStyles: gridStyles, lastModified: generateLastModified() })
    },
    resetGridStyles: () => {
      const currentState = get()
      const grids = currentState.grids.map((grid) => ({ ...grid, styles: undefined }))
      set({ grids, lastModified: generateLastModified() })
    },
    setGridItemStyles: (gridItemStyles, gridIndex, gridItemIndex) => {
      if (gridIndex !== undefined && gridItemIndex !== undefined) {
        const currentState = get()
        const grids = currentState.grids
        if (!grids[gridIndex]) {
          throw new Error(`Grid not found: #${gridIndex}`)
        }
        if (!grids[gridIndex].items[gridItemIndex]) {
          throw new Error(`Grid item not found: #${gridItemIndex}`)
        }
        grids[gridIndex].items[gridItemIndex].styles = gridItemStyles
        set({ grids, lastModified: generateLastModified() })
        return
      }
      set({ gridItemStyles: gridItemStyles, lastModified: generateLastModified() })
    },
    resetGridItemStyles: () => {
      const currentState = get()
      const grids = currentState.grids.map((grid) => ({
        ...grid,
        items: grid.items.map((item) => ({ ...item, styles: undefined })),
      }))
      set({ grids, lastModified: generateLastModified() })
    },
    //
    addGrid: () => {
      const currentState = get()
      const currentGrids = currentState.grids
      const lastGridCopy = currentGrids.length > 0 ? deepClone(currentGrids[currentGrids.length - 1]) : undefined

      return set({
        selectedGrid: currentGrids.length,
        selectedGridItem: -1,
        grids: [
          ...currentGrids,
          lastGridCopy ?? {
            items: [],
          },
        ],
        lastModified: generateLastModified(),
      })
    },
    // removeLastGrid: () => {
    //   const grids = [...get().grids]
    //   if (grids.length === 0) {
    //     return
    //   }
    //   grids.pop()
    //   set({ grids, lastModified: generateLastModified() })
    // },
    //
    addGridItem: (gridIndex) => {
      const currentState = get()
      const grids = [...currentState.grids]
      const selectedGridItem = grids[gridIndex].items.length
      grids[gridIndex].items.push({})
      set({ grids, lastModified: generateLastModified(), selectedGridItem })
    },
    // removeLastGridItem: (gridIndex) => {
    //   const grids = [...get().grids]
    //   if (grids.length === 0 || grids[gridIndex].items.length === 0) {
    //     return
    //   }
    //   grids[gridIndex].items.pop()
    //   set({ grids, lastModified: generateLastModified() })
    // },
    removeGrid: (gridIndex) => {
      const grids = [...get().grids]
      if (!grids[gridIndex]) {
        throw new Error(`Grid not found: #${gridIndex}`)
      }
      const selectedGrid = grids.length - 2
      grids.splice(gridIndex, 1)
      set({ grids, selectedGrid, lastModified: generateLastModified() })
    },
    removeGridItem: (gridIndex, gridItemIndex) => {
      const grids = [...get().grids]
      if (!grids[gridIndex]) {
        throw new Error(`Grid not found: #${gridIndex}`)
      }
      if (grids[gridIndex].items.length === 0) {
        throw new Error(`Grid item not found: #${gridItemIndex}`)
      }
      const selectedGridItem = grids[gridIndex].items.length - 2
      grids[gridIndex].items.splice(gridItemIndex, 1)
      set({ grids, selectedGridItem, lastModified: generateLastModified() })
    },
    //
    selectGrid: (gridIndex) => set({ selectedGrid: gridIndex, selectedGridItem: -1 }),
    selectGridItem: (gridItemIndex) => set({ selectedGridItem: gridItemIndex }),
    setGridItemText(text, gridIndex, gridItemIndex) {
      console.log('setGridItemText', text, gridIndex, gridItemIndex)
      const grids = [...get().grids]
      if (!grids[gridIndex]) {
        throw new Error(`Grid not found: #${gridIndex}`)
      }
      if (!grids[gridIndex].items[gridItemIndex]) {
        throw new Error(`Grid item not found: #${gridItemIndex}`)
      }
      grids[gridIndex].items[gridItemIndex].text = text
      set({ grids, lastModified: generateLastModified() })
    },
  }
})
