import { decodeLocationState, deepClone, encodeLocationState } from '@/utils'
import createPersistentStore from './createPersistentStore'
import { gridPresets } from './presets'
import { PlaygroundState, PlaygroundStore } from './types'

const DEFAULT_PRESET_INDEX = 0

function generateLastModified(): number {
  return Date.now()
}

function getCurrentPreset(state: PlaygroundState): PlaygroundState {
  return gridPresets[state.presetIndex ?? DEFAULT_PRESET_INDEX].createState()
}

const usePlaygroundStore = createPersistentStore<PlaygroundStore>((rawSet, get) => {
  const locationState = decodeLocationState<PlaygroundState>()
  const defaultState: PlaygroundState = {
    ...{
      selectedGrid: -1,
      selectedGridItem: -1,
    },
    ...gridPresets[DEFAULT_PRESET_INDEX].createState(),
    ...locationState,
  }

  const updateState = (state: Partial<PlaygroundState>) => {
    rawSet({ lastModified: generateLastModified(), ...state })
  }

  return {
    ...defaultState,
    loadStateFromLocationHash: () => {
      const locationState: Partial<PlaygroundState> = decodeLocationState<PlaygroundState>()
      const currentState = get()

      if (locationState.lastModified === currentState.lastModified) {
        console.log('loadStateFromLocationHash skipped: timestamps are equal')
        return
      }

      rawSet({
        ...currentState,
        ...locationState,
      })
    },
    setTitle: (title) => updateState({ title }),
    selectPreset: (presetIndex) => {
      const currentState = get()
      const newPreset = gridPresets[presetIndex].createState()
      updateState({
        ...currentState,
        ...newPreset,
        presetIndex,
        lastModified: undefined,
      })
    },
    //
    setWrapperStyles: (wrapperStyles) => updateState({ wrapperStyles: wrapperStyles }),
    resetWrapperStyles: () => {
      const currentState = get()
      const currentPreset = getCurrentPreset(currentState)
      return updateState({ wrapperStyles: currentPreset.wrapperStyles })
    },
    setGridStyles: (gridStyles, gridIndex) => {
      const grids = get().grids
      if (gridIndex !== undefined) {
        if (!grids[gridIndex]) {
          throw new Error(`Grid not found: #${gridIndex}`)
        }
        grids[gridIndex].styles = gridStyles
        updateState({ grids })
        return
      }
      updateState({ grids, gridStyles: gridStyles })
    },
    resetGridStyles: () => {
      const currentState = get()
      const grids = currentState.grids.map((grid) => ({ ...grid, styles: undefined }))
      updateState({ grids })
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
        updateState({ grids })
        return
      }
      updateState({ gridItemStyles: gridItemStyles })
    },
    resetGridItemStyles: () => {
      const currentState = get()
      const grids = currentState.grids.map((grid) => ({
        ...grid,
        items: grid.items.map((item) => ({ ...item, styles: undefined })),
      }))
      updateState({ grids })
    },
    //
    addGrid: () => {
      const currentState = get()
      const currentGrids = currentState.grids
      const lastGridCopy = currentGrids.length > 0 ? deepClone(currentGrids[currentGrids.length - 1]) : undefined

      return updateState({
        selectedGrid: currentGrids.length,
        selectedGridItem: -1,
        grids: [
          ...currentGrids,
          lastGridCopy ?? {
            items: [],
          },
        ],
      })
    },
    addGridItem: (gridIndex) => {
      const currentState = get()
      const grids = [...currentState.grids]
      const selectedGridItem = grids[gridIndex].items.length
      grids[gridIndex].items.push({})
      updateState({ grids, selectedGridItem })
    },
    removeGrid: (gridIndex) => {
      const grids = [...get().grids]
      if (!grids[gridIndex]) {
        throw new Error(`Grid not found: #${gridIndex}`)
      }
      const selectedGrid = grids.length - 2
      grids.splice(gridIndex, 1)
      updateState({ grids, selectedGrid })
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
      updateState({ grids, selectedGridItem })
    },
    //
    selectGrid: (gridIndex) => updateState({ selectedGrid: gridIndex, selectedGridItem: -1 }),
    selectGridItem: (gridItemIndex) => updateState({ selectedGridItem: gridItemIndex }),
    setGridItemText(text, gridIndex, gridItemIndex) {
      const grids = [...get().grids]
      if (!grids[gridIndex]) {
        throw new Error(`Grid not found: #${gridIndex}`)
      }
      if (!grids[gridIndex].items[gridItemIndex]) {
        throw new Error(`Grid item not found: #${gridItemIndex}`)
      }
      grids[gridIndex].items[gridItemIndex].text = text
      updateState({ grids })
    },
  }
})

export default usePlaygroundStore

export function usePlaygroundStateAsUrl() {
  const store = usePlaygroundStore((state) => state)
  const host = window.location.origin

  return `${host}${import.meta.env.BASE_URL}#${encodeLocationState(store)}`
}
