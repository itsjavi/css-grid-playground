import githubIcon from '/github.png'

export default function GithubStarsButton({ projectName = 'itsjavi/css-grid-playground' }) {
  return (
    <>
      <a
        className="github-button"
        href={`https://github.com/${projectName}`}
        data-color-scheme="no-preference: dark; light: light; dark: dark;"
        data-size="large"
        aria-label="Star itsjavi/css-grid-playground on GitHub"
        target="_blank"
        rel="noreferrer"
      >
        <img src={githubIcon} alt="Github logo" /> Github
      </a>
    </>
  )
}
