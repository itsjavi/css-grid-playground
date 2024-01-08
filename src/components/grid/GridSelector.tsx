import { cn } from '@/utils'
import { ComponentPropsWithoutRef } from 'react'
import styles from './GridController.module.scss'

type GridSelectorProps = {
  value: number
  elementCount: number
  label?: string
  labelTemplate?: string
  onChange?: (elementIndex: number) => void
} & Omit<ComponentPropsWithoutRef<'div'>, 'onChange' | 'value'>

export default function GridSelector({
  className,
  elementCount,
  value,
  label,
  labelTemplate,
  onChange,
  ...props
}: GridSelectorProps) {
  return (
    <div className={cn(styles.controller, className)} {...props}>
      <select
        value={value.toString()}
        onChange={(e) => {
          onChange?.(Number(e.target.value))
        }}
      >
        <option value={'-1'}>Base Styles</option>
        {elementCount > 0 && (
          <optgroup label={label ?? 'Elements'}>
            {Array.from({ length: elementCount }).map((_, index) => {
              return (
                <option key={`el-${index}`} value={index}>
                  {labelTemplate?.replace('%', (index + 1).toString()) ?? `Element ${index + 1}`}
                </option>
              )
            })}
          </optgroup>
        )}
      </select>
    </div>
  )
}
