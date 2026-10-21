import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

import { useLocalStorage } from '@globalfishingwatch/react-hooks'
import { DEFAULT_WORKSPACE_ID } from '@platform/config/map/workspaces'

import {
  selectReadOnly,
  selectScreenshotMode,
} from 'features/_map/workspace/selectors/app.selectors'
import { useAppDispatch } from 'features/app/app.hooks'
import { setModalOpen } from 'features/modals/modals.slice'
import { useIsClientHydrated } from 'hooks/ssr.hooks'
import { useAppSearch } from 'router/routes.hook'
import { selectIsWorkspaceLocation, selectWorkspaceId } from 'router/routes.selectors'

/**
 * Kept apart from `onboarding.hooks` because `Modals.tsx` is loaded on every route: importing the
 * card actions there would pull not needed code into the layout chunk and defeat the lazy `OnboardingModal`.
 */
export const ONBOARDING_DISMISSED_KEY = 'OnboardingPanelDismissed'

export function useOnboardingDismissed() {
  return useLocalStorage<boolean>(ONBOARDING_DISMISSED_KEY, false)
}

export const UPDATE_VIDEO_SEEN_KEY = 'UpdateVideoSeen'

export function useUpdateVideoSeen() {
  return useLocalStorage<boolean>(UPDATE_VIDEO_SEEN_KEY, false)
}

const RETURNING_USER_KEYS = [
  ONBOARDING_DISMISSED_KEY,
  'HighlightPopup',
  'hints',
  'VesselProfilePopup',
]

function getIsReturningUser() {
  try {
    return RETURNING_USER_KEYS.some((key) => window.localStorage.getItem(key) !== null)
  } catch {
    return false
  }
}

export function useOnboardingAutoOpen() {
  const dispatch = useAppDispatch()
  const [dismissed] = useOnboardingDismissed()
  const [videoSeen, setVideoSeen] = useUpdateVideoSeen()
  const isClientHydrated = useIsClientHydrated()
  const isWorkspaceLocation = useSelector(selectIsWorkspaceLocation)
  const readOnly = useSelector(selectReadOnly)
  const screenshotMode = useSelector(selectScreenshotMode)
  const workspaceId = useSelector(selectWorkspaceId)
  const isDefaultWorkspace = !workspaceId || workspaceId === DEFAULT_WORKSPACE_ID
  const { sidePanels, dataviewInstances, dataviewInstancesOrder } = useAppSearch()
  const hasDataviewInstances = Boolean(dataviewInstances?.length || dataviewInstancesOrder?.length)
  const hasSidePanels = Boolean(sidePanels?.length)
  const autoOpened = useRef(false)

  useEffect(() => {
    if (
      autoOpened.current ||
      !isClientHydrated ||
      readOnly ||
      screenshotMode ||
      !isWorkspaceLocation ||
      !isDefaultWorkspace ||
      hasDataviewInstances ||
      hasSidePanels
    ) {
      return
    }
    autoOpened.current = true
    if (!videoSeen && getIsReturningUser()) {
      dispatch(setModalOpen({ id: 'updateVideo', open: true }))
      return
    }
    // New users never get the update video popup on its own, not even on a later visit once they have
    // the keys above. They can still open it from the onboarding modal.
    if (!videoSeen) setVideoSeen(true)
    if (!dismissed) dispatch(setModalOpen({ id: 'onboarding', open: true }))
  }, [
    dispatch,
    isClientHydrated,
    dismissed,
    videoSeen,
    setVideoSeen,
    readOnly,
    screenshotMode,
    isWorkspaceLocation,
    isDefaultWorkspace,
    hasDataviewInstances,
    hasSidePanels,
  ])
}
