import { Fragment, useCallback, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'redux-first-router-link'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { Icon, IconButton, IconType, Tooltip } from '@globalfishingwatch/ui-components'
import { useFeatureState } from '@globalfishingwatch/react-hooks'
import { WorkspaceCategories } from 'data/workspaces'
import { HOME, USER, WORKSPACES_LIST } from 'routes/routes'
import { selectLocationCategory, selectLocationType } from 'routes/routes.selectors'
import { selectUserData, isGuestUser } from 'features/user/user.slice'
import { useClickedEventConnect } from 'features/map/map.hooks'
import useMapInstance from 'features/map/map-context.hooks'
import { selectAvailableWorkspacesCategories } from 'features/workspaces-list/workspaces-list.selectors'
import useViewport from 'features/map/map-viewport.hooks'
// import HelpModal from 'features/help/HelpModal'
import LanguageToggle from 'features/i18n/LanguageToggle'
import LocalStorageLoginLink from 'routes/LoginLink'
import HintsHub from 'features/help/hints/HintsHub'
import styles from './CategoryTabs.module.css'

const FeedbackModal = dynamic(
  () => import(/* webpackChunkName: "FeedbackModal" */ 'features/feedback/FeedbackModal')
)

const DEFAULT_WORKSPACE_LIST_VIEWPORT = {
  latitude: 10,
  longitude: -90,
  zoom: 1,
}

type CategoryTabsProps = {
  onMenuClick: () => void
}

function getLinkToCategory(category: WorkspaceCategories) {
  return {
    type: WORKSPACES_LIST,
    payload: { workspaceId: undefined, category },
    replaceQuery: true,
  }
}

function CategoryTabs({ onMenuClick }: CategoryTabsProps) {
  const { t } = useTranslation()
  const guestUser = useSelector(isGuestUser)
  const { cleanFeatureState } = useFeatureState(useMapInstance())
  const { dispatchClickedEvent } = useClickedEventConnect()
  const locationType = useSelector(selectLocationType)
  const { setMapCoordinates } = useViewport()
  const locationCategory = useSelector(selectLocationCategory)
  const availableCategories = useSelector(selectAvailableWorkspacesCategories)
  const userData = useSelector(selectUserData)
  const initials = userData
    ? `${userData?.firstName?.slice(0, 1)}${userData?.lastName?.slice(0, 1)}`
    : ''

  // const [modalHelpOpen, setModalHelpOpen] = useState(false)
  const [modalFeedbackOpen, setModalFeedbackOpen] = useState(false)

  const onFeedbackClick = useCallback(() => {
    if (userData) {
      setModalFeedbackOpen(true)
    }
  }, [userData])

  const onCategoryClick = useCallback(() => {
    setMapCoordinates(DEFAULT_WORKSPACE_LIST_VIEWPORT)
    dispatchClickedEvent(null)
    cleanFeatureState('highlight')
  }, [setMapCoordinates, cleanFeatureState, dispatchClickedEvent])

  return (
    <Fragment>
      <ul className={cx('print-hidden', styles.CategoryTabs)}>
        <li className={styles.tab} onClick={onMenuClick}>
          <span className={styles.tabContent}>
            <Icon icon="menu" />
          </span>
        </li>
        {availableCategories?.map((category, index) => (
          <li
            key={category.title}
            className={cx(styles.tab, {
              [styles.current]:
                locationCategory === (category.title as WorkspaceCategories) ||
                (index === 0 && locationType === HOME),
            })}
          >
            <Link
              className={styles.tabContent}
              to={getLinkToCategory(category.title as WorkspaceCategories)}
              onClick={onCategoryClick}
              title={category.title}
            >
              <Icon icon={`category-${category.title}` as IconType} />
            </Link>
          </li>
        ))}
        <li className={styles.separator} aria-hidden></li>
        <li className={cx(styles.tab, styles.secondary)}>
          <a
            href="https://globalfishingwatch.org/platform-updates"
            target="_blank"
            rel="noreferrer"
          >
            <IconButton
              icon="sparks"
              tooltip={t('common.whatsNew', "What's new?")}
              tooltipPlacement="right"
            />
          </a>
        </li>
        <li className={cx(styles.tab, styles.secondary)}>
          <HintsHub />
        </li>
        <li className={cx(styles.tab, styles.secondary)}>
          <IconButton
            // className={cx(styles.tabContent, 'print-hidden')}
            icon="feedback"
            onClick={onFeedbackClick}
            tooltip={t('common.feedback', 'Feedback')}
            tooltipPlacement="right"
          />
        </li>
        <li className={styles.tab}>
          <LanguageToggle />
        </li>
        <li
          className={cx(styles.tab, {
            [styles.current]: locationType === USER,
          })}
        >
          {guestUser ? (
            <Tooltip content={t('common.login', 'Log in')}>
              <LocalStorageLoginLink className={styles.loginLink}>
                <Icon icon="user" />
              </LocalStorageLoginLink>
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
      {/* <HelpModal isOpen={modalHelpOpen} onClose={() => setModalHelpOpen(false)} /> */}
      {modalFeedbackOpen && (
        <FeedbackModal isOpen={modalFeedbackOpen} onClose={() => setModalFeedbackOpen(false)} />
      )}
    </Fragment>
  )
}

export default CategoryTabs
