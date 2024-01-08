import AppFooter from './components/AppFooter'
import AppHeader from './components/AppHeader'
import AppMainText from './components/AppMainText'
import Playground from './components/Playground'
import { useUpdateStateOnHistoryChange } from './state/usePlaygroundStore'

function App() {
  useUpdateStateOnHistoryChange()

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
