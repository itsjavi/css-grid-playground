import appLogo from '/logo-sm.png'
import styles from './App.module.scss'
import GithubStarsButton from './components/GithubStarsButton'
import { cn } from './utils'

function App() {
  return (
    <div className={cn(styles.app)}>
      <a href="https://react.dev" target="_blank" rel="noreferrer">
        <img src={appLogo} className="logo" alt="App logo" width={128} height={128} />
      </a>
      <h1>CSS Grid Playground!</h1>
      <div className="card">
        <GithubStarsButton />
      </div>
    </div>
  )
}

export default App
