import type { ComponentProps, ComponentType, MouseEvent, ReactNode } from 'react'
import { Fragment, lazy, Suspense, useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link, useMatchRoute } from '@tanstack/react-router'
import cx from 'classnames'

import { Icon } from '@globalfishingwatch/ui-components/icon'
import { IconButton } from '@globalfishingwatch/ui-components/icon-button'
import { Tooltip } from '@globalfishingwatch/ui-components/tooltip'

import { DEFAULT_WORKSPACE_LIST_VIEWPORT } from 'data/map/config'
import type { WorkspaceCategory } from 'data/map/workspaces'
import { DEFAULT_WORKSPACE_CATEGORY, DEFAULT_WORKSPACE_ID } from 'data/map/workspaces'
import { setClickedEvent } from 'features/_map/map/map.slice'
import { useCancelInteractionPromises } from 'features/_map/map/map-interactions.atoms'
import { useSetMapCoordinates } from 'features/_map/map/map-view-state.hooks'
import { resetSidebarScroll } from 'features/_map/sidebar/sidebar.utils'
import {
  selectLastVisitedWorkspace,
  selectWorkspace,
  selectWorkspaceCategory,
} from 'features/_map/workspace/workspace.selectors'
import {
  cleanCurrentWorkspaceReportState,
  resetWorkspaceHistoryNavigation,
} from 'features/_map/workspace/workspace.slice'
import { cleanReportPayload, cleanReportQuery } from 'features/_map/workspace/workspace.utils'
import { AVAILABLE_WORKSPACES_CATEGORIES } from 'features/_map/workspaces-list/workspaces-list.config'
import { selectUserData } from 'features/_user/selectors/user.selectors'
import UserButton from 'features/_user/UserButton'
import { EMPTY_SEARCH_FILTERS } from 'features/_vessels/search/search.config'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import HelpHub from 'features/hints/HelpHub'
// import HelpModal from 'features/help/HelpModal'
import LanguageToggle from 'features/i18n/LanguageToggle'
import { selectFeedbackModalOpen, setModalOpen } from 'features/modals/modals.slice'
import { workspaceTabClicked } from 'features/nav/nav.actions'
import type { NavItem } from 'features/nav/nav.config'
import { getNavSections, isRouted, PLATFORM_MODE } from 'features/nav/nav.config'
import WhatsNew from 'features/nav/WhatsNew'
import { useIsClientHydrated } from 'hooks/ssr.hooks'
import {
  selectIsAnySearchLocation,
  selectIsUserLocation,
  selectIsWorkspaceLocation,
  selectIsWorkspacesListLocation,
  selectIsWorkspaceVesselLocation,
} from 'router/routes.selectors'
import { ROUTE_PATHS, toValidRoutePath } from 'router/routes.utils'
import type { QueryParams } from 'types'

import styles from './MainNav.module.css'

const FeedbackModal = lazy(() => import('features/feedback/FeedbackModal'))

const HOVER_INTENT_MS = 300

const NavLink = Link as ComponentType<{
  to: string
  params?: Record<string, string>
  search?: unknown
  replace?: boolean
  className?: string
  onClick?: ComponentProps<'a'>['onClick']
  children?: ReactNode
  'data-testid'?: string
}>

type MainNavProps = {
  onMenuClick: () => void
}

function MainNav({ onMenuClick }: MainNavProps) {
  const { t } = useTranslation()
  const navSections = getNavSections(t)
  const dispatch = useAppDispatch()
  const matchRoute = useMatchRoute()
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
  const isWorkspacesListLocation = useSelector(selectIsWorkspacesListLocation)
  const isUserLocation = useSelector(selectIsUserLocation)
  const userData = useSelector(selectUserData)

  const modalFeedbackOpen = useSelector(selectFeedbackModalOpen)

  const [openSectionId, setOpenSectionId] = useState<string | null>(null)
  const [railCollapsed, setRailCollapsed] = useState(!PLATFORM_MODE)
  const collapseRail = useCallback((event: MouseEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest(`.${styles.sectionToggle}`)) return
    setRailCollapsed(true)
    setOpenSectionId(null)
  }, [])
  const expandRail = useCallback(() => {
    if (PLATFORM_MODE) {
      setRailCollapsed(false)
    }
  }, [])

  const hoverOpenTimeout = useRef<ReturnType<typeof setTimeout>>(undefined)
  const cancelHoverOpen = useCallback(() => clearTimeout(hoverOpenTimeout.current), [])
  const openSectionOnHover = useCallback((id: string) => {
    clearTimeout(hoverOpenTimeout.current)
    hoverOpenTimeout.current = setTimeout(() => setOpenSectionId(id), HOVER_INTENT_MS)
  }, [])

  const onRailLeave = useCallback(() => {
    cancelHoverOpen()
    setOpenSectionId(null)
    expandRail()
  }, [cancelHoverOpen, expandRail])

  const onFeedbackClick = useCallback(() => {
    if (userData) {
      dispatch(setModalOpen({ id: 'feedback', open: true }))
    }
  }, [dispatch, userData])

  const onCategoryClick = useCallback(
    (category: WorkspaceCategory) => {
      setMapCoordinates(DEFAULT_WORKSPACE_LIST_VIEWPORT)
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
    dispatch(workspaceTabClicked())
    dispatch(cleanCurrentWorkspaceReportState())
    dispatch(resetWorkspaceHistoryNavigation())
  }, [dispatch])

  const isItemActive = (item: NavItem): boolean => {
    switch (item.id) {
      case 'workspace':
        return isWorkspaceLocation
      case 'search':
        return isAnySearchLocation
      case 'user':
        return isUserLocation
      default: {
        const category = item.params?.category
        if (item.id.startsWith('category-') && category) {
          return (
            !isAnySearchLocation &&
            !isWorkspaceLocation &&
            (locationCategory === category ||
              (!locationCategory && AVAILABLE_WORKSPACES_CATEGORIES[0] === category))
          )
        }
        return isRouted(item) && !!matchRoute({ to: item.to, fuzzy: true } as never)
      }
    }
  }

  // Only a section whose *subsection* matches the current route opens on its own.
  const activeSectionId = navSections.find((section) =>
    section.subsections?.some((subsection) =>
      subsection.params?.category
        ? isWorkspacesListLocation && locationCategory === subsection.params.category
        : isItemActive(subsection)
    )
  )?.id
  const expandedSectionId = openSectionId ?? activeSectionId

  const renderItemContent = (item: NavItem, label: string) => {
    const content = (
      <Fragment>
        {item.icon && (
          <span className={styles.tabIcon}>
            <Icon icon={item.icon} />
          </span>
        )}
        <span className={styles.tabLabel}>{label}</span>
      </Fragment>
    )

    // Not routed yet or already on the workspace it links to: inert row.
    if (!isRouted(item) || (item.id === 'workspace' && isWorkspaceLocation)) {
      return (
        <span className={cx(styles.tabContent, styles.disabled)} aria-disabled>
          {content}
        </span>
      )
    }

    if (item.id === 'workspace') {
      return (
        <NavLink
          className={styles.tabContent}
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
          onClick={onWorkspaceClick}
        >
          {content}
        </NavLink>
      )
    }

    if (item.id === 'search') {
      const workspaceScoped = isWorkspaceLocation || isWorkspaceVesselLocation
      return (
        <NavLink
          className={styles.tabContent}
          to={workspaceScoped ? ROUTE_PATHS.WORKSPACE_SEARCH : ROUTE_PATHS.SEARCH}
          params={{
            category: workspace?.category || DEFAULT_WORKSPACE_CATEGORY,
            workspaceId: workspace?.id || DEFAULT_WORKSPACE_ID,
          }}
          search={workspaceScoped ? (prev: QueryParams) => prev : {}}
          replace={!workspaceScoped}
          onClick={onSearchClick}
        >
          {content}
        </NavLink>
      )
    }

    const category = item.params?.category
    return (
      <NavLink
        className={styles.tabContent}
        to={item.to as string}
        params={item.params}
        search={{}}
        onClick={category ? () => onCategoryClick(category as WorkspaceCategory) : undefined}
      >
        {content}
      </NavLink>
    )
  }

  const renderRow = (
    item: NavItem,
    { toggle, isSubsection }: { toggle?: ReactNode; isSubsection?: boolean } = {}
  ) => {
    const label = item.label
    const tooltip = PLATFORM_MODE
      ? undefined
      : item.id === 'workspace' && isWorkspaceLocation
        ? t((t) => t.common.seeMyWorkspace)
        : label
    const content = renderItemContent(item, label)
    return (
      <div
        data-testid={`link-${item.id}`}
        className={cx(styles.tab, {
          [styles.subsectionTab]: isSubsection,
          [styles.current]: isItemActive(item),
        })}
      >
        <Tooltip content={tooltip} placement="right">
          {content}
        </Tooltip>
        {toggle}
      </div>
    )
  }

  return (
    <Fragment>
      <nav
        className={cx('print-hidden', styles.MainNav, { [styles.railCollapsed]: railCollapsed })}
        onClickCapture={collapseRail}
        onMouseLeave={onRailLeave}
        onFocus={expandRail}
      >
        <div className={styles.panel}>
          <ul className={styles.sections}>
            {!PLATFORM_MODE && (
              <li className={styles.section}>
                <div
                  role="button"
                  tabIndex={0}
                  className={styles.tab}
                  onClick={onMenuClick}
                  data-testid="sidebar-menu-toggle"
                >
                  <span className={styles.tabContent}>
                    <span className={styles.tabIcon}>
                      <Icon icon="menu" />
                    </span>
                  </span>
                </div>
              </li>
            )}
            {navSections.map((section) => {
              const expanded = expandedSectionId === section.id
              return (
                <li
                  key={section.id}
                  className={styles.section}
                  onMouseEnter={() => openSectionOnHover(section.id)}
                  onMouseLeave={cancelHoverOpen}
                >
                  {renderRow(section, {
                    toggle: section.subsections && (
                      <IconButton
                        className={cx(styles.sectionToggle, {
                          [styles.sectionToggleOpen]: expanded,
                        })}
                        icon={expanded ? 'arrow-top' : 'arrow-down'}
                        size="small"
                        testId={`toggle-${section.id}`}
                        onClick={() => {
                          setOpenSectionId(expanded ? '' : section.id)
                          expandRail()
                        }}
                      />
                    ),
                  })}
                  {section.subsections && (
                    <div
                      className={cx(styles.subsectionsWrapper, {
                        [styles.subsectionsOpen]: expanded,
                      })}
                      inert={!expanded}
                    >
                      <ul className={styles.subsections}>
                        {section.subsections.map((subsection) => (
                          <li key={subsection.id}>
                            {renderRow(subsection, { isSubsection: true })}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
          <ul className={styles.bottom}>
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
        </div>
      </nav>
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
