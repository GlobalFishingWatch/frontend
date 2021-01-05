import React from 'react'
import Link from 'redux-first-router-link'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import Icon from '@globalfishingwatch/ui-components/dist/icon'
import { WorkspaceCategories } from 'data/workspaces'
import { HOME, USER, WORKSPACES_LIST } from 'routes/routes'
import { selectLocationCategory, selectLocationType } from 'routes/routes.selectors'
import { selectUserData } from 'features/user/user.slice'
import styles from './CategoryTabs.module.css'

type CategoryTabsProps = {
  onMenuClick: () => void
}

function getLinkToCategory(category: WorkspaceCategories) {
  return {
    type: WORKSPACES_LIST,
    payload: { workspaceId: undefined, category },
    query: {},
    replaceQuery: true,
  }
}

function CategoryTabs({ onMenuClick }: CategoryTabsProps) {
  const { t } = useTranslation()
  const locationType = useSelector(selectLocationType)
  const locationCategory = useSelector(selectLocationCategory)
  const userData = useSelector(selectUserData)
  const initials = userData
    ? `${userData?.firstName?.slice(0, 1)}${userData?.lastName?.slice(0, 1)}`
    : ''

  return (
    <ul className={cx('print-hidden', styles.CategoryTabs)}>
      <li className={styles.tab} onClick={onMenuClick}>
        <span>
          <Icon icon="menu" />
        </span>
      </li>
      <li
        className={cx(styles.tab, {
          [styles.current]:
            locationCategory === WorkspaceCategories.FishingActivity || locationType === HOME,
        })}
      >
        <Link to={getLinkToCategory(WorkspaceCategories.FishingActivity)}>
          <Icon icon="category-fishing" />
        </Link>
      </li>
      <li
        className={cx(styles.tab, {
          [styles.current]: locationCategory === WorkspaceCategories.MarineReserves,
        })}
      >
        <Link to={getLinkToCategory(WorkspaceCategories.MarineReserves)}>
          <Icon icon="category-marine-reserves" />
        </Link>
      </li>
      <li
        className={cx(styles.tab, {
          [styles.current]: locationCategory === WorkspaceCategories.CountryPortals,
        })}
      >
        <Link to={getLinkToCategory(WorkspaceCategories.CountryPortals)}>
          <Icon icon="category-country-portals" />
        </Link>
      </li>
      <div className={styles.separator}></div>
      <li
        className={cx(styles.tab, {
          [styles.current]: locationType === USER,
        })}
      >
        <Link to={{ type: USER, payload: {}, query: {}, replaceQuery: true }}>
          {userData ? (
            initials
          ) : (
            <IconButton
              icon="user"
              className="print-hidden"
              tooltip={t('common.login', 'Login')}
              tooltipPlacement="bottom"
            />
          )}
        </Link>
      </li>
    </ul>
  )
}

export default CategoryTabs
