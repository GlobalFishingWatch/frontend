import { createFileRoute, Link, redirect } from '@tanstack/react-router'

import { Logo } from '@globalfishingwatch/ui-components/logo'
import { ROUTE_PATHS } from '@platform/config/routes'

import { t } from 'features/i18n/i18n'
import { PLATFORM_MODE } from 'features/nav/nav.config'
import { getDefaultMeta } from 'router/router.meta'

import styles from './index.module.css'

function PlatformLanding() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Logo />
      </header>
      <main className={styles.main}>
        <h1 className={styles.title}>Global Fishing Watch</h1>
        <p className={styles.description}>
          {t((s) => s.workspace.siteDescription.default) ??
            'Advancing ocean governance through increased transparency of human activity at sea.'}
        </p>
        <nav className={styles.nav}>
          <Link className={styles.cta} to={ROUTE_PATHS.MAP}>
            {t((s) => s.common.map)}
          </Link>
          <Link className={styles.link} to={ROUTE_PATHS.SEARCH}>
            {t((s) => s.search.title)}
          </Link>
        </nav>
      </main>
    </div>
  )
}

export const Route = createFileRoute('/_platform/')({
  beforeLoad: ({ location }) => {
    if (!PLATFORM_MODE) {
      throw redirect({ to: ROUTE_PATHS.MAP, search: location.search })
    }
  },
  component: PlatformLanding,
  head: () => {
    const description =
      t((s) => s.workspace.siteDescription.default) ??
      'Advancing ocean governance through increased transparency of human activity at sea.'
    return getDefaultMeta('Global Fishing Watch', description)
  },
})
