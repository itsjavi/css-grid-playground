import { cn } from '@/utils'
import { ComponentPropsWithoutRef } from 'react'
import githubIcon from '/github.png'
import appLogo from '/logo.png'
import styles from './AppHeader.module.scss'

type AppHeaderProps = {
  children?: never
} & ComponentPropsWithoutRef<'header'>

export default function AppHeader({ className, ...props }: AppHeaderProps) {
  return (
    <header className={cn(styles.header, className)} {...props}>
      <a className={styles.title} href={import.meta.env.BASE_URL}>
        <img src={appLogo} alt="" />
        <h1>CSS Grid Playground</h1>
      </a>
      <div className={styles.links}>
        <a
          className="github-button"
          href="https://github.com/itsjavi/css-grid-playground"
          target="_blank"
          rel="noreferrer"
          aria-label="Visit GitHub repository"
          title="GitHub"
        >
          <img src={githubIcon} alt="" />
        </a>
      </div>
    </header>
  )
}
