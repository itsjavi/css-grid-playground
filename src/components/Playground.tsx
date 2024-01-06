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
        <span className="sm-hidden">Show code</span>
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
          if (!store.lastModified) {
            store.selectPreset(Number(e.target.value))
          }
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
  const [currentGridIndex, setCurrentGridIndex] = useState(0)

  const gridDisabledButtons: GridControllerAction[] = []
  const gridItemDisabledButtons: GridControllerAction[] = []
  const currentGrid = store.grids[currentGridIndex]

  if (store.grids.length === 0) {
    gridDisabledButtons.push('remove')
    gridItemDisabledButtons.push('add')
    gridItemDisabledButtons.push('remove')
  }
  if (currentGrid && currentGrid.items.length === 0) {
    gridItemDisabledButtons.push('remove')
  }

  return (
    <div className={styles.gridControllers}>
      <GridController
        title="Wrapper Styles"
        code={store.wrapperStyles}
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
        code={store.gridStyles}
        onCodeChange={({ code }) => {
          store.setGridStyles(code)
        }}
        buttons={['add', 'remove', 'reset', 'collapse']}
        disabledButtons={gridDisabledButtons}
        onAddClick={() => {
          store.addGrid()
          if (currentGridIndex < 0) {
            setCurrentGridIndex(0)
          }
        }}
        onRemoveClick={() => {
          const lastIndex = store.grids.length - 1
          if (lastIndex === currentGridIndex) {
            setCurrentGridIndex(currentGridIndex - 1)
          }
          store.removeLastGrid()
        }}
        onResetClick={() => {
          store.resetGridStyles()
        }}
      />
      <GridController
        title="Grid Items"
        code={store.gridItemStyles}
        onCodeChange={({ code }) => {
          store.setGridItemStyles(code)
        }}
        buttons={['add', 'remove', 'reset', 'collapse']}
        disabledButtons={gridItemDisabledButtons}
        onAddClick={() => {
          store.addGridItem(currentGridIndex)
        }}
        onRemoveClick={() => {
          store.removeLastGridItem(currentGridIndex)
        }}
        onResetClick={() => {
          store.resetGridItemStyles()
        }}
        numElements={store.grids.length}
        elementIndex={currentGridIndex}
        onElementSelect={({ elementIndex }) => {
          setCurrentGridIndex(elementIndex)
        }}
        elementSelectTemplate={'of grid %'}
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
        <div className={styles.result}>
          {hasProse && (
            <section>
              {presetTitle && <h2 className={styles.resultTitle}>{presetTitle}</h2>}
              {presetDescription && <div className={styles.resultDescription}>{presetDescription}</div>}
            </section>
          )}
          <div className={styles.resultBody}>
            <AsStyled css={store.wrapperStyles}>{gridElements}</AsStyled>
          </div>
        </div>
        <GeneralActionsPanel editorsVisible={showEditors} setEditorsVisible={setShowEditors} />
        {showEditors && <GridControllers />}
      </div>
    </div>
  )
}
