import usePlaygroundStore from '@/state/usePlaygroundStore'
import GridController, { GridControllerAction } from './GridController'
import GridSelector from './GridSelector'

export function GridItemsController() {
  const [
    grids,
    currentGridIndex,
    currentGridItemIndex,
    commonStyles,
    setCode,
    resetCode,
    addGridItem,
    removeGridItem,
    setCurrentGridItemIndex,
  ] = usePlaygroundStore((state) => [
    state.grids,
    state.selectedGrid,
    state.selectedGridItem,
    state.gridItemStyles,
    state.setGridItemStyles,
    state.resetGridItemStyles,
    state.addGridItem,
    state.removeGridItem,
    state.selectGridItem,
  ])

  const isSingleGrid = grids.length === 1
  const isCommonStylesMode = currentGridItemIndex === -1
  const operativeGridIndex = isSingleGrid ? 0 : currentGridIndex
  const currentGrid = grids[operativeGridIndex]
  const currentGridItem = currentGrid?.items[currentGridItemIndex]

  const gridItemDisabledButtons: GridControllerAction[] = []
  const numGridItems = currentGrid?.items.length ?? 0

  if (!currentGrid || grids.length === 0) {
    gridItemDisabledButtons.push('add')
  }

  if (isCommonStylesMode || numGridItems === 0) {
    gridItemDisabledButtons.push('remove')
  }

  return (
    <GridController
      title="Item: "
      code={isCommonStylesMode ? commonStyles : currentGridItem?.styles}
      onCodeChange={({ code: newCode }) => {
        if (isCommonStylesMode) {
          setCode(newCode)
          return
        }
        setCode(newCode, operativeGridIndex, currentGridItemIndex)
      }}
      buttons={['add', 'remove', 'reset', 'collapse']}
      disabledButtons={gridItemDisabledButtons}
      onAddClick={() => {
        addGridItem(operativeGridIndex)
      }}
      onRemoveClick={() => {
        if (isCommonStylesMode) {
          return
        }
        removeGridItem(operativeGridIndex, currentGridItemIndex)
      }}
      onResetClick={() => {
        resetCode()
      }}
      toolbarChildren={
        <GridSelector
          elementCount={numGridItems}
          value={currentGridItemIndex}
          onChange={(value) => {
            setCurrentGridItemIndex(value)
          }}
          label={'Grid Item styles:'}
          labelTemplate="#%"
        />
      }
    />
  )
}
