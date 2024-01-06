import { cn } from '@/utils'
import { ComponentPropsWithoutRef, ReactNode } from 'react'
import AsStyled from '../AsStyled'
import styles from './GridItem.module.scss'

type GridItemProps = {
  children?: ReactNode
  css?: string
  className: string
} & ComponentPropsWithoutRef<'div'>

export default function GridItem({ className, children, css, ...props }: GridItemProps) {
  return (
    <AsStyled className={cn('grid-item', className)} css={css} {...props}>
      <div className={styles.content}>{children || className}</div>
    </AsStyled>
  )
}
