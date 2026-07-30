import { Fragment, lazy, Suspense, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link } from '@tanstack/react-router'
import cx from 'classnames'

import type { IconType } from '@globalfishingwatch/ui-components'
import { Icon, IconButton, Tooltip } from '@globalfishingwatch/ui-components'

import { DEFAULT_WORKSPACE_LIST_VIEWPORT } from 'data/map/config'
import type { WorkspaceCategory } from 'data/map/workspaces'
import { DEFAULT_WORKSPACE_CATEGORY, DEFAULT_WORKSPACE_ID } from 'data/map/workspaces'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import HelpHub from 'features/hints/HelpHub'
// import HelpModal from 'features/help/HelpModal'
import LanguageToggle from 'features/i18n/LanguageToggle'
import { setClickedEvent } from 'features/map/map/map.slice'
import { useCancelInteractionPromises } from 'features/map/map/map-interactions.atoms'
import { useSetMapCoordinates } from 'features/map/map/map-view-state.hooks'
import { resetSidebarScroll } from 'features/map/sidebar/sidebar.utils'
import { selectWorkspaceCategory } from 'features/map/workspace/selectors/app.workspace.selectors'
import { selectLastVisitedWorkspace, selectWorkspace } from 'features/map/workspace/workspace.selectors'
import {
  cleanCurrentWorkspaceReportState,
  resetWorkspaceHistoryNavigation,
} from 'features/map/workspace/workspace.slice'
import { cleanReportPayload, cleanReportQuery } from 'features/map/workspace/workspace.utils'
import { AVAILABLE_WORKSPACES_CATEGORIES } from 'features/map/workspaces-list/workspaces-list.config'
import { selectFeedbackModalOpen, setModalOpen } from 'features/modals/modals.slice'
import { workspaceTabClicked } from 'features/nav/nav.actions'
import WhatsNew from 'features/nav/WhatsNew'
import { selectUserData } from 'features/user/selectors/user.selectors'
import UserButton from 'features/user/UserButton'
import { EMPTY_SEARCH_FILTERS } from 'features/vessels/search/search.config'
import { useIsClientHydrated } from 'hooks/ssr.hooks'
import {
  selectIsAnySearchLocation,
  selectIsUserLocation,
  selectIsWorkspaceLocation,
  selectIsWorkspaceVesselLocation,
} from 'router/routes.selectors'
import { ROUTE_PATHS, toValidRoutePath } from 'router/routes.utils'
import type { QueryParams } from 'types'

import styles from './MainNav.module.css'

const FeedbackModal = lazy(() => import('features/feedback/FeedbackModal'))

type MainNavProps = {
  onMenuClick: () => void
}

function MainNav({ onMenuClick }: MainNavProps) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const cancelPendingInteractionRequests = useCancelInteractionPromises()
  const setMapCoordinates = useSetMapCoordinates()
  const workspace = useSelector(selectWorkspace)
  const isClientHydrated = useIsClientHydrated()
  const lastVisitedWorkspaceState = useSelector(selectLastVisitedWorkspace)
  const lastVisitedWorkspace = isClientHydrated ? lastVisitedWorkspaceState : undefined
  const isWorkspaceLocation = useSelector(selectIsWorkspaceLocation)
  const isWorkspaceVesselLocation = useSelector(selectIsWorkspaceVesselLocation)
  const locationCategory = useSelector(selectWorkspaceCategory)
  const isAnySearchLocation = useSelector(selectIsAnySearchLocation)
  const isUserLocation = useSelector(selectIsUserLocation)
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
      // Inlines what dispatchClickedEvent(null) did, minus the whole interaction pipeline: that hook
      // pulls deck-layer-composer and every overlay hook into this always-rendered component.
      cancelPendingInteractionRequests()
      dispatch(setClickedEvent(null))
      trackEvent({
        category: TrackCategory.General,
        action: `clicked on ${category}`,
      })
    },
    [setMapCoordinates, cancelPendingInteractionRequests, dispatch]
  )

  const onSearchClick = useCallback(() => {
    trackEvent({
      category: TrackCategory.SearchVessel,
      action: 'Click search icon to open search panel',
    })
  }, [])

  const onWorkspaceClick = useCallback(() => {
    resetSidebarScroll()
    // One leaf action; search, report, vesselGroupReport and vessel reset themselves via extraReducers.
    // Importing those four slices here put them all in the always-loaded graph, since MainNav renders on
    // every route. workspace stays direct — it is permanently eager anyway.
    dispatch(workspaceTabClicked())
    dispatch(cleanCurrentWorkspaceReportState())
    dispatch(resetWorkspaceHistoryNavigation())
  }, [dispatch])

  return (
    <Fragment>
      <ul className={cx('print-hidden', styles.MainNav)}>
        <li
          // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
          role="button"
          tabIndex={0}
          className={styles.tab}
          onClick={onMenuClick}
          data-testid="sidebar-menu-toggle"
        >
          <span className={styles.tabContent}>
            <Icon icon="menu" />
          </span>
        </li>
        <li
          data-testid="link-workspace"
          className={cx(styles.tab, { [styles.current]: isWorkspaceLocation })}
        >
          {isWorkspaceLocation ? (
            <Tooltip content={t((t) => t.common.seeMyWorkspace)} placement="right">
              <span className={cx(styles.tabContent, styles.disabled)}>
                <Icon icon="workspace" />
              </span>
            </Tooltip>
          ) : (
            <Link
              to={
                lastVisitedWorkspace
                  ? toValidRoutePath(lastVisitedWorkspace.to, lastVisitedWorkspace.params)
                  : ROUTE_PATHS.WORKSPACE
              }
              params={
                lastVisitedWorkspace
                  ? cleanReportPayload(lastVisitedWorkspace.params || {})
                  : {
                      category: workspace?.category || DEFAULT_WORKSPACE_CATEGORY,
                      workspaceId: workspace?.id || DEFAULT_WORKSPACE_ID,
                    }
              }
              search={
                lastVisitedWorkspace
                  ? {
                      ...cleanReportQuery(lastVisitedWorkspace.search || {}),
                      ...EMPTY_SEARCH_FILTERS,
                      userTab: undefined,
                    }
                  : (prev: QueryParams) => ({
                      ...cleanReportQuery(prev),
                      dataviewInstances: (prev.dataviewInstances || []).filter(
                        (dataviewInstance) => dataviewInstance.origin !== 'report'
                      ),
                      ...EMPTY_SEARCH_FILTERS,
                      userTab: undefined,
                    })
              }
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
          )}
        </li>
        <li
          data-testid="link-search"
          className={cx(styles.tab, {
            [styles.current]: isAnySearchLocation,
          })}
        >
          <Link
            className={styles.tabContent}
            to={
              isWorkspaceLocation || isWorkspaceVesselLocation
                ? ROUTE_PATHS.WORKSPACE_SEARCH
                : ROUTE_PATHS.SEARCH
            }
            params={{
              category: workspace?.category || DEFAULT_WORKSPACE_CATEGORY,
              workspaceId: workspace?.id || DEFAULT_WORKSPACE_ID,
            }}
            search={
              isWorkspaceLocation || isWorkspaceVesselLocation ? (prev: QueryParams) => prev : {}
            }
            replace={!(isWorkspaceLocation || isWorkspaceVesselLocation)}
            onClick={onSearchClick}
          >
            <Tooltip content={t((t) => t.workspace.categories.search)} placement="right">
              <span className={styles.tabContent}>
                <Icon icon="category-search" className={styles.searchIcon} />
              </span>
            </Tooltip>
          </Link>
        </li>
        {AVAILABLE_WORKSPACES_CATEGORIES?.map((category, index) => {
          return (
            <Tooltip
              key={category}
              content={t((t) => t.workspace.categories[category], { defaultValue: category })}
              placement="right"
            >
              <li
                data-testid={`link-category-${category}`}
                className={cx(styles.tab, {
                  [styles.current]:
                    !isAnySearchLocation &&
                    !isWorkspaceLocation &&
                    (locationCategory === (category as WorkspaceCategory) ||
                      (index === 0 && !locationCategory)),
                })}
              >
                <Link
                  className={styles.tabContent}
                  to={ROUTE_PATHS.WORKSPACES_LIST}
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
              <IconButton icon="feedback" testId="feedback-button" />
            </div>
            <ul className={styles.links} data-testid="feedback-menu">
              <li>
                <span
                  role="button"
                  tabIndex={0}
                  className={cx(styles.link)}
                  onClick={onFeedbackClick}
                  data-testid="open-feedback-modal"
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
        <li className={cx(styles.tab, styles.secondary)}>
          <LanguageToggle />
        </li>
        <li className={cx(styles.tab, styles.user, { [styles.current]: isUserLocation })}>
          <UserButton className={styles.tabContent} />
        </li>
      </ul>
      {modalFeedbackOpen && (
        <Suspense fallback={null}>
          <FeedbackModal
            isOpen={modalFeedbackOpen}
            onClose={() => dispatch(setModalOpen({ id: 'feedback', open: false }))}
          />
        </Suspense>
      )}
    </Fragment>
  )
}

export default MainNav
