import { GridItemVirtualDom } from '@/state/types'
import { cn, safelyJoinCss } from '@/utils'
import { ComponentPropsWithoutRef } from 'react'
import AsStyled from '../AsStyled'
import GridItem from './GridItem'

type GridContainerProps = {
  children?: never
  css?: string
  className: string
  items: GridItemVirtualDom[]
} & ComponentPropsWithoutRef<'div'>

export default function GridContainer({ className, css, items, ...props }: GridContainerProps) {
  const children = items.map((item, index) => {
    const key = `${className}-item${index}`

    return (
      <GridItem key={key} css={item.style} className={item.className}>
        {item.innerText || item.className}
      </GridItem>
    )
  })

  return (
    <AsStyled css={safelyJoinCss(css)} className={cn('grid', className)} {...props}>
      {children}
    </AsStyled>
  )
}
