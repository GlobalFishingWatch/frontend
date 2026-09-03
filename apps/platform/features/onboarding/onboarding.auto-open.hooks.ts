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

export function useOnboardingAutoOpen() {
  const dispatch = useAppDispatch()
  const [dismissed] = useOnboardingDismissed()
  const isClientHydrated = useIsClientHydrated()
  const isWorkspaceLocation = useSelector(selectIsWorkspaceLocation)
  const readOnly = useSelector(selectReadOnly)
  const screenshotMode = useSelector(selectScreenshotMode)
  const workspaceId = useSelector(selectWorkspaceId)
  const isDefaultWorkspace = !workspaceId || workspaceId === DEFAULT_WORKSPACE_ID
  const { sidePanelContent, dataviewInstances, dataviewInstancesOrder } = useAppSearch()
  const hasDataviewInstances = Boolean(dataviewInstances?.length || dataviewInstancesOrder?.length)
  const autoOpened = useRef(false)

  useEffect(() => {
    if (
      autoOpened.current ||
      !isClientHydrated ||
      dismissed ||
      readOnly ||
      screenshotMode ||
      !isWorkspaceLocation ||
      !isDefaultWorkspace ||
      hasDataviewInstances ||
      sidePanelContent
    ) {
      return
    }
    autoOpened.current = true
    dispatch(setModalOpen({ id: 'onboarding', open: true }))
  }, [
    dispatch,
    isClientHydrated,
    dismissed,
    readOnly,
    screenshotMode,
    isWorkspaceLocation,
    isDefaultWorkspace,
    hasDataviewInstances,
    sidePanelContent,
  ])
}
