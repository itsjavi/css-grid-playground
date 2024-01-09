export type GridContainerVirtualDom = {
  className: string
  style: string
  outputStyle?: string
  children: GridItemVirtualDom[]
}

export type GridItemVirtualDom = {
  className: string
  style: string
  outputStyle?: string
  innerText: string
}

export type GridItemState = {
  styles?: string
  text?: string
}

export type GridContainerState = {
  styles?: string
  items: GridItemState[]
}

export type PlaygroundState = {
  /**
   * Title of the prototype
   */
  title?: string
  /**
   * Index of the selected preset
   */
  presetIndex?: number
  /**
   * Index of the selected grid container.
   * If undefined, all of them are targeted.
   */
  selectedGrid: number
  /**
   * Index of the selected grid item.
   * If undefined, all of them (for the current grid) are targeted.
   */
  selectedGridItem: number
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
  /**
   * The last time the state was modified
   */
  lastModified?: number
}

export type PlaygroundActions = {
  setTitle: (title: string) => void
  setWrapperStyles: (styles: string) => void
  setGridStyles: (styles: string, gridIndex?: number) => void
  setGridItemStyles: (styles: string, gridIndex?: number, gridItemIndex?: number) => void
  //
  resetWrapperStyles: () => void
  resetGridStyles: () => void
  resetGridItemStyles: () => void
  //
  addGrid: () => void
  removeGrid: (gridIndex: number) => void
  // removeLastGrid: () => void
  addGridItem: (gridIndex: number) => void
  removeGridItem: (gridIndex: number, gridItemIndex: number) => void
  // removeLastGridItem: (gridIndex: number) => void
  //
  syncStateFromLocationHash: () => void
  //
  selectPreset: (presetIndex: number) => void
  //
  selectGrid: (gridIndex: number) => void
  selectGridItem: (gridItemIndex: number) => void
  setGridItemText: (text: string, gridIndex: number, gridItemIndex: number) => void
}

export type PlaygroundStore = PlaygroundState & PlaygroundActions
