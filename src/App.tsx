import Playground from './components/Playground'
import AppFooter from './components/layout/AppFooter'
import AppHeader from './components/layout/AppHeader'
import AppMainText from './components/layout/AppMainText'

function App() {
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
