import { useSelector } from 'react-redux'
import { useBlocker } from '@tanstack/react-router'

import { t } from 'features/i18n/i18n'
import { selectIsGuestUser } from 'features/user/selectors/user.selectors'
import { selectSuggestWorkspaceSave } from 'features/workspace/workspace.selectors'

import { ROUTES_WITH_WORKSPACES, SAVE_WORKSPACE_BEFORE_LEAVE_KEY } from './routes'
import { selectLocationType } from './routes.selectors'
import { mapRouteIdToType } from './routes.utils'

/**
 * Replaces the confirmLeave logic from Redux First Router.
 * Uses TanStack Router's useBlocker to prompt the user before
 * leaving workspace routes with unsaved changes.
 */
export function ConfirmLeave() {
  const suggestWorkspaceSave = useSelector(selectSuggestWorkspaceSave)
  const isGuestUser = useSelector(selectIsGuestUser)
  const currentLocationType = useSelector(selectLocationType)

  useBlocker({
    shouldBlockFn: ({ next }) => {
      if (isGuestUser || !suggestWorkspaceSave) {
        return false
      }

      const nextRouteType = mapRouteIdToType(next.routeId)

      // Don't block if navigating within workspace routes
      if (ROUTES_WITH_WORKSPACES.includes(nextRouteType)) {
        return false
      }

      // Don't block if staying on the same route type
      if (currentLocationType === nextRouteType) {
        return false
      }

      const message = t((t) => t.common.confirmLeave)
      const shouldLeave = window.confirm(message)

      if (!shouldLeave) {
        sessionStorage.setItem(SAVE_WORKSPACE_BEFORE_LEAVE_KEY, 'true')
        window.dispatchEvent(
          new StorageEvent('session-storage', { key: SAVE_WORKSPACE_BEFORE_LEAVE_KEY })
        )
      }

      // Return true to BLOCK navigation (user declined)
      return !shouldLeave
    },
    disabled: isGuestUser || !suggestWorkspaceSave,
  })

  return null
}
