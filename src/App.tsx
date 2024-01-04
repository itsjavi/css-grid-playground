import appLogo from '/logo.svg'
import './App.css'
import GithubStarsButton from './components/GithubStarsButton'

function App() {
  return (
    <>
      <div>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={appLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>CSS Grid Playground! 2024</h1>
      <div className="card">
        <GithubStarsButton />
      </div>
    </>
  )
}

export default App
