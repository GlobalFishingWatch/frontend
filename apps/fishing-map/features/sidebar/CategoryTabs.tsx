import { Fragment, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import dynamic from 'next/dynamic'
import Link from 'redux-first-router-link'

import type { IconType } from '@globalfishingwatch/ui-components'
import { Icon, IconButton, Tooltip } from '@globalfishingwatch/ui-components'

import { DEFAULT_WORKSPACE_LIST_VIEWPORT } from 'data/config'
import type { WorkspaceCategory } from 'data/workspaces'
import { DEFAULT_WORKSPACE_CATEGORY, DEFAULT_WORKSPACE_ID } from 'data/workspaces'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectWorkspaceCategory } from 'features/app/selectors/app.workspace.selectors'
import HelpHub from 'features/help/HelpHub'
// import HelpModal from 'features/help/HelpModal'
import LanguageToggle from 'features/i18n/LanguageToggle'
import { useClickedEventConnect } from 'features/map/map-interactions.hooks'
import { useSetMapCoordinates } from 'features/map/map-viewport.hooks'
import { selectFeedbackModalOpen, setModalOpen } from 'features/modals/modals.slice'
import WhatsNew from 'features/sidebar/WhatsNew'
import { selectUserData } from 'features/user/selectors/user.selectors'
import UserButton from 'features/user/UserButton'
import { selectIsDefaultWorkspace, selectWorkspace } from 'features/workspace/workspace.selectors'
import { selectAvailableWorkspacesCategories } from 'features/workspaces-list/workspaces-list.selectors'
import { HOME, SEARCH, USER, WORKSPACE_SEARCH, WORKSPACES_LIST } from 'routes/routes'
import {
  selectIsAnySearchLocation,
  selectIsWorkspaceLocation,
  selectLocationType,
} from 'routes/routes.selectors'

import styles from './CategoryTabs.module.css'

const FeedbackModal = dynamic(
  () => import(/* webpackChunkName: "FeedbackModal" */ 'features/feedback/FeedbackModal')
)

type CategoryTabsProps = {
  onMenuClick: () => void
}

function getLinkToCategory(category: WorkspaceCategory) {
  return {
    type: WORKSPACES_LIST,
    payload: { workspaceId: undefined, category: category || DEFAULT_WORKSPACE_CATEGORY },
    replaceQuery: true,
  }
}

function CategoryTabs({ onMenuClick }: CategoryTabsProps) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { dispatchClickedEvent } = useClickedEventConnect()
  const locationType = useSelector(selectLocationType)
  const setMapCoordinates = useSetMapCoordinates()
  const workspace = useSelector(selectWorkspace)
  const isWorkspaceLocation = useSelector(selectIsWorkspaceLocation)
  const locationCategory = useSelector(selectWorkspaceCategory)
  const isAnySearchLocation = useSelector(selectIsAnySearchLocation)
  const isDefaultWorkspace = useSelector(selectIsDefaultWorkspace)
  const availableCategories = useSelector(selectAvailableWorkspacesCategories)
  const userData = useSelector(selectUserData)

  const modalFeedbackOpen = useSelector(selectFeedbackModalOpen)

  const onFeedbackClick = useCallback(() => {
    if (userData) {
      dispatch(setModalOpen({ id: 'feedback', open: true }))
    }
  }, [dispatch, userData])

  const onCategoryClick = useCallback(
    (category: WorkspaceCategory) => {
      setMapCoordinates(DEFAULT_WORKSPACE_LIST_VIEWPORT)
      dispatchClickedEvent(null)
      trackEvent({
        category: TrackCategory.General,
        action: `clicked on ${category}`,
      })
    },
    [setMapCoordinates, dispatchClickedEvent]
  )

  const onSearchClick = useCallback(() => {
    trackEvent({
      category: TrackCategory.SearchVessel,
      action: 'Click search icon to open search panel',
    })
  }, [])

  return (
    <Fragment>
      <ul className={cx('print-hidden', styles.CategoryTabs)}>
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role */}
        <li role="button" tabIndex={0} className={styles.tab} onClick={onMenuClick}>
          <span className={styles.tabContent}>
            <Icon icon="menu" />
          </span>
        </li>
        <li
          className={cx(styles.tab, {
            [styles.current]: isWorkspaceLocation && isDefaultWorkspace,
          })}
        >
          <Link
            className={styles.tabContent}
            to={{
              type: HOME,
              payload: {},
              query: {},
              replaceQuery: true,
            }}
          >
            <Tooltip content={t('common.seeDefault')} placement="right">
              <span className={styles.tabContent}>
                <Icon icon="home" className={styles.searchIcon} />
              </span>
            </Tooltip>
          </Link>
        </li>
        <li
          className={cx(styles.tab, {
            [styles.current]: isAnySearchLocation,
          })}
        >
          <Link
            className={styles.tabContent}
            to={{
              type: isWorkspaceLocation ? WORKSPACE_SEARCH : SEARCH,
              payload: {
                category: workspace?.category || DEFAULT_WORKSPACE_CATEGORY,
                workspaceId: workspace?.id || DEFAULT_WORKSPACE_ID,
              },
              query: {},
              replaceQuery: !isWorkspaceLocation,
            }}
            onClick={onSearchClick}
          >
            <Tooltip content={t('workspace.categories.search')} placement="right">
              <span className={styles.tabContent}>
                <Icon icon="category-search" className={styles.searchIcon} />
              </span>
            </Tooltip>
          </Link>
        </li>
        {availableCategories?.map((category, index) => {
          return (
            <Tooltip
              key={category}
              content={t(`workspace.categories.${category}`, category)}
              placement="right"
            >
              <li
                className={cx(styles.tab, {
                  [styles.current]:
                    !isAnySearchLocation &&
                    (locationCategory === (category as WorkspaceCategory) ||
                      (index === 0 && !locationCategory)),
                })}
              >
                <Link
                  className={styles.tabContent}
                  to={{
                    ...getLinkToCategory(category as WorkspaceCategory),
                    query: {},
                  }}
                  onClick={() => onCategoryClick(category as WorkspaceCategory)}
                >
                  <Icon icon={`category-${category}` as IconType} />
                </Link>
              </li>
            </Tooltip>
          )
        })}
        <li className={styles.separator} aria-hidden></li>
        <li className={cx(styles.tab, styles.secondary)}>
          <WhatsNew />
        </li>
        <li className={cx(styles.tab, styles.secondary)}>
          <HelpHub />
        </li>
        <li className={cx(styles.tab, styles.secondary)}>
          <div className={cx(styles.linksToggle)}>
            <div className={styles.linksBtn}>
              <IconButton icon="feedback" />
            </div>
            <ul className={styles.links}>
              <li>
                <span
                  role="button"
                  tabIndex={0}
                  className={cx(styles.link)}
                  onClick={onFeedbackClick}
                >
                  {t('feedback.logAnIssue')}
                </span>
              </li>
              <li>
                <a
                  href={'https://feedback.globalfishingwatch.org/'}
                  target="_blank"
                  rel="noreferrer"
                  className={cx(styles.link)}
                >
                  {t('feedback.requestAnImprovement')}
                </a>
              </li>
            </ul>
          </div>
        </li>
        <li className={styles.tab}>
          <LanguageToggle />
        </li>
        <li
          className={cx(styles.tab, {
            [styles.current]: locationType === USER,
          })}
        >
          <UserButton className={styles.userButton} testId="sidebar-login-icon" />
        </li>
      </ul>
      {modalFeedbackOpen && (
        <FeedbackModal
          isOpen={modalFeedbackOpen}
          onClose={() => dispatch(setModalOpen({ id: 'feedback', open: false }))}
        />
      )}
    </Fragment>
  )
}

export default CategoryTabs
