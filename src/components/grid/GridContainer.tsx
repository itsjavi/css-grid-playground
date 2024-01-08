import { usePersistentStore } from '@/state/playgroundStore'
import { GridItemVirtualDom } from '@/state/types'
import { cn, safelyJoinCss } from '@/utils'
import { ComponentPropsWithoutRef } from 'react'
import AsStyled from '../AsStyled'
import styles from './GridContainer.module.scss'
import GridItem from './GridItem'

type GridContainerProps = {
  children?: never
  css?: string
  className: string
  items: GridItemVirtualDom[]
  gridIndex: number
} & ComponentPropsWithoutRef<'div'>

export default function GridContainer({ className, css, gridIndex, items, ...props }: GridContainerProps) {
  const store = usePersistentStore()
  const children = items.map((item, index) => {
    const key = `${className}-item${index}`

    return (
      <GridItem gridIndex={gridIndex} itemIndex={index} key={key} css={item.style} className={item.className}>
        {item.innerText || item.className}
      </GridItem>
    )
  })

  return (
    <AsStyled
      tabIndex={0}
      css={safelyJoinCss(css)}
      className={cn(styles.grid, { [styles.selected]: store.selectedGrid === gridIndex }, className)}
      {...props}
    >
      {children}
    </AsStyled>
  )
}
