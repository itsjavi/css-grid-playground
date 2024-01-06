import { decodeLocationHash, replaceEncodedLocationHash } from '@/utils'
import createPersistentStore from './createPersistentStore'
import { DEBOUNCE_DELAY } from './debouncedHashStorage'

export type GridItemState = {
  styles: string
}

export type GridContainerState = {
  styles: string
  items: GridItemState[]
}

export type GridContainerVirtualDom = {
  className: string
  style: string
  children: GridItemVirtualDom[]
}

export type GridItemVirtualDom = {
  className: string
  style: string
  innerText: string
}

export type PlaygroundState = {
  /**
   * Title of the prototype
   */
  title?: string
  /**
   * Global styles for the wrapper of grid containers
   */
  wrapperStyles: string
  /**
   * Global styles for all grid containers
   */
  gridStyles: string
  /**
   * Global styles for all grid items
   */
  gridItemStyles: string
  /**
   * Grid containers and their children with styles and other data
   */
  grids: GridContainerState[]
  lastModified?: number
}

export type PlaygroundActions = {
  setTitle: (title: string) => void
  setWrapperStyles: (styles: string) => void
  setGridContainerTemplate: (styles: string) => void
  setGridItemTemplate: (styles: string) => void
  //
  resetWrapperStyles: () => void
  resetGridContainerTemplate: () => void
  resetGridItemTemplate: () => void
  //
  addGridContainer: (container?: GridContainerState) => void
  removeGridContainer: (index: number) => void
  addGridItem: (containerIndex: number, item?: GridItemState) => void
  removeGridItem: (containerIndex: number, itemIndex: number) => void
  //
  loadState: () => void
  clearState: () => void
  //
}

export type PlaygroundStore = PlaygroundState & PlaygroundActions

function generateLastModified(): number {
  return Date.now()
}

const defaultGridStyles = `display: grid;
gap: 1rem;
flex: 1;
padding: 1rem;
background: var(--pink-1);
grid-template-columns: 1fr 5fr 3fr;
grid-template-rows: 1fr 3fr 1fr;
border: 2px solid var(--pink-5);
`

const defaultGridItemStyles = `background: var(--pink-2);
border: 2px solid var(--pink-5);
color: var(--pink-8);
`

const defaultWrapperStyles = `display: flex;
gap: 1rem;
padding: 0 1rem 1rem 1rem;
`

// Immutable initial state
function createInitialState(): PlaygroundState {
  return {
    // title: 'Untitled',
    wrapperStyles: defaultWrapperStyles,
    gridStyles: defaultGridStyles,
    gridItemStyles: defaultGridItemStyles,
    grids: [
      {
        styles: '',
        items: [
          {
            styles: '',
          },
          {
            styles: '',
          },
          {
            styles: '',
          },
          {
            styles: '',
          },
          {
            styles: '',
          },
          {
            styles: '',
          },
          {
            styles: '',
          },
          {
            styles: '',
          },
          {
            styles: '',
          },
        ],
      },
    ],
  }
}

export const usePersistentStore = createPersistentStore<PlaygroundStore>((set, get) => ({
  ...createInitialState(),
  loadState: () => {
    const state = JSON.parse(decodeLocationHash() ?? '{}')
    set({
      ...get(),
      ...state,
    })
  },
  clearState: () => {
    set(createInitialState())
    setTimeout(() => {
      replaceEncodedLocationHash('')
    }, DEBOUNCE_DELAY * 1.1)
  },
  setTitle: (title) => set({ title, lastModified: generateLastModified() }),
  setWrapperStyles: (wrapperStyles) => set({ wrapperStyles: wrapperStyles, lastModified: generateLastModified() }),
  setGridContainerTemplate: (gridStyles) => {
    const grids = get().grids.map((grid) => ({ ...grid, styles: gridStyles }))
    set({ grids, gridStyles: gridStyles, lastModified: generateLastModified() })
  },
  setGridItemTemplate: (gridItemStyles) => {
    set({ gridItemStyles: gridItemStyles, lastModified: generateLastModified() })
  },
  addGridContainer: (container) => {
    const currentGrids = get().grids
    const lastGridCopy =
      currentGrids.length > 0 ? JSON.parse(JSON.stringify(currentGrids[currentGrids.length - 1])) : undefined

    return set({
      grids: [
        ...currentGrids,
        container ??
          lastGridCopy ?? {
            styles: defaultGridStyles,
            items: [],
          },
      ],
      lastModified: generateLastModified(),
    })
  },
  removeGridContainer: (index) => {
    const grids = [...get().grids]
    grids.splice(index, 1)
    set({ grids, lastModified: generateLastModified() })
  },
  addGridItem: (containerIndex, item) => {
    const grids = [...get().grids]
    const grid = grids[containerIndex]

    const lastItemCopy =
      grid.items.length > 0 ? JSON.parse(JSON.stringify(grid.items[grid.items.length - 1])) : undefined
    grids[containerIndex].items.push(
      item ??
        lastItemCopy ?? {
          styles: '',
        },
    )
    set({ grids, lastModified: generateLastModified() })
  },
  removeGridItem: (containerIndex, itemIndex) => {
    const grids = [...get().grids]
    grids[containerIndex].items.splice(itemIndex, 1)
    set({ grids, lastModified: generateLastModified() })
  },
  resetWrapperStyles: () => set({ wrapperStyles: defaultWrapperStyles, lastModified: generateLastModified() }),
  resetGridContainerTemplate: () => {
    const grids = get().grids.map((grid) => ({ ...grid, styles: defaultGridStyles }))
    set({ grids, gridStyles: defaultGridStyles, lastModified: generateLastModified() })
  },
  resetGridItemTemplate: () => {
    set({ gridItemStyles: defaultGridItemStyles, lastModified: generateLastModified() })
  },
}))
