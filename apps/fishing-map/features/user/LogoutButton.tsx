import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useRouter } from '@tanstack/react-router'

import { Button } from '@globalfishingwatch/ui-components'

import { useAppDispatch } from 'features/app/app.hooks'
import { resetVesselData } from 'features/vessel/vessel.slice'
import { selectLastWorkspaceNavigationProps } from 'features/workspace/workspace.selectors'
import { fetchWorkspaceThunk } from 'features/workspace/workspace.slice'
import { ROUTES_WITH_WORKSPACES } from 'router/routes'
import { mapRouteIdToType, ROUTE_PATHS } from 'router/routes.utils'

import { fetchUserThunk, logoutUserThunk } from './user.slice'

function LogoutButton() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const lastWorkspaceNavProps = useSelector(selectLastWorkspaceNavigationProps)
  const [logoutLoading, setLogoutLoading] = useState(false)

  const onLogoutClick = useCallback(async () => {
    setLogoutLoading(true)
    await dispatch(logoutUserThunk({ local: false }))

    if (lastWorkspaceNavProps) {
      const { to, params, search } = lastWorkspaceNavProps
      router.navigate({
        to,
        params,
        search,
        replace: true,
      })
    } else {
      router.navigate({ to: ROUTE_PATHS.HOME, search: {}, replace: true })
    }
    dispatch(resetVesselData())
    const needsWorkspaceRefetch = ROUTES_WITH_WORKSPACES.includes(
      lastWorkspaceNavProps ? mapRouteIdToType(lastWorkspaceNavProps.to) : ROUTE_PATHS.HOME
    )
    if (needsWorkspaceRefetch) {
      await dispatch(
        fetchWorkspaceThunk({
          workspaceId: lastWorkspaceNavProps?.params?.workspaceId,
        })
      )
    }

    await dispatch(fetchUserThunk({ guest: true }))
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
