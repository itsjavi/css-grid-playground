import { cn } from '@/utils'
import { ComponentPropsWithoutRef } from 'react'
import styles from './CodeEditorField.module.scss'

type CodeEditorFieldProps = {
  children?: never
  indent?: number
} & ComponentPropsWithoutRef<'textarea'>

export default function CodeEditorField({ className, indent: baseIndent = 2, ...props }: CodeEditorFieldProps) {
  const handleIndentation = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab' && e.shiftKey) {
      e.preventDefault()
      const { selectionStart, value } = e.currentTarget
      const lines = value.split('\n')
      const currentLineNum = value.substring(0, selectionStart).split('\n').length - 1
      const currentLine = lines[currentLineNum]
      const currentLineInitialSpaces = currentLine.match(/^\s+/)?.[0] || ''
      const spacesToRemove = Math.min(baseIndent, currentLineInitialSpaces.length)
      lines[currentLineNum] = spacesToRemove > 0 ? currentLine.substring(spacesToRemove) : currentLine
      const modifiedValue = lines.join('\n')

      if (modifiedValue === value) {
        return
      }

      e.currentTarget.value = modifiedValue
      e.currentTarget.selectionStart = e.currentTarget.selectionEnd = selectionStart - spacesToRemove
      return
    }

    if (e.key === 'Tab') {
      e.preventDefault()
      const { selectionStart, selectionEnd, value } = e.currentTarget
      const newValue = `${value.substring(0, selectionStart)}  ${value.substring(selectionEnd)}`
      e.currentTarget.value = newValue
      e.currentTarget.selectionStart = e.currentTarget.selectionEnd = selectionStart + baseIndent
      return
    }

    // Add indentation on Enter, depending on the previous line
    if (e.key === 'Enter') {
      e.preventDefault()
      const { selectionStart, selectionEnd, value } = e.currentTarget
      const line = value.substring(0, selectionStart).split('\n').pop()
      if (!line) {
        return
      }
      const indent = line.match(/^\s+/)?.[0] || ''
      const newValue = `${value.substring(0, selectionStart)}\n${indent}${value.substring(selectionEnd)}`
      e.currentTarget.value = newValue
      e.currentTarget.selectionStart = e.currentTarget.selectionEnd = selectionStart + indent.length + 1
      return
    }
  }

  return (
    <div className={cn(styles.editor, className)}>
      <textarea
        className={cn('source-code', styles.input)}
        {...props}
        onKeyDown={handleIndentation}
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        autoSave="off"
        spellCheck="false"
      />
    </div>
  )
}
