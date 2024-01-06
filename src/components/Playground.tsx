import codeIcon from '@/assets/code-2.svg'
import { usePersistentStore } from '@/state/playgroundStore'
import { cn } from '@/utils'
import { ComponentPropsWithoutRef, useRef, useState } from 'react'
import AsStyled from './AsStyled'
import styles from './Playground.module.scss'
import GridController, { GridControllerAction } from './grid/GridController'
import { generateGrids, generateGridsHtmlCode } from './grid/grid-generators'

type PlaygroundProps = {
  children?: never
} & ComponentPropsWithoutRef<'div'>

export default function Playground({ className, ...props }: PlaygroundProps) {
  const store = usePersistentStore()
  console.log('store-rerender', store.grids)
  const gridElements = generateGrids(store)
  const [currentGrid, setCurrentGrid] = useState(0)
  const [showEditors, setShowEditors] = useState(true)
  const gridContainerButtons: GridControllerAction[] = ['add', 'reset', 'collapse']
  const gridItemButtons: GridControllerAction[] = ['reset', 'collapse']
  const dialogRef = useRef<HTMLDialogElement>(null)

  if (store.grids.length > 0) {
    gridContainerButtons.push('remove')
    gridItemButtons.push('add')
  }
  if (store.grids[currentGrid]?.items.length > 0) {
    gridItemButtons.push('remove')
  }

  console.log('rendering playground')

  return (
    <div className={cn(styles.editor, className)} {...props}>
      <dialog className={cn(styles.code)} ref={dialogRef}>
        <form method="dialog">
          <button type="submit">Close</button>
        </form>
        <pre className="source-code">
          <code>{generateGridsHtmlCode(store)}</code>
        </pre>
      </dialog>
      <div className={styles.panel}>
        <div className={styles.controlGroup}>
          <div className={styles.selectWithButton}>
            <span>Preset: </span>
            <select defaultValue={'1'}>
              <option value="0">None</option>
              <option value="1">Default</option>
            </select>
            <button title="Show Editors" type="button" onClick={() => store.clearState()}>
              Load
            </button>
          </div>
          <div className={styles.controlGroupNested}>
            {showEditors && (
              <button title="Hide Editors" type="button" onClick={() => setShowEditors(false)}>
                Hide Editors
              </button>
            )}
            {!showEditors && (
              <button title="Show Editors" type="button" onClick={() => setShowEditors(true)}>
                Show Editors
              </button>
            )}
            <button
              type="button"
              title="Show code"
              onClick={() => {
                if (!dialogRef.current) {
                  return
                }
                if (dialogRef.current.open) {
                  dialogRef.current.close()
                } else {
                  dialogRef.current.showModal()
                }
              }}
            >
              <img src={codeIcon} alt="Code" />
              Show code
            </button>
          </div>
        </div>
      </div>

      {showEditors && (
        <div className={styles.topControllers}>
          <GridController
            title="Wrapper Styles"
            initialCode={store.wrapperStyles}
            onCodeChange={({ code }) => {
              store.setWrapperStyles(code)
            }}
            buttons={['reset', 'collapse']}
            onResetClick={() => {
              store.resetWrapperStyles()
            }}
          />
          <GridController
            title="Grids"
            initialCode={store.gridStyles}
            onCodeChange={({ code }) => {
              store.setGridContainerTemplate(code)
            }}
            buttons={gridContainerButtons}
            onAddClick={() => {
              store.addGridContainer()
              if (currentGrid < 0) {
                setCurrentGrid(0)
              }
            }}
            onRemoveClick={() => {
              const lastIndex = store.grids.length - 1
              if (lastIndex === currentGrid) {
                setCurrentGrid(currentGrid - 1)
              }
              store.removeGridContainer(lastIndex)
            }}
            onResetClick={() => {
              store.resetGridContainerTemplate()
            }}
          />
          <GridController
            title="Grid Items"
            initialCode={store.gridItemStyles}
            onCodeChange={({ code }) => {
              store.setGridItemTemplate(code)
            }}
            buttons={gridItemButtons}
            onAddClick={() => {
              store.addGridItem(currentGrid)
            }}
            onRemoveClick={() => {
              const lastItem = store.grids[currentGrid].items.length - 1
              store.removeGridItem(currentGrid, lastItem)
            }}
            onResetClick={() => {
              store.resetGridItemTemplate()
            }}
            numElements={store.grids.length}
            elementIndex={currentGrid}
            onElementSelect={({ elementIndex }) => {
              setCurrentGrid(elementIndex)
            }}
            elementSelectTemplate={'of grid %'}
          />
        </div>
      )}
      <div className={styles.panel}>Result:</div>
      <div className={styles.output}>
        <AsStyled css={store.wrapperStyles}>{gridElements}</AsStyled>
      </div>
    </div>
  )
}
