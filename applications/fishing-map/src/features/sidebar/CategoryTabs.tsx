import React, { Fragment, useCallback, useState } from 'react'
import Link from 'redux-first-router-link'
import { event as uaEvent } from 'react-ga'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import Icon, { IconType } from '@globalfishingwatch/ui-components/dist/icon'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import { useFeatureState } from '@globalfishingwatch/react-hooks/dist/use-map-interaction'
import GFWAPI from '@globalfishingwatch/api-client'
import Tooltip from '@globalfishingwatch/ui-components/dist/tooltip'
import { Locale } from 'types'
import { WorkspaceCategories } from 'data/workspaces'
import { HOME, USER, WORKSPACES_LIST } from 'routes/routes'
import { selectLocationCategory, selectLocationType } from 'routes/routes.selectors'
import { selectUserData } from 'features/user/user.slice'
import { isGuestUser } from 'features/user/user.selectors'
import { LocaleLabels } from 'features/i18n/i18n'
import { useClickedEventConnect } from 'features/map/map.hooks'
import useMapInstance from 'features/map/map-context.hooks'
import { selectAvailableWorkspacesCategories } from 'features/workspaces-list/workspaces-list.selectors'
import useViewport from 'features/map/map-viewport.hooks'
// import HelpModal from 'features/help/HelpModal'
import FeedbackModal from 'features/feedback/FeedbackModal'
import LanguageToggle from 'features/i18n/LanguageToggle'
import styles from './CategoryTabs.module.css'

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
  const { t, i18n } = useTranslation()
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

  const toggleLanguage = (lang: Locale) => {
    uaEvent({
      category: 'Internationalization',
      action: `Change language`,
      label: lang,
    })
    i18n.changeLanguage(lang)
  }

  // const [modalHelpOpen, setModalHelpOpen] = useState(false)
  const [modalFeedbackOpen, setModalFeedbackOpen] = useState(false)

  // const onHelpClick = () => {
  //   setModalHelpOpen(true)
  // }
  const onFeedbackClick = () => {
    setModalFeedbackOpen(true)
  }

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
            >
              <Icon icon={`category-${category.title}` as IconType} />
            </Link>
          </li>
        ))}
        <div className={styles.separator}></div>
        {/* <li className={cx(styles.tab, styles.secondary)}>
          <button className={styles.tabContent} onClick={onHelpClick}>
            <Icon icon="help" />
          </button>
        </li> */}
        {userData && (
          <li className={cx(styles.tab, styles.secondary)}>
            <IconButton
              // className={cx(styles.tabContent, 'print-hidden')}
              icon="feedback"
              onClick={onFeedbackClick}
              tooltip={t('common.feedback', 'Feedback')}
              tooltipPlacement="right"
            />
          </li>
        )}
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
              <a href={GFWAPI.getLoginUrl(window.location.toString())} className={styles.loginLink}>
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
      {/* <HelpModal isOpen={modalHelpOpen} onClose={() => setModalHelpOpen(false)} /> */}
      <FeedbackModal isOpen={modalFeedbackOpen} onClose={() => setModalFeedbackOpen(false)} />
    </Fragment>
  )
}

export default CategoryTabs
