import linkIcon from '@/assets/link.svg'
import { usePlaygroundStateAsUrl } from '@/state/usePlaygroundStore'
import { cn } from '@/utils'
import { useRef } from 'react'

export function ShowShareableUrlrigger() {
  const shareableUrl = usePlaygroundStateAsUrl()
  const dialogRef = useRef<HTMLDialogElement>(null)

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
      <dialog className={cn('dialog')} ref={dialogRef}>
        <form method="dialog">
          <button type="submit">Close</button>
        </form>
        <section className="wrap-text">
          <p>Shareable URL:</p>
          <a href={shareableUrl} target="_blank" rel="noreferrer">
            {shareableUrl}
          </a>
        </section>
      </dialog>
      <button type="button" title="Get Shareable URL" onClick={handleOpenDialog}>
        <img src={linkIcon} alt="Permalink" />
        <span className="sm-hidden">Share</span>
      </button>
    </>
  )
}
