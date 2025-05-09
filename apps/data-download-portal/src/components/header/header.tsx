import { useLocation } from '@tanstack/react-router'

import { Header } from '@globalfishingwatch/ui-components'

import styles from './header.module.css'

export default function HeaderComponent() {
  const location = useLocation()
  const isDatasetsPage = location.pathname.includes('/datasets/')

  return (
    <div className={styles.Header}>
      <Header className={styles.headerLinks} homeRedirectURL={isDatasetsPage ? '/' : undefined} />
      <div className={styles.titleCover}>
        <h1 className={styles.title}>Datasets and Code</h1>
      </div>
    </div>
  )
}
