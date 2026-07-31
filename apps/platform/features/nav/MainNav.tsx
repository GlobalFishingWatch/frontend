import type { ComponentProps, ComponentType, MouseEvent, ReactNode } from 'react'
import { Fragment, useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link, useMatchRoute } from '@tanstack/react-router'
import cx from 'classnames'

import { Icon } from '@globalfishingwatch/ui-components/icon'
import { IconButton } from '@globalfishingwatch/ui-components/icon-button'
import { Spinner } from '@globalfishingwatch/ui-components/spinner'
import { Tooltip } from '@globalfishingwatch/ui-components/tooltip'

import { DEFAULT_WORKSPACE_LIST_VIEWPORT } from 'data/map/config'
import type { WorkspaceCategory } from 'data/map/workspaces'
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
import { AVAILABLE_WORKSPACES_CATEGORIES } from 'features/_map/workspaces-list/workspaces-list.config'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { workspaceTabClicked } from 'features/nav/nav.actions'
import type { NavItem } from 'features/nav/nav.config'
import { getNavSections, isRouted, PLATFORM_MODE } from 'features/nav/nav.config'
import type { NavLinkContext } from 'features/nav/nav.links'
import { getNavLinkProps, isNavItemCurrentLocation } from 'features/nav/nav.links'
import NavBottom from 'features/nav/NavBottom'
import { useIsClientHydrated } from 'hooks/ssr.hooks'
import {
  selectIsAnySearchLocation,
  selectIsUserLocation,
  selectIsWorkspaceLocation,
  selectIsWorkspacesListLocation,
  selectIsWorkspaceVesselLocation,
} from 'router/routes.selectors'

import styles from './MainNav.module.css'

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

  const navLinkContext: NavLinkContext = {
    workspace,
    lastVisitedWorkspace,
    isWorkspaceLocation,
    isWorkspaceVesselLocation,
    onWorkspaceClick,
    onSearchClick,
    onCategoryClick,
  }

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
            {item.loading ? <Spinner size="small" inline /> : <Icon icon={item.icon} />}
          </span>
        )}
        <span className={styles.tabLabel}>{label}</span>
      </Fragment>
    )

    if (item.href) {
      return (
        <a
          className={styles.tabContent}
          href={item.href}
          target="_blank"
          rel="noreferrer"
          data-testid={item.testId}
        >
          {content}
        </a>
      )
    }

    if (item.onClick) {
      return (
        <span
          role="button"
          tabIndex={0}
          className={styles.tabContent}
          onClick={item.onClick}
          data-testid={item.testId}
        >
          {content}
        </span>
      )
    }

    if (item.subsections && !isRouted(item)) {
      return (
        <span
          role="button"
          tabIndex={0}
          className={styles.tabContent}
          onClick={() => setOpenSectionId(expandedSectionId === item.id ? '' : item.id)}
        >
          {content}
        </span>
      )
    }

    if (!isRouted(item) || isNavItemCurrentLocation(item, navLinkContext)) {
      return (
        <span className={cx(styles.tabContent, styles.disabled)} aria-disabled>
          {content}
        </span>
      )
    }

    const { to, params, search, replace, onClick } = getNavLinkProps(item, navLinkContext)
    return (
      <NavLink
        className={styles.tabContent}
        to={to}
        params={params}
        search={search}
        replace={replace}
        onClick={onClick}
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
      : isNavItemCurrentLocation(item, navLinkContext)
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

  const renderSection = (section: NavItem) => {
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
                <li key={subsection.id}>{renderRow(subsection, { isSubsection: true })}</li>
              ))}
            </ul>
          </div>
        )}
      </li>
    )
  }

  return (
    <Fragment>
      <nav
        className={cx('print-hidden', styles.MainNav, {
          [styles.platform]: PLATFORM_MODE,
          [styles.railCollapsed]: railCollapsed,
        })}
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
            {navSections.map(renderSection)}
          </ul>
          <NavBottom renderSection={renderSection} />
        </div>
      </nav>
    </Fragment>
  )
}

export default MainNav
