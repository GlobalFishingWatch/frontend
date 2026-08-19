import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useMatchRoute } from '@tanstack/react-router'

import type { WorkspaceCategory } from '@platform/config/map/workspaces'

import { DEFAULT_WORKSPACE_LIST_VIEWPORT } from 'data/map/config'
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
import { selectUserData } from 'features/_user/selectors/user.selectors'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { setModalOpen } from 'features/modals/modals.slice'
import { workspaceTabClicked } from 'features/nav/nav.actions'
import type { NavItem } from 'features/nav/nav.config'
import { isRouted } from 'features/nav/nav.config'
import type { NavLinkContext } from 'features/nav/nav.links'
import { useIsClientHydrated } from 'hooks/ssr.hooks'
import {
  selectIsAnySearchLocation,
  selectIsWorkspaceLocation,
  selectIsWorkspaceVesselLocation,
} from 'router/routes.selectors'
import { ROUTE_PATHS } from 'router/routes.utils'

/** Guests have nothing to submit with, so for them the feedback row is inert rather than hidden. */
export function useOpenFeedbackModal() {
  const dispatch = useAppDispatch()
  const userData = useSelector(selectUserData)

  return useCallback(() => {
    if (userData) {
      dispatch(setModalOpen({ id: 'feedback', open: true }))
    }
  }, [dispatch, userData])
}

/** Live state and click side effects the map-related rows need, shared by both navs. */
export function useNavLinkContext(): NavLinkContext {
  const dispatch = useAppDispatch()
  const cancelPendingInteractionRequests = useCancelInteractionPromises()
  const setMapCoordinates = useSetMapCoordinates()
  const workspace = useSelector(selectWorkspace)
  const isClientHydrated = useIsClientHydrated()
  const lastVisitedWorkspaceState = useSelector(selectLastVisitedWorkspace)
  const lastVisitedWorkspace = isClientHydrated ? lastVisitedWorkspaceState : undefined
  const isWorkspaceLocation = useSelector(selectIsWorkspaceLocation)
  const isWorkspaceVesselLocation = useSelector(selectIsWorkspaceVesselLocation)

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
    // Importing those four slices here put them all in the always-loaded graph, since the nav renders on
    // every route. workspace stays direct — it is permanently eager anyway.
    dispatch(workspaceTabClicked())
    dispatch(cleanCurrentWorkspaceReportState())
    dispatch(resetWorkspaceHistoryNavigation())
  }, [dispatch])

  return useMemo(
    () => ({
      workspace,
      lastVisitedWorkspace,
      isWorkspaceLocation,
      isWorkspaceVesselLocation,
      onWorkspaceClick,
      onSearchClick,
      onCategoryClick,
    }),
    [
      workspace,
      lastVisitedWorkspace,
      isWorkspaceLocation,
      isWorkspaceVesselLocation,
      onWorkspaceClick,
      onSearchClick,
      onCategoryClick,
    ]
  )
}

/** Whether a row points at where the user currently is, so it can render as the active tab. */
export function useIsNavItemActive() {
  const matchRoute = useMatchRoute()
  const isWorkspaceLocation = useSelector(selectIsWorkspaceLocation)
  const isAnySearchLocation = useSelector(selectIsAnySearchLocation)
  const locationCategory = useSelector(selectWorkspaceCategory)

  return useCallback(
    (item: NavItem): boolean => {
      switch (item.id) {
        case 'workspace':
          return isWorkspaceLocation
        case 'search':
          return isAnySearchLocation
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
          if (!isRouted(item)) {
            return false
          }
          // Fuzzy so a section stays lit on its children ('/map' on '/map/$category'). Never for the
          // landing route: '/' prefixes every path, so fuzzy would light Home up everywhere.
          const fuzzy = item.to !== ROUTE_PATHS.LANDING
          return !!matchRoute({ to: item.to, fuzzy } as never)
        }
      }
    },
    [matchRoute, isWorkspaceLocation, isAnySearchLocation, locationCategory]
  )
}
