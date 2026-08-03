import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { Icon } from '@globalfishingwatch/ui-components/icon'
import { IconButton } from '@globalfishingwatch/ui-components/icon-button'
import { Tooltip } from '@globalfishingwatch/ui-components/tooltip'
import { DEFAULT_WORKSPACE_CATEGORY, DEFAULT_WORKSPACE_ID } from '@platform/config'
import { ROUTE_PATHS } from '@platform/config/routes'

import UserButton from 'features/_user/UserButton'
import LanguageToggle from 'features/i18n/LanguageToggle'
import HelpHub from 'features/nav/HelpHub'
import type { NavItem } from 'features/nav/nav.config'
import { getCategoryItems, isRouted } from 'features/nav/nav.config'
import { useIsNavItemActive, useNavLinkContext, useOpenFeedbackModal } from 'features/nav/nav.hooks'
import { getNavLinkProps, isNavItemCurrentLocation, NavLink } from 'features/nav/nav.links'
import WhatsNew from 'features/nav/WhatsNew'
import { selectIsUserLocation } from 'router/routes.selectors'

import styles from './LegacyNav.module.css'

type LegacyNavProps = {
  onMenuClick: () => void
}

function LegacyNav({ onMenuClick }: LegacyNavProps) {
  const { t } = useTranslation()
  const navLinkContext = useNavLinkContext()
  const isItemActive = useIsNavItemActive()
  const isUserLocation = useSelector(selectIsUserLocation)
  const openFeedbackModal = useOpenFeedbackModal()

  const navSections = useMemo((): NavItem[] => {
    return [
      {
        id: 'workspace',
        icon: 'workspace',
        label: t((s) => s.common.map),
        to: ROUTE_PATHS.WORKSPACE,
        params: { category: DEFAULT_WORKSPACE_CATEGORY, workspaceId: DEFAULT_WORKSPACE_ID },
      },
      {
        id: 'search',
        icon: 'category-search',
        label: t((s) => s.workspace.categories.search),
        to: ROUTE_PATHS.SEARCH,
      },
      ...getCategoryItems(t),
    ]
  }, [t])

  const renderRow = (item: NavItem) => {
    const isCurrentLocation = isNavItemCurrentLocation(item, navLinkContext)
    const icon = item.icon && (
      <span data-nav-icon>
        <Icon icon={item.icon} />
      </span>
    )
    return (
      <li key={item.id} className={styles.section}>
        <div
          data-testid={`link-${item.id}`}
          className={cx(styles.tab, { [styles.current]: isItemActive(item) })}
        >
          <Tooltip
            content={isCurrentLocation ? t((t) => t.common.seeMyWorkspace) : item.label}
            placement="right"
          >
            {isCurrentLocation || !isRouted(item) ? (
              <span className={cx(styles.tabContent, styles.disabled)} aria-disabled>
                {icon}
              </span>
            ) : (
              <NavLink className={styles.tabContent} {...getNavLinkProps(item, navLinkContext)}>
                {icon}
              </NavLink>
            )}
          </Tooltip>
        </div>
      </li>
    )
  }

  return (
    <nav className={cx('print-hidden', styles.LegacyNav)}>
      <div className={styles.panel}>
        <ul className={styles.sections}>
          <li className={styles.section}>
            <div className={styles.tab}>
              <button
                type="button"
                className={styles.tabContent}
                onClick={onMenuClick}
                data-testid="sidebar-menu-toggle"
              >
                <span data-nav-icon>
                  <Icon icon="menu" />
                </span>
              </button>
            </div>
          </li>
          {navSections.map(renderRow)}
        </ul>
        <ul className={styles.bottom}>
          <li className={cx(styles.tab, styles.secondary)}>
            <WhatsNew />
          </li>
          <li className={cx(styles.tab, styles.secondary)}>
            <HelpHub />
          </li>
          <li className={cx(styles.tab, styles.secondary)}>
            <div className={styles.linksToggle}>
              <IconButton icon="feedback" testId="feedback-button" />
              <ul className={styles.links} data-testid="feedback-menu">
                <li>
                  <button
                    type="button"
                    className={styles.link}
                    onClick={openFeedbackModal}
                    data-testid="open-feedback-modal"
                  >
                    {t((t) => t.feedback.logAnIssue)}
                  </button>
                </li>
                <li>
                  <a
                    href="https://feedback.globalfishingwatch.org/"
                    target="_blank"
                    rel="noreferrer"
                    className={styles.link}
                  >
                    {t((t) => t.feedback.requestAnImprovement)}
                  </a>
                </li>
              </ul>
            </div>
          </li>
          <li className={cx(styles.tab, styles.secondary)}>
            <LanguageToggle />
          </li>
          <li className={cx(styles.tab, styles.user, { [styles.current]: isUserLocation })}>
            <UserButton className={styles.tabContent} />
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default LegacyNav
