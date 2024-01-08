import codeIcon from '@/assets/code-2.svg'
import copyIcon from '@/assets/copy.svg'
import restoreIcon from '@/assets/history.svg'
import { usePersistentStore } from '@/state/playgroundStore'
import { gridPresets } from '@/state/presets'
import { cn } from '@/utils'
import { ComponentPropsWithoutRef, useRef, useState } from 'react'
import AsStyled from './AsStyled'
import styles from './Playground.module.scss'
import GridController, { GridControllerAction } from './grid/GridController'
import GridSelector from './grid/GridSelector'
import { generateGrids, generateGridsHtmlCode } from './grid/grid-generators'

type PlaygroundProps = {
  children?: never
} & ComponentPropsWithoutRef<'div'>

function ShowCodeTrigger() {
  const store = usePersistentStore()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const codePreviewRef = useRef<HTMLPreElement>(null)

  const handleCopyButtonClick = () => {
    if (!codePreviewRef.current) {
      return
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(codePreviewRef.current.innerText)
    }
    const selection = window.getSelection()
    if (!selection) {
      return
    }
    selection.selectAllChildren(codePreviewRef.current)
  }

  const handleCopyCodeOnClick = (e: React.MouseEvent<HTMLPreElement, MouseEvent>) => {
    const selection = window.getSelection()
    if (!selection) {
      return
    }
    selection.selectAllChildren(e.currentTarget)
  }

  const handleOpenDialog = () => {
    if (!dialogRef.current) {
      return
    }
    if (dialogRef.current.open) {
      dialogRef.current.close()
    } else {
      dialogRef.current.showModal()
    }
  }

  return (
    <>
      <dialog className={cn(styles.codeDialog)} ref={dialogRef}>
        <form method="dialog">
          <button type="button" title="Copy code" onClick={handleCopyButtonClick}>
            <img src={copyIcon} alt="Copy" />
          </button>
          <button type="submit">Close</button>
        </form>
        <pre className="source-code" ref={codePreviewRef} onClick={handleCopyCodeOnClick}>
          <code>{generateGridsHtmlCode(store)}</code>
        </pre>
      </dialog>
      <button type="button" title="Show code" onClick={handleOpenDialog}>
        <img src={codeIcon} alt="Code" />
        <span className="-sm-hidden">Show code</span>
      </button>
    </>
  )
}

function PresetSelector() {
  const store = usePersistentStore()
  const currentRef = useRef<string>(String(store.presetIndex ?? 0))

  return (
    <div className={styles.selectWithButton}>
      <span>Preset: </span>
      <select
        defaultValue={store.presetIndex}
        onChange={(e) => {
          currentRef.current = e.target.value
          //if (!store.lastModified) {
          store.selectPreset(Number(e.target.value))
          // }
        }}
      >
        {gridPresets.map((preset, index) => {
          return (
            <option key={`preset-${index}`} value={index}>
              {index === 0 ? '- None -' : preset.name}
            </option>
          )
        })}
      </select>
      {store.lastModified !== undefined && (
        <button
          title="Reset code"
          type="button"
          onClick={() => {
            store.selectPreset(Number(currentRef.current))
          }}
        >
          <img src={restoreIcon} alt="Reset" />
          <span className="sm-hidden">Reset</span>
        </button>
      )}
    </div>
  )
}

function GeneralActionsPanel({
  editorsVisible,
  setEditorsVisible,
}: { editorsVisible: boolean; setEditorsVisible: (visible: boolean) => void }) {
  return (
    <div className={styles.panel} data-noselect>
      <div className={styles.controlGroup}>
        <PresetSelector />
        <div className={styles.controlGroupNested}>
          <>
            {editorsVisible && (
              <button title="Hide Editors" type="button" onClick={() => setEditorsVisible(false)}>
                Hide Editors
              </button>
            )}
            {!editorsVisible && (
              <button title="Show Editors" type="button" onClick={() => setEditorsVisible(true)}>
                Show Editors
              </button>
            )}
          </>
          <ShowCodeTrigger />
        </div>
      </div>
    </div>
  )
}

function GridControllers() {
  const store = usePersistentStore()
  const isSingleGrid = store.grids.length === 1
  const currentGrid = store.grids[isSingleGrid ? 0 : store.selectedGrid]
  const currentGridItem = currentGrid?.items[store.selectedGridItem]

  const isGeneralGrid = store.selectedGrid === -1
  const isGeneralGridItem = store.selectedGridItem === -1

  const gridDisabledButtons: GridControllerAction[] = []
  const gridItemDisabledButtons: GridControllerAction[] = []
  const numGridItems = currentGrid?.items.length ?? 0

  if (isGeneralGrid || store.grids.length === 0) {
    gridDisabledButtons.push('remove')
    // gridDisabledButtons.push('reset')
  }

  if (!currentGrid || store.grids.length === 0) {
    gridItemDisabledButtons.push('add')
    // gridItemDisabledButtons.push('remove')
  }

  if (isGeneralGridItem || numGridItems === 0) {
    gridItemDisabledButtons.push('remove')
    // gridItemDisabledButtons.push('reset')
  }

  return (
    <div className={styles.gridControllers}>
      <GridController
        title="Wrapper Styles"
        code={store.wrapperStyles}
        onCodeChange={({ code }) => {
          store.setWrapperStyles(code)
        }}
        buttons={['collapse']}
        onResetClick={() => {
          store.resetWrapperStyles()
        }}
      />
      <GridController
        autoFocus
        title="Grid: "
        code={isGeneralGrid ? store.gridStyles : currentGrid?.styles}
        onCodeChange={({ code: newCode }) => {
          store.setGridStyles(newCode, isGeneralGrid ? undefined : store.selectedGrid)
        }}
        buttons={['add', 'remove', 'reset', 'collapse']}
        disabledButtons={gridDisabledButtons}
        onAddClick={() => {
          store.addGrid()
        }}
        onRemoveClick={() => {
          if (isGeneralGrid) {
            return
          }
          store.removeGrid(store.selectedGrid)
        }}
        onResetClick={() => {
          store.resetGridStyles()
        }}
        toolbarChildren={
          <GridSelector
            elementCount={store.grids.length}
            value={store.selectedGrid}
            onChange={(value) => {
              store.selectGrid(value)
            }}
            label="Grid styles:"
            labelTemplate="#%"
          />
        }
      />
      <GridController
        title="Item: "
        code={isGeneralGridItem ? store.gridItemStyles : currentGridItem?.styles}
        onCodeChange={({ code: newCode }) => {
          if (isGeneralGridItem) {
            store.setGridItemStyles(newCode)
            return
          }
          store.setGridItemStyles(newCode, store.selectedGrid, store.selectedGridItem)
        }}
        buttons={['add', 'remove', 'reset', 'collapse']}
        disabledButtons={gridItemDisabledButtons}
        onAddClick={() => {
          store.addGridItem(isSingleGrid ? 0 : store.selectedGrid)
        }}
        onRemoveClick={() => {
          if (isGeneralGridItem) {
            return
          }
          store.removeGridItem(isSingleGrid ? 0 : store.selectedGrid, store.selectedGridItem)
        }}
        onResetClick={() => {
          store.resetGridItemStyles()
        }}
        toolbarChildren={
          <GridSelector
            elementCount={numGridItems}
            value={store.selectedGridItem}
            onChange={(value) => {
              store.selectGridItem(value)
            }}
            label={'Grid Item styles:'}
            labelTemplate="#%"
          />
        }
      />
    </div>
  )
}

export default function Playground({ className, ...props }: PlaygroundProps) {
  const store = usePersistentStore()
  const gridElements = generateGrids(store)
  const [showEditors, setShowEditors] = useState(true)
  const presetIndex = store.presetIndex ?? 0
  const currentPreset = gridPresets[presetIndex]
  const presetTitle = presetIndex > 0 ? currentPreset.name : undefined
  const presetDescription = presetIndex > 0 ? currentPreset.description : undefined
  const hasProse = presetTitle || presetDescription

  return (
    <div className={cn(styles.editor, className)} {...props}>
      <div
        className={cn(styles.editorBody, {
          [styles.editorBodyWithoutEditors]: !showEditors,
        })}
      >
        <section className={styles.result}>
          {hasProse && (
            <section>
              {presetTitle && <h2 className={styles.resultTitle}>{presetTitle}</h2>}
              {presetDescription && <div className={styles.resultDescription}>{presetDescription}</div>}
            </section>
          )}
          <div className={styles.resultBody}>
            <AsStyled css={store.wrapperStyles}>{gridElements}</AsStyled>
          </div>
        </section>
        {showEditors && <GridControllers />}
        <GeneralActionsPanel editorsVisible={showEditors} setEditorsVisible={setShowEditors} />
      </div>
    </div>
  )
}
