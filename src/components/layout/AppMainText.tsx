import closeIcon from '@/assets/close-2.svg'
import { useState } from 'react'
import styles from './AppMainText.module.scss'

function AppMainText() {
  const [showArticle, setShowArticle] = useState(true)
  const handleDismissArticle = () => {
    setShowArticle(false)
  }
  const mainProps: React.HTMLAttributes<HTMLElement> = {}
  if (!showArticle) {
    mainProps.hidden = true
  }
  return (
    <main className={styles.info} {...mainProps}>
      <article>
        <button className={styles.dismissTrigger} title="Close" type="button" onClick={handleDismissArticle}>
          <img src={closeIcon} alt="Close" />
        </button>
        Online playground for CSS Grids where you can add/remove elements, edit CSS properties, see the changes in real
        time, and share the state via URL. It also comes with presets inspired by{' '}
        <a href="https://web.dev/learn/css/grid" target="_blank" rel="noreferrer">
          web.dev
        </a>
        's examples, and supports{' '}
        <a href="https://open-props.style/#colors" target="_blank" rel="noreferrer">
          Open Props
        </a>{' '}
        variables.
      </article>
    </main>
  )
}

export default AppMainText
