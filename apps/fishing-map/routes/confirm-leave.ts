import type { RootState } from 'reducers'

import { t } from 'features/i18n/i18n'
import { selectIsGuestUser } from 'features/user/selectors/user.selectors'

import type { ROUTE_TYPES } from './routes'
import { ROUTES_WITH_WORKSPACES } from './routes'

/**
 * Check if navigation should be confirmed based on workspace save state
 * This replaces the confirmLeave callback from Redux First Router
 */
export function shouldConfirmLeave(
  state: RootState,
  newRouteType: ROUTE_TYPES,
  currentRouteType?: ROUTE_TYPES
): string | null {
  const suggestWorkspaceSave = state.workspace?.suggestSave === true
  const isGuestUser = selectIsGuestUser(state)
  
  if (
    !isGuestUser &&
    !ROUTES_WITH_WORKSPACES.includes(newRouteType) &&
    currentRouteType !== newRouteType &&
    suggestWorkspaceSave
  ) {
    return t('common.confirmLeave')
  }
  
  return null
}

/**
 * Display confirm leave dialog and handle callback
 */
export function displayConfirmLeave(
  message: string | null,
  callback: (shouldProceed: boolean) => void
) {
  if (message) {
    const openSaveWorkspace = !window.confirm(message)
    if (typeof window !== 'undefined') {
      const SAVE_WORKSPACE_BEFORE_LEAVE_KEY = 'SAVE_WORKSPACE_BEFORE_LEAVE'
      sessionStorage.setItem(SAVE_WORKSPACE_BEFORE_LEAVE_KEY, openSaveWorkspace.toString())
      window.dispatchEvent(
        new StorageEvent('session-storage', { key: SAVE_WORKSPACE_BEFORE_LEAVE_KEY })
      )
    }
    callback(!openSaveWorkspace)
  } else {
    callback(true)
  }
}
