import codeIcon from '@/assets/code-2.svg'
import copyIcon from '@/assets/copy.svg'
import usePlaygroundStore from '@/state/usePlaygroundStore'
import { cn } from '@/utils'
import { useRef } from 'react'
import { generateGridsHtmlCode } from './grid/grid-generators'

export function ShowCodeTrigger() {
  const store = usePlaygroundStore()
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
      <dialog className={cn('dialog', 'code-dialog')} ref={dialogRef}>
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
        <span className="-sm-hidden">Code</span>
      </button>
    </>
  )
}
