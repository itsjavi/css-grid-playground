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

export type GridItemState = {
  styles?: string
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
  setGridStyles: (styles: string) => void
  setGridItemStyles: (styles: string) => void
  //
  resetWrapperStyles: () => void
  resetGridStyles: () => void
  resetGridItemStyles: () => void
  //
  addGrid: () => void
  removeLastGrid: () => void
  addGridItem: (gridIndex: number) => void
  removeLastGridItem: (gridIndex: number) => void
  //
  reloadState: () => void
  clearState: () => void
  //
  selectPreset: (presetIndex: number) => void
}

export type PlaygroundStore = PlaygroundState & PlaygroundActions
