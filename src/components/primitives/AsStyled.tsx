import { ComponentPropsWithoutRef, useEffect, useRef } from 'react'

type AsStyledProps<T extends React.ElementType> = {
  as?: T
  children?: React.ReactNode
  css?: string
} & ComponentPropsWithoutRef<T>

/**
 * A polymorphic component that allows inline raw CSS to be applied to the element.
 */
const AsStyled = <T extends React.ElementType>({ as, css, children, ...rest }: AsStyledProps<T>) => {
  const As: React.ElementType = as || 'div'
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (css && ref.current) {
      ref.current.style.cssText = css.trim().replace(/\n/g, '')
    }
  }, [css])

  return (
    <As ref={ref} {...rest}>
      {children}
    </As>
  )
}

export default AsStyled
