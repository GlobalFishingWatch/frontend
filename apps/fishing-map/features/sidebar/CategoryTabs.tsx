import { Fragment, lazy, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link } from '@tanstack/react-router'
import cx from 'classnames'

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
import { resetVesselGroupReportData } from 'features/reports/report-vessel-group/vessel-group-report.slice'
import { resetReportData } from 'features/reports/tabs/activity/reports-activity.slice'
import { EMPTY_SEARCH_FILTERS } from 'features/search/search.config'
import { cleanVesselSearchResults } from 'features/search/search.slice'
import { resetSidebarScroll } from 'features/sidebar/sidebar.utils'
import WhatsNew from 'features/sidebar/WhatsNew'
import { selectUserData } from 'features/user/selectors/user.selectors'
import UserButton from 'features/user/UserButton'
import { setVesselEventId } from 'features/vessel/vessel.slice'
import { selectWorkspace } from 'features/workspace/workspace.selectors'
import {
  cleanCurrentWorkspaceReportState,
  resetWorkspaceHistoryNavigation,
} from 'features/workspace/workspace.slice'
import { selectAvailableWorkspacesCategories } from 'features/workspaces-list/workspaces-list.selectors'
import { replaceQueryParams } from 'router/routes.actions'
import {
  selectIsAnySearchLocation,
  selectIsUserLocation,
  selectIsWorkspaceLocation,
} from 'router/routes.selectors'
import { ROUTE_PATHS } from 'router/routes.utils'
import type { QueryParams } from 'types'

import styles from './CategoryTabs.module.css'

const FeedbackModal = lazy(() => import('features/feedback/FeedbackModal'))

type CategoryTabsProps = {
  onMenuClick: () => void
}

function CategoryTabs({ onMenuClick }: CategoryTabsProps) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { dispatchClickedEvent } = useClickedEventConnect()
  const setMapCoordinates = useSetMapCoordinates()
  const workspace = useSelector(selectWorkspace)
  const isWorkspaceLocation = useSelector(selectIsWorkspaceLocation)
  const locationCategory = useSelector(selectWorkspaceCategory)
  const isAnySearchLocation = useSelector(selectIsAnySearchLocation)
  const isUserLocation = useSelector(selectIsUserLocation)
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

  const onWorkspaceClick = useCallback(() => {
    resetSidebarScroll()
    replaceQueryParams({ ...EMPTY_SEARCH_FILTERS, userTab: undefined })
    dispatch(cleanVesselSearchResults())
    dispatch(resetReportData())
    dispatch(resetVesselGroupReportData())
    dispatch(cleanCurrentWorkspaceReportState())
    dispatch(setVesselEventId(null))
    dispatch(resetWorkspaceHistoryNavigation())
  }, [dispatch])

  return (
    <Fragment>
      <ul className={cx('print-hidden', styles.CategoryTabs)}>
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role */}
        <li role="button" tabIndex={0} className={styles.tab} onClick={onMenuClick}>
          <span className={styles.tabContent}>
            <Icon icon="menu" />
          </span>
        </li>
        <li className={cx(styles.tab, { [styles.current]: isWorkspaceLocation })}>
          <Link
            to={ROUTE_PATHS.WORKSPACE}
            params={{
              category: workspace?.category || DEFAULT_WORKSPACE_CATEGORY,
              workspaceId: workspace?.id || DEFAULT_WORKSPACE_ID,
            }}
            search={{}}
            replace
            className={styles.tabContent}
            onClick={onWorkspaceClick}
          >
            <Tooltip content={t((t) => t.common.seeWorkspace)} placement="right">
              <span className={styles.tabContent}>
                <Icon icon="workspace" className={styles.searchIcon} />
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
            to={isWorkspaceLocation ? '/$category/$workspaceId/vessel-search' : '/vessel-search'}
            params={{
              category: workspace?.category || DEFAULT_WORKSPACE_CATEGORY,
              workspaceId: workspace?.id || DEFAULT_WORKSPACE_ID,
            }}
            search={isWorkspaceLocation ? (prev: QueryParams) => prev : {}}
            replace={!isWorkspaceLocation}
            onClick={onSearchClick}
          >
            <Tooltip content={t((t) => t.workspace.categories.search)} placement="right">
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
              content={t((t) => t.workspace.categories[category], { defaultValue: category })}
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
                  to="/$category"
                  params={{ category: category || DEFAULT_WORKSPACE_CATEGORY }}
                  search={{}}
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
                  {t((t) => t.feedback.logAnIssue)}
                </span>
              </li>
              <li>
                <a
                  href={'https://feedback.globalfishingwatch.org/'}
                  target="_blank"
                  rel="noreferrer"
                  className={cx(styles.link)}
                >
                  {t((t) => t.feedback.requestAnImprovement)}
                </a>
              </li>
            </ul>
          </div>
        </li>
        <li className={styles.tab}>
          <LanguageToggle />
        </li>
        <li className={cx(styles.tab, { [styles.current]: isUserLocation })}>
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
