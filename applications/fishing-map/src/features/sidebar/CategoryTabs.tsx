import React from 'react'
import Link from 'redux-first-router-link'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import Icon from '@globalfishingwatch/ui-components/dist/icon'
import GFWAPI from '@globalfishingwatch/api-client'
import Tooltip from '@globalfishingwatch/ui-components/dist/tooltip'
import { Locale } from 'types'
import { WorkspaceCategories } from 'data/workspaces'
import { HOME, USER, WORKSPACES_LIST } from 'routes/routes'
import { selectLocationCategory, selectLocationType } from 'routes/routes.selectors'
import { selectUserData } from 'features/user/user.slice'
import { isGuestUser } from 'features/user/user.selectors'
import { LocaleLabels } from 'features/i18n/i18n'
import styles from './CategoryTabs.module.css'

const DEFAULT_WORKSPACE_LIST_VIEWPORT = {
  latitude: 3,
  longitude: -7,
  zoom: 0.1,
}

type CategoryTabsProps = {
  onMenuClick: () => void
}

function getLinkToCategory(category: WorkspaceCategories) {
  return {
    type: WORKSPACES_LIST,
    payload: { workspaceId: undefined, category },
    query: {
      ...DEFAULT_WORKSPACE_LIST_VIEWPORT,
    },
    replaceQuery: true,
  }
}

function CategoryTabs({ onMenuClick }: CategoryTabsProps) {
  const { t, i18n } = useTranslation()
  const guestUser = useSelector(isGuestUser)
  const locationType = useSelector(selectLocationType)
  const locationCategory = useSelector(selectLocationCategory)
  const userData = useSelector(selectUserData)
  const initials = userData
    ? `${userData?.firstName?.slice(0, 1)}${userData?.lastName?.slice(0, 1)}`
    : ''

  const toggleLanguage = (lang: Locale) => {
    i18n.changeLanguage(lang)
  }

  return (
    <ul className={cx('print-hidden', styles.CategoryTabs)}>
      <li className={styles.tab} onClick={onMenuClick}>
        <span className={styles.tabContent}>
          <Icon icon="menu" />
        </span>
      </li>
      <li
        className={cx(styles.tab, {
          [styles.current]:
            locationCategory === WorkspaceCategories.FishingActivity || locationType === HOME,
        })}
      >
        <Link
          className={styles.tabContent}
          to={getLinkToCategory(WorkspaceCategories.FishingActivity)}
        >
          <Icon icon="category-fishing" />
        </Link>
      </li>
      <li
        className={cx(styles.tab, {
          [styles.current]: locationCategory === WorkspaceCategories.MarineReserves,
        })}
      >
        <Link
          className={styles.tabContent}
          to={getLinkToCategory(WorkspaceCategories.MarineReserves)}
        >
          <Icon icon="category-marine-reserves" />
        </Link>
      </li>
      <li
        className={cx(styles.tab, {
          [styles.current]: locationCategory === WorkspaceCategories.CountryPortals,
        })}
      >
        <Link
          className={styles.tabContent}
          to={getLinkToCategory(WorkspaceCategories.CountryPortals)}
        >
          <Icon icon="category-country-portals" />
        </Link>
      </li>
      <div className={styles.separator}></div>
      <li className={cx(styles.tab, styles.languageToggle)}>
        <button className={styles.tabContent}>
          <Icon icon="language" />
        </button>
        <ul className={styles.languages}>
          {LocaleLabels.map(({ id, label }) => (
            <li key={id}>
              <button
                onClick={() => toggleLanguage(id)}
                className={cx(styles.language, {
                  [styles.currentLanguage]: i18n.language === id,
                })}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </li>
      <li
        className={cx(styles.tab, {
          [styles.current]: locationType === USER,
        })}
      >
        {guestUser ? (
          <Tooltip content={t('common.login', 'Log in')}>
            <a href={GFWAPI.getLoginUrl(window.location.toString())}>
              <Icon icon="user" />
            </a>
          </Tooltip>
        ) : (
          <Link
            to={{
              type: USER,
              payload: {},
              query: { ...DEFAULT_WORKSPACE_LIST_VIEWPORT },
              replaceQuery: true,
            }}
          >
            {userData ? initials : <Icon icon="user" className="print-hidden" />}
          </Link>
        )}
      </li>
    </ul>
  )
}

export default CategoryTabs
