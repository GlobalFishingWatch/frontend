import { createFileRoute, Link } from '@tanstack/react-router'

import { Logo } from '@globalfishingwatch/ui-components'
import { ROUTE_PATHS } from '@platform/config/routes'

import { t } from 'features/i18n/i18n'
import { getDefaultMeta } from 'router/router.meta'

import styles from './index.module.css'

/**
 * The platform landing page.
 *
 * Deliberately sits OUTSIDE the `_app` layout, so it mounts no Redux Provider and pulls no map code.
 * That is the whole point of the layout split: a new platform page costs a route file, not a share of
 * deck.gl. Anything added here must stay Redux-free — the moment it needs the store it belongs under
 * `_app` instead.
 *
 * Consequence worth knowing: `useAnalytics()` needs `selectLocationType`, so this page has no in-app
 * analytics. GTM still records the pageview.
 */
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
  component: PlatformLanding,
  head: () => {
    const description =
      t((s) => s.workspace.siteDescription.default) ??
      'Advancing ocean governance through increased transparency of human activity at sea.'
    return getDefaultMeta('Global Fishing Watch', description)
  },
})
