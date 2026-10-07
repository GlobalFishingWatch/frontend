import { useCallback, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { uniq } from 'es-toolkit'

import type { Workspace } from '@globalfishingwatch/api-types'

import {
  fetchDatasetsByIdsThunk,
  selectIds as selectDatasetIds,
} from 'features/_map/datasets/datasets.slice'
import { getDatasetsInDataviews } from 'features/_map/datasets/datasets.utils'
import {
  fetchDataviewsByIdsThunk,
  selectAllDataviews,
} from 'features/_map/dataviews/dataviews.slice'
import { useSetMapCoordinates } from 'features/_map/map/map-view-state.hooks'
import { useTimerangeConnect } from 'features/_map/timebar/timerange.hooks'
import { selectIsGuestUser, selectUserLogged } from 'features/_user/selectors/user.selectors'
import { useAppDispatch } from 'features/app/app.hooks'
import { useReplaceQueryParams } from 'router/routes.hook'
import {
  selectIsAnyAreaReportLocation,
  selectIsVesselGroupReportLocation,
  selectUrlDataviewInstances,
  selectUrlTimeRange,
  selectUrlViewport,
} from 'router/routes.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'

import {
  isWorkspacePasswordProtected,
  selectWorkspaceCustomStatus,
  selectWorkspaceFetchParams,
  selectWorkspaceStatus,
} from './workspace.selectors'
import type { FetchWorkspacesThunkParams } from './workspace.slice'
import { fetchWorkspaceThunk } from './workspace.slice'

/**
 * Split out of workspace.hook so `useEnsureWorkspaceLoad` stays cheap to import.
 *
 * useAppShell calls it on every route, map or not, which puts this module in every page's entry
 * chunk. The rest of workspace.hook reaches the dataview resolver cluster and the layer library, so
 * it has to stay on the other side of this boundary.
 */
export const useFitWorkspaceBounds = () => {
  const urlViewport = useSelector(selectUrlViewport)
  const isAreaReportLocation = useSelector(selectIsAnyAreaReportLocation)
  const urlTimeRange = useSelector(selectUrlTimeRange)
  const { setTimerange } = useTimerangeConnect()
  const setMapCoordinates = useSetMapCoordinates()

  const fitWorkspaceBounds = useCallback(
    async (workspace: Workspace) => {
      const viewport = urlViewport || workspace?.viewport
      if (viewport && !isAreaReportLocation) {
        setMapCoordinates(viewport)
      }
    },
    [isAreaReportLocation, setMapCoordinates, urlViewport]
  )
  const fitWorkspaceTimerange = useCallback(
    async (workspace: Workspace) => {
      if (!urlTimeRange && workspace?.startAt && workspace?.endAt) {
        setTimerange({
          start: workspace?.startAt,
          end: workspace?.endAt,
        })
      }
    },
    [setTimerange, urlTimeRange]
  )

  return useMemo(
    () => ({ fitWorkspaceBounds, fitWorkspaceTimerange }),
    [fitWorkspaceBounds, fitWorkspaceTimerange]
  )
}

export const useFetchWorkspace = () => {
  const dispatch = useAppDispatch()
  const { fitWorkspaceBounds, fitWorkspaceTimerange } = useFitWorkspaceBounds()
  const { replaceQueryParams } = useReplaceQueryParams()
  const isVesselGroupReportLocation = useSelector(selectIsVesselGroupReportLocation)

  const fetchWorkspace = useCallback(
    (params: FetchWorkspacesThunkParams) => {
      const action = dispatch(fetchWorkspaceThunk(params))
      action.then((resolvedAction) => {
        if (!fetchWorkspaceThunk.fulfilled.match(resolvedAction)) return
        const { dataviewInstancesToUpsert, ...workspace } = resolvedAction.payload
        if (dataviewInstancesToUpsert) {
          replaceQueryParams({ dataviewInstances: dataviewInstancesToUpsert })
        }
        if (!isVesselGroupReportLocation && !isWorkspacePasswordProtected(workspace as Workspace)) {
          fitWorkspaceBounds(workspace as Workspace)
        }
        fitWorkspaceTimerange(workspace as Workspace)
      })
      return action
    },
    [
      dispatch,
      fitWorkspaceBounds,
      fitWorkspaceTimerange,
      isVesselGroupReportLocation,
      replaceQueryParams,
    ]
  )

  return fetchWorkspace
}

export const useEnsureWorkspaceLoad = () => {
  const workspaceFetchParams = useSelector(selectWorkspaceFetchParams)
  const workspaceCustomStatus = useSelector(selectWorkspaceCustomStatus)
  const fetchWorkspace = useFetchWorkspace()

  const userLogged = useSelector(selectUserLogged)
  const fetchParamsKey = workspaceFetchParams ? JSON.stringify(workspaceFetchParams) : null

  const shouldFetchWorkspace =
    userLogged && workspaceCustomStatus !== AsyncReducerStatus.Loading && !!workspaceFetchParams

  useEffect(() => {
    if (shouldFetchWorkspace) {
      fetchWorkspace(workspaceFetchParams)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldFetchWorkspace, fetchParamsKey])
}

export const useEnsureUrlDataviewsLoad = () => {
  const dispatch = useAppDispatch()
  const workspaceLoaded = useSelector(selectWorkspaceStatus) === AsyncReducerStatus.Finished
  const urlDataviewInstances = useSelector(selectUrlDataviewInstances)
  const dataviews = useSelector(selectAllDataviews)
  const datasetIds = useSelector(selectDatasetIds) as string[]
  const guestUser = useSelector(selectIsGuestUser)

  const urlDataviewIds = uniq(
    (urlDataviewInstances || []).flatMap(({ dataviewId }) => (dataviewId ? String(dataviewId) : []))
  )
  const urlDataviews = dataviews.filter(
    (dataview) =>
      urlDataviewIds.includes(dataview.slug) || urlDataviewIds.includes(String(dataview.id))
  )
  const missingDataviewIds = urlDataviewIds
    .filter(
      (id) => !urlDataviews.some((dataview) => dataview.slug === id || String(dataview.id) === id)
    )
    .join(',')
  const missingDatasetIds = getDatasetsInDataviews(urlDataviews, urlDataviewInstances, guestUser)
    .filter((id) => !datasetIds.includes(id))
    .join(',')

  useEffect(() => {
    if (workspaceLoaded && missingDataviewIds) {
      dispatch(fetchDataviewsByIdsThunk(missingDataviewIds.split(',')))
    }
  }, [dispatch, workspaceLoaded, missingDataviewIds])

  useEffect(() => {
    if (workspaceLoaded && missingDatasetIds) {
      dispatch(
        fetchDatasetsByIdsThunk({ ids: missingDatasetIds.split(','), includeRelated: false })
      )
    }
  }, [dispatch, workspaceLoaded, missingDatasetIds])
}
