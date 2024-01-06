import collapseIcon from '@/assets/chevrons-down-up.svg'
import expandIcon from '@/assets/chevrons-up-down.svg'
import addIcon from '@/assets/copy-plus.svg'
import resetIcon from '@/assets/history.svg'
import removeIcon from '@/assets/trash-2.svg'
import { PlaygroundState } from '@/state/types'
import { cn, unindentLines } from '@/utils'
import { ComponentPropsWithoutRef, useRef, useState } from 'react'
import CodeEditorField from '../CodeEditorField'
import styles from './GridController.module.scss'

type GridControllerContext = {
  name?: keyof PlaygroundState
  code: string
  elementIndex?: number
}

type PropsWithElementSelector = {
  numElements: number
  elementIndex: number
  elementSelectTemplate?: string
  onElementSelect?: (
    ctx: GridControllerContext & {
      elementIndex: number
    },
  ) => void
}

type PropsWithoutElementSelector = {
  numElements?: never
  elementIndex?: never
  onElementSelect?: never
  elementSelectTemplate?: never
}

export type GridControllerAction = 'add' | 'remove' | 'reset' | 'collapse'

type GridControllerProps = {
  title?: string
  name?: keyof PlaygroundState
  code?: string
  buttons?: Array<GridControllerAction>
  onCodeChange?: (ctx: GridControllerContext) => void
  onAddClick?: (ctx: GridControllerContext) => void
  onRemoveClick?: (ctx: GridControllerContext) => void
  onResetClick?: (ctx: GridControllerContext) => void
} & (PropsWithElementSelector | PropsWithoutElementSelector) &
  ComponentPropsWithoutRef<'div'>

export default function GridController({
  className,
  title,
  name,
  code,
  buttons = ['collapse'],
  numElements,
  elementIndex,
  elementSelectTemplate,
  onCodeChange,
  onElementSelect,
  onAddClick,
  onRemoveClick,
  onResetClick,
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
        elementIndex,
      })
    }
    codeRef.current = e.target.value
  }

  const getContext = () => {
    return {
      name: name,
      code: codeRef.current ?? '',
      elementIndex,
    }
  }

  const showItemSelector = elementIndex !== undefined && numElements !== undefined && numElements > 1

  return (
    <div className={cn(styles.controller, className)} {...props}>
      <div className={styles.toolbar}>
        <div className={styles.titleWithButtons}>
          {buttons.includes('collapse') && (
            <div className={styles.actions}>
              <button
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
          {showItemSelector && (
            <select
              value={elementIndex.toString()}
              onChange={(e) => {
                const index = Number(e.target.value)
                onElementSelect?.({
                  name,
                  code: codeRef.current ?? '',
                  elementIndex: index,
                })
              }}
            >
              {Array.from({ length: numElements }).map((_, index) => (
                <option key={`el-${index}`} value={index}>
                  {elementSelectTemplate?.replace('%', (index + 1).toString()) ?? `Element ${index + 1}`}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className={styles.actions}>
          {buttons.includes('remove') && (
            <button
              type="button"
              title="Remove last element"
              onClick={() => {
                onRemoveClick?.(getContext())
              }}
            >
              <img src={removeIcon} alt="Add" aria-label="Add" />
            </button>
          )}
          {buttons.includes('add') && (
            <button
              type="button"
              title="Duplicate & add last element"
              onClick={() => {
                onAddClick?.(getContext())
              }}
            >
              <img src={addIcon} alt="Add" aria-label="Add" />
            </button>
          )}
          {buttons.includes('reset') && (
            <button
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
      {expanded && <CodeEditorField name={name} value={cleanCode} className={styles.code} onChange={handleChange} />}
    </div>
  )
}
