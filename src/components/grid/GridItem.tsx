import usePlaygroundStore from '@/state/usePlaygroundStore'
import { cn } from '@/utils'
import { ComponentPropsWithoutRef } from 'react'
import AsStyled from '../AsStyled'
import styles from './GridItem.module.scss'

type GridItemProps = {
  children?: string
  css?: string
  className: string
  gridIndex: number
  itemIndex: number
} & ComponentPropsWithoutRef<'div'>

export default function GridItem({ className, children, gridIndex, itemIndex, css, ...props }: GridItemProps) {
  const store = usePlaygroundStore()
  const isSelected = store.selectedGrid === gridIndex && store.selectedGridItem === itemIndex
  const text = String(children || className)

  let timeout: number | undefined
  const handleDebouncedSave = (e: React.FocusEvent<HTMLDivElement>) => {
    if (timeout) {
      clearTimeout(timeout)
    }

    const text = e.currentTarget?.innerText
    if (text === undefined) {
      console.error('GridItem: e.currentTarget?.innerText is undefined')
      return
    }

    timeout = window.setTimeout(() => {
      store.setGridItemText(text, gridIndex, itemIndex)
    }, 500)
  }

  return (
    <AsStyled
      className={cn(styles.item, { [styles.selected]: isSelected }, className)}
      css={css}
      onClick={() => {
        store.selectGrid(gridIndex)
        store.selectGridItem(itemIndex)
      }}
      {...props}
    >
      <div
        // biome-ignore lint/a11y/noNoninteractiveTabindex: it is actually interactive because it is editable
        tabIndex={0}
        className={styles.content}
        contentEditable
        suppressContentEditableWarning={true}
        onBlur={handleDebouncedSave}
      >
        {text}
      </div>
    </AsStyled>
  )
}
