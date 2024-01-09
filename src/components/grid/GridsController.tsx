import usePlaygroundStore from '@/state/usePlaygroundStore'
import GridController, { GridControllerAction } from './GridController'
import GridSelector from './GridSelector'

export function GridsController() {
  const [grids, currentGridIndex, commonGridStyles, setCode, resetCode, addGrid, removeGrid, setCurrentGridIndex] =
    usePlaygroundStore((state) => [
      state.grids,
      state.selectedGrid,
      state.gridStyles,
      state.setGridStyles,
      state.resetGridStyles,
      state.addGrid,
      state.removeGrid,
      state.selectGrid,
    ])

  const isSingleGrid = grids.length === 1
  const isCommonStylesMode = currentGridIndex === -1
  const operativeGridIndex = isSingleGrid ? 0 : currentGridIndex
  const currentGrid = grids[operativeGridIndex]
  const gridDisabledButtons: GridControllerAction[] = []

  if (isCommonStylesMode || grids.length === 0) {
    gridDisabledButtons.push('remove')
  }

  return (
    <GridController
      autoFocus
      title="Grid: "
      code={isCommonStylesMode ? commonGridStyles : currentGrid?.styles}
      onCodeChange={({ code: newCode }) => {
        setCode(newCode, isCommonStylesMode ? undefined : currentGridIndex)
      }}
      buttons={['add', 'remove', 'reset', 'collapse']}
      disabledButtons={gridDisabledButtons}
      onAddClick={() => {
        addGrid()
      }}
      onRemoveClick={() => {
        if (isCommonStylesMode) {
          return
        }
        removeGrid(currentGridIndex)
      }}
      onResetClick={() => {
        resetCode()
      }}
      toolbarChildren={
        <GridSelector
          elementCount={grids.length}
          value={currentGridIndex}
          onChange={(value) => {
            setCurrentGridIndex(value)
          }}
          label="Grid styles:"
          labelTemplate="#%"
        />
      }
    />
  )
}
