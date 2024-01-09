import collapseIcon from '@/assets/chevrons-down-up.svg'
import expandIcon from '@/assets/chevrons-up-down.svg'
import addIcon from '@/assets/copy-plus.svg'
import resetIcon from '@/assets/history.svg'
import removeIcon from '@/assets/trash-2.svg'
import { PlaygroundState } from '@/state/types'
import { cn, unindentLines } from '@/utils'
import { ComponentPropsWithoutRef, useRef, useState } from 'react'
import CodeEditorField from '../primitives/CodeEditorField'
import styles from './GridController.module.scss'

type GridControllerContext = {
  name?: keyof PlaygroundState
  code: string
}

export type GridControllerAction = 'add' | 'remove' | 'reset' | 'collapse'

type GridControllerProps = {
  title?: string
  name?: keyof PlaygroundState
  code?: string
  buttons?: Array<GridControllerAction>
  disabledButtons?: Array<GridControllerAction>
  onCodeChange?: (ctx: GridControllerContext) => void
  onAddClick?: (ctx: GridControllerContext) => void
  onRemoveClick?: (ctx: GridControllerContext) => void
  onResetClick?: (ctx: GridControllerContext) => void
  toolbarChildren?: React.ReactNode
  autoFocus?: boolean
} & ComponentPropsWithoutRef<'div'>

export default function GridController({
  className,
  title,
  name,
  code,
  buttons = ['collapse'],
  disabledButtons = [],
  onCodeChange,
  onAddClick,
  onRemoveClick,
  onResetClick,
  children,
  toolbarChildren,
  autoFocus,
  ...props
}: GridControllerProps) {
  const cleanCode = unindentLines(code ?? '')
  const codeRef = useRef(cleanCode)
  const [expanded, setExpanded] = useState(true)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onCodeChange) {
      onCodeChange({
        name,
        code: e.target.value,
      })
    }
    codeRef.current = e.target.value
  }

  const getContext = () => {
    return {
      name: name,
      code: codeRef.current ?? '',
    }
  }

  return (
    <div className={cn(styles.controller, className)} {...props}>
      <div className={styles.toolbar}>
        <div className={styles.titleWithButtons}>
          {buttons.includes('collapse') && (
            <div className={styles.actions}>
              <button
                disabled={disabledButtons.includes('collapse')}
                type="button"
                title={expanded ? 'Collapse editor' : 'Expand editor'}
                onClick={() => {
                  setExpanded(!expanded)
                }}
              >
                {expanded && <img src={collapseIcon} alt="Collapse editor" aria-label="Collapse editor" />}
                {!expanded && <img src={expandIcon} alt="Expand editor" aria-label="Expand editor" />}
              </button>
            </div>
          )}
          <div className={styles.title}>{title}</div>
          {toolbarChildren}
        </div>
        <div className={styles.actions}>
          {buttons.includes('add') && (
            <button
              disabled={disabledButtons.includes('add')}
              type="button"
              title="Duplicate & add last element"
              onClick={() => {
                onAddClick?.(getContext())
              }}
            >
              <img src={addIcon} alt="Add" aria-label="Add" />
            </button>
          )}
          {buttons.includes('remove') && (
            <button
              disabled={disabledButtons.includes('remove')}
              type="button"
              title="Remove last element"
              onClick={() => {
                onRemoveClick?.(getContext())
              }}
            >
              <img src={removeIcon} alt="Add" aria-label="Add" />
            </button>
          )}
          {buttons.includes('reset') && (
            <button
              disabled={disabledButtons.includes('reset')}
              type="button"
              title="Reset styles"
              onClick={() => {
                onResetClick?.(getContext())
              }}
            >
              <img src={resetIcon} alt="Add" aria-label="Add" />
            </button>
          )}
        </div>
      </div>
      {expanded && (
        <CodeEditorField
          placeholder="/** Custom CSS styles **/"
          name={name}
          value={cleanCode}
          className={styles.code}
          onChange={handleChange}
          autoFocus={autoFocus}
        />
      )}
      {expanded && children}
    </div>
  )
}
