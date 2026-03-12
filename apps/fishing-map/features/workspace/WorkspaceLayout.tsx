import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from '@tanstack/react-router'

import type { Workspace } from '@globalfishingwatch/api-types'

import { DEFAULT_WORKSPACE_ID } from 'data/workspaces'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectIsUserLogged } from 'features/user/selectors/user.selectors'
import { useFitWorkspaceBounds } from 'features/workspace/workspace.hook'
import {
  isWorkspacePasswordProtected,
  selectCurrentWorkspaceId,
  selectWorkspaceCustomStatus,
  selectWorkspaceReportId,
} from 'features/workspace/workspace.selectors'
import { fetchWorkspaceThunk } from 'features/workspace/workspace.slice'
import {
  HOME,
  PORT_REPORT,
  REPORT,
  VESSEL_GROUP_REPORT,
  WORKSPACE,
  WORKSPACE_REPORT,
} from 'router/routes'
import { useReplaceQueryParams } from 'router/routes.hook'
import {
  selectIsAnyVesselLocation,
  selectIsVesselGroupReportLocation,
  selectLocationType,
  selectReportId,
  selectWorkspaceId,
} from 'router/routes.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'

/**
 * Workspace layout route component.
 * Handles workspace data fetching for all /$category/$workspaceId/* routes
 * and renders <Outlet /> so the matched child route component appears in the sidebar.
 */
function WorkspaceLayout() {
  const dispatch = useAppDispatch()
  const userLogged = useSelector(selectIsUserLogged)
  const locationType = useSelector(selectLocationType)
  const currentWorkspaceId = useSelector(selectCurrentWorkspaceId)
  const currentReportId = useSelector(selectWorkspaceReportId)
  const reportId = useSelector(selectReportId)
  const workspaceCustomStatus = useSelector(selectWorkspaceCustomStatus)
  const urlWorkspaceId = useSelector(selectWorkspaceId)
  const isAnyVesselLocation = useSelector(selectIsAnyVesselLocation)
  const isVesselGroupReportLocation = useSelector(selectIsVesselGroupReportLocation)
  const { replaceQueryParams } = useReplaceQueryParams()
  const fitWorkspaceBounds = useFitWorkspaceBounds()

  const isHomeLocation = locationType === HOME
  const homeNeedsFetch = isHomeLocation && currentWorkspaceId !== DEFAULT_WORKSPACE_ID
  const locationNeedsFetch =
    locationType === REPORT ||
    locationType === VESSEL_GROUP_REPORT ||
    locationType === PORT_REPORT ||
    ((locationType === WORKSPACE_REPORT || isAnyVesselLocation) &&
      currentWorkspaceId !== urlWorkspaceId)
  const hasWorkspaceIdChanged = locationType === WORKSPACE && currentWorkspaceId !== urlWorkspaceId
  const hasWorkspaceReportIdChanged = locationType === REPORT && currentReportId !== reportId

  useEffect(() => {
    let action: any
    let actionResolved = false
    const fetchWorkspace = async () => {
      action = dispatch(fetchWorkspaceThunk({ workspaceId: urlWorkspaceId as string, reportId }))
      const resolvedAction = await action
      if (fetchWorkspaceThunk.fulfilled.match(resolvedAction)) {
        const { dataviewInstancesToUpsert, ...workspace } = resolvedAction.payload
        if (dataviewInstancesToUpsert) {
          replaceQueryParams({ dataviewInstances: dataviewInstancesToUpsert })
        }
        if (!isVesselGroupReportLocation && !isWorkspacePasswordProtected(workspace as Workspace)) {
          fitWorkspaceBounds(workspace as Workspace)
        }
      }
      actionResolved = true
    }
    if (
      userLogged &&
      workspaceCustomStatus !== AsyncReducerStatus.Loading &&
      (homeNeedsFetch || locationNeedsFetch || hasWorkspaceIdChanged || hasWorkspaceReportIdChanged)
    ) {
      fetchWorkspace()
    }
    return () => {
      if (action && action.abort !== undefined && !actionResolved) {
        action.abort()
      }
    }
  }, [
    userLogged,
    homeNeedsFetch,
    locationNeedsFetch,
    hasWorkspaceIdChanged,
    hasWorkspaceReportIdChanged,
  ])

  return <Outlet />
}

export default WorkspaceLayout
