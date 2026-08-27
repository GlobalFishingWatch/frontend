import type { ReactNode } from 'react'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from '@tanstack/react-router'
import cx from 'classnames'

import { ROUTE_PATHS } from '@platform/config/routes'

import { getHelpHubSectionCopy } from 'features/help/helpHub.i18n'
import { findHelpHubSection } from 'features/help/helpHub.utils'
import type { NavLinkProps } from 'features/nav/nav.links'
import { NavLink } from 'features/nav/nav.links'

import styles from './HelpHubBreadcrumb.module.css'

export type BreadcrumbItem = {
  id: string
  label: ReactNode
  link?: NavLinkProps
}

function HelpHubBreadcrumb() {
  const { t } = useTranslation()
  const { sectionSlug } = useParams({ strict: false })
  const section = sectionSlug ? findHelpHubSection(sectionSlug) : undefined

  const items: BreadcrumbItem[] = [
    {
      id: ROUTE_PATHS.HELP_HUB,
      label: t((s) => s.helpHub.title),
      ...(section && { link: { to: ROUTE_PATHS.HELP_HUB } }),
    },
  ]
  if (section) {
    items.push({ id: section.slug, label: getHelpHubSectionCopy(section.id).title })
  }

  return (
    <nav>
      <ul className={cx(styles.breadcrumb)}>
        {items.map(({ id, label: crumbLabel, link }, index) => {
          const isCurrent = index === items.length - 1
          return (
            <Fragment key={id}>
              {index > 0 && (
                <li className={styles.separator} aria-hidden="true">
                  ›
                </li>
              )}
              <li
                className={cx(styles.crumb, { [styles.crumbCurrent]: isCurrent })}
                aria-current={isCurrent ? 'page' : undefined}
              >
                {link ? (
                  <NavLink {...link} className={styles.crumbLink}>
                    {crumbLabel}
                  </NavLink>
                ) : (
                  crumbLabel
                )}
              </li>
            </Fragment>
          )
        })}
      </ul>
    </nav>
  )
}

export default HelpHubBreadcrumb
