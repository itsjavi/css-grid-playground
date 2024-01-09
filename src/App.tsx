import { useEffect } from 'react'
import Playground from './components/Playground'
import AppFooter from './components/layout/AppFooter'
import AppHeader from './components/layout/AppHeader'
import AppMainText from './components/layout/AppMainText'
import usePlaygroundStore from './state/usePlaygroundStore'

function App() {
  const syncStateFromLocationHash = usePlaygroundStore((state) => state.syncStateFromLocationHash)
  syncStateFromLocationHash()

  useEffect(() => {
    const handleHashChange = () => {
      syncStateFromLocationHash()
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  })

  return (
    <div id="app">
      <div>
        <AppHeader />
        <Playground />
        <AppMainText />
      </div>
      <AppFooter />
    </div>
  )
}

export default App
