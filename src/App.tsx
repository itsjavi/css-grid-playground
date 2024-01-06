import closeIcon from '@/assets/close-2.svg'
import { useState } from 'react'
import AppFooter from './components/AppFooter'
import AppHeader from './components/AppHeader'
import Playground from './components/Playground'

function App() {
  const [showArticle, setShowArticle] = useState(true)
  const handleDismissArticle = () => {
    setShowArticle(false)
  }
  const mainProps: React.HTMLAttributes<HTMLElement> = {}
  if (!showArticle) {
    mainProps.hidden = true
  }
  return (
    <div className="app">
      <div>
        <AppHeader />
        <main {...mainProps}>
          <article data-dismissable>
            <button data-dismiss-trigger title="Close" type="button" onClick={handleDismissArticle}>
              <img src={closeIcon} alt="Close" />
            </button>
            Online playground for CSS Grids where you can add/remove elements, edit CSS properties, see the changes in
            real time, and share the state via URL. It also comes with presets inspired by{' '}
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
        <Playground />
      </div>
      <AppFooter />
    </div>
  )
}

export default App
