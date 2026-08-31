import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from '@tanstack/react-router'
import { useSetAtom } from 'jotai'

import { useLocalStorage } from '@globalfishingwatch/react-hooks'
import { DEFAULT_WORKSPACE_CATEGORY, DEFAULT_WORKSPACE_ID } from '@platform/config/map/workspaces'

import { useSidePanel } from 'features/_map/content-panel/contentPanel.hooks'
import { mapSearchOpenRequestAtom } from 'features/_map/map/map.atoms'
import { selectReadOnly } from 'features/_map/workspace/selectors/app.selectors'
import { selectWorkspace } from 'features/_map/workspace/workspace.selectors'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import type { UserGuideSlug } from 'features/cms/loaders/user-guide.types'
import { findSectionForSlug } from 'features/help/userGuide.utils'
import { selectWelcomeModalKey } from 'features/modals/modals.selectors'
import { useIsClientHydrated } from 'hooks/ssr.hooks'
import { useAppSearch } from 'router/routes.hook'
import { selectIsWorkspaceLocation } from 'router/routes.selectors'
import { ROUTE_PATHS } from 'router/routes.utils'
import type { QueryParams } from 'types'

/** Deliberately not the legacy `WelcomePopup` key — that one may already be set from older builds. */
export const WELCOME_PANEL_DISMISSED_KEY = 'OnboardingPanelDismissed'

export function useWelcomePanelDismissed() {
  return useLocalStorage<boolean>(WELCOME_PANEL_DISMISSED_KEY, false)
}

/** Which user guide article a slug points at, in `openSidePanel` shape. */
function getGuideTarget(slug: UserGuideSlug) {
  const match = findSectionForSlug(slug)
  return { id: match?.section, subcontentId: match?.subSection }
}

/**
 * Opens the onboarding panel once per map session, unless the user ticked "don't show again".
 * Called from MapLayout so it does not pull in the lazy panel chunk.
 */
export function useWelcomePanelAutoOpen() {
  const [dismissed] = useWelcomePanelDismissed()
  const isClientHydrated = useIsClientHydrated()
  const isWorkspaceLocation = useSelector(selectIsWorkspaceLocation)
  const readOnly = useSelector(selectReadOnly)
  // Deep sea mining keeps its own Welcome modal, so the two must not stack.
  const welcomeModalKey = useSelector(selectWelcomeModalKey)
  const { sidePanelContent } = useAppSearch()
  const { openSidePanel } = useSidePanel()
  const autoOpened = useRef(false)

  useEffect(() => {
    if (
      autoOpened.current ||
      !isClientHydrated ||
      dismissed ||
      readOnly ||
      !isWorkspaceLocation ||
      welcomeModalKey === 'deep-sea-mining' ||
      sidePanelContent
    ) {
      return
    }
    autoOpened.current = true
    openSidePanel({ type: 'welcome' })
  }, [
    isClientHydrated,
    dismissed,
    readOnly,
    isWorkspaceLocation,
    welcomeModalKey,
    sidePanelContent,
    openSidePanel,
  ])
}

/**
 * What each onboarding card does: perform the action, and show the guide article explaining it in
 * the panel the card was clicked from.
 */
export function useWelcomeCardActions() {
  const router = useRouter()
  const workspace = useSelector(selectWorkspace)
  const { openSidePanel } = useSidePanel()
  const requestMapSearchOpen = useSetAtom(mapSearchOpenRequestAtom)

  const track = useCallback((action: string) => {
    trackEvent({ category: TrackCategory.HelpHints, action: `onboarding panel - ${action}` })
  }, [])

  const onSearchVesselClick = useCallback(() => {
    track('search for a vessel')
    // One navigation, not navigate() + openSidePanel(): the second would read a search object the
    // first has not committed yet.
    const { id, subcontentId } = getGuideTarget('vessel-search')
    router.navigate({
      to: ROUTE_PATHS.WORKSPACE_SEARCH,
      params: {
        category: workspace?.category || DEFAULT_WORKSPACE_CATEGORY,
        workspaceId: workspace?.id || DEFAULT_WORKSPACE_ID,
      },
      search: (prev: QueryParams): QueryParams => ({
        ...prev,
        sidePanelContent: 'userGuide',
        sidePanelId: id,
        sidePanelSubcontentId: subcontentId,
      }),
    })
  }, [router, workspace, track])

  const onAreaReportClick = useCallback(() => {
    track('run a report on an area')
    // ponytail: only sets the request — MapSearch consumes it whenever it mounts. Add a navigate to
    // the map here if the panel ever gets an entry point off a map route.
    requestMapSearchOpen(true)
    openSidePanel({ type: 'userGuide', ...getGuideTarget('analysis-and-dynamic-reports') })
  }, [openSidePanel, requestMapSearchOpen, track])

  const onUserGuideClick = useCallback(() => {
    track('learn how to use the tools')
    openSidePanel({ type: 'userGuide' })
  }, [openSidePanel, track])

  const onAssistantClick = useCallback(() => {
    track('chat with the analysis copilot')
    openSidePanel({ type: 'chat' })
  }, [openSidePanel, track])

  return useMemo(
    () => ({ onSearchVesselClick, onAreaReportClick, onUserGuideClick, onAssistantClick }),
    [onSearchVesselClick, onAreaReportClick, onUserGuideClick, onAssistantClick]
  )
}
