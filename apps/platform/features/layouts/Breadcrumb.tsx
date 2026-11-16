import type { ReactNode } from 'react'
import { Fragment } from 'react'
import cx from 'classnames'

import type { NavLinkProps } from 'features/nav/nav.links'
import { NavLink } from 'features/nav/nav.links'

import styles from './Breadcrumb.module.css'

export type BreadcrumbItem = {
  id: string
  label: ReactNode
  link?: NavLinkProps
}

type BreadcrumbProps = {
  items: BreadcrumbItem[]
  className?: string
}

function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav className={className}>
      <ul className={styles.breadcrumb}>
        {items.map(({ id, label, link }, index) => {
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
                    {label}
                  </NavLink>
                ) : (
                  label
                )}
              </li>
            </Fragment>
          )
        })}
      </ul>
    </nav>
  )
}

export default Breadcrumb
