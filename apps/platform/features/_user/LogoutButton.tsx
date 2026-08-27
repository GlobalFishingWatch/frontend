import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useRouter } from '@tanstack/react-router'

import { getGuestUser, GFWAPI } from '@globalfishingwatch/api-client'
import { Button } from '@globalfishingwatch/ui-components'
import { DEFAULT_WORKSPACE_ID } from '@platform/config/map/workspaces'

import { selectLastWorkspaceNavigationProps } from 'features/_map/workspace/workspace.selectors'
import { fetchWorkspaceThunk } from 'features/_map/workspace/workspace.slice'
import { resetVesselData } from 'features/_vessels/vessel/vessel.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import { MAP, ROUTES_WITH_WORKSPACES } from 'router/routes'
import { mapRoutePathToType, ROUTE_PATHS } from 'router/routes.utils'

import { openAuthPopup } from './auth-channel'
import { logoutUserThunk, setLoggedUser } from './user.slice'

function LogoutButton() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const lastWorkspaceNavProps = useSelector(selectLastWorkspaceNavigationProps)
  const [logoutLoading, setLogoutLoading] = useState(false)

  const onLogoutClick = useCallback(async () => {
    setLogoutLoading(true)

    openAuthPopup(GFWAPI.getLogoutSessionUrl(), 'gfwSignOut')

    await dispatch(logoutUserThunk({ logoutServer: true, broadcast: true }))

    if (lastWorkspaceNavProps) {
      const { to, params, search } = lastWorkspaceNavProps
      router.navigate({
        to,
        params,
        search,
        replace: true,
      })
    } else {
      router.navigate({ to: ROUTE_PATHS.MAP, search: {}, replace: true })
    }
    dispatch(resetVesselData())
    const needsWorkspaceRefetch = ROUTES_WITH_WORKSPACES.includes(
      // route TYPE, not the path: this list holds route types, so ROUTE_PATHS.MAP ('/map') could
      // never match — it silently made the fallback always false.
      lastWorkspaceNavProps ? mapRoutePathToType(lastWorkspaceNavProps.to) : MAP
    )
    if (needsWorkspaceRefetch) {
      await dispatch(
        fetchWorkspaceThunk({
          workspaceId: lastWorkspaceNavProps?.params?.workspaceId || DEFAULT_WORKSPACE_ID,
        })
      )
    }

    dispatch(setLoggedUser(getGuestUser()))
    setLogoutLoading(false)
  }, [dispatch, lastWorkspaceNavProps, router])

  return (
    <Button
      type="secondary"
      loading={logoutLoading}
      disabled={logoutLoading}
      onClick={onLogoutClick}
      testId="logout-button"
    >
      <span>{t((t) => t.common.logout)}</span>
    </Button>
  )
}

export default LogoutButton
