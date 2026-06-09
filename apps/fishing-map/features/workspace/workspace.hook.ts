import { useCallback, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from '@tanstack/react-router'

import type { Workspace } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import { LAYERS_LIBRARY_ACTIVITY } from 'data/layer-library/layers-activity'
import { LAYERS_LIBRARY_DETECTIONS } from 'data/layer-library/layers-detections'
import { useAppDispatch } from 'features/app/app.hooks'
import { useSidePanel } from 'features/content-panel/contentPanel.hooks'
import { selectDataviewInstancesResolved } from 'features/dataviews/selectors/dataviews.resolvers.selectors'
import { useSetMapCoordinates } from 'features/map/map-viewport.hooks'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { selectIsUserLogged } from 'features/user/selectors/user.selectors'
import { useReplaceQueryParams } from 'router/routes.hook'
import {
  selectIsAnyAreaReportLocation,
  selectIsVesselGroupReportLocation,
  selectUrlDataviewInstances,
  selectUrlTimeRange,
  selectUrlViewport,
} from 'router/routes.selectors'
import type { QueryParams } from 'types'
import { AsyncReducerStatus } from 'utils/async-slice'

import {
  isWorkspacePasswordProtected,
  selectWorkspaceCustomStatus,
  selectWorkspaceDataviewInstances,
  selectWorkspaceFetchParams,
} from './workspace.selectors'
import type { FetchWorkspacesThunkParams } from './workspace.slice'
import { fetchWorkspaceThunk } from './workspace.slice'
import { getNextColor } from './workspace.utils'

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

  const userLogged = useSelector(selectIsUserLogged)
  const fetchParamsKey = workspaceFetchParams ? JSON.stringify(workspaceFetchParams) : null

  useEffect(() => {
    if (
      !userLogged ||
      workspaceCustomStatus === AsyncReducerStatus.Loading ||
      !workspaceFetchParams
    ) {
      return
    }
    const action = fetchWorkspace(workspaceFetchParams)
    return () => {
      action?.abort?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLogged, workspaceCustomStatus, fetchParamsKey])
}

const createDataviewsInstances = (
  newDataviewInstances: Partial<UrlDataviewInstance>[],
  currentDataviewInstances: UrlDataviewInstance[] = []
): UrlDataviewInstance[] => {
  const defaultDataviewInstances = [...LAYERS_LIBRARY_ACTIVITY, ...LAYERS_LIBRARY_DETECTIONS]
  const currentColors = (currentDataviewInstances || defaultDataviewInstances).flatMap(
    (dv) => dv.config?.color || []
  )
  return newDataviewInstances.map((dataview) => {
    if (dataview.config?.colorCyclingType) {
      const nextColor = getNextColor(dataview.config.colorCyclingType, currentColors)
      currentColors.push(nextColor.value)
      const { colorCyclingType, ...config } = dataview.config
      const dataviewWithColor = {
        ...dataview,
        config: {
          ...config,
          color: nextColor.value,
          colorCyclingType: undefined,
        },
      } as UrlDataviewInstance
      if (colorCyclingType === 'fill') {
        dataviewWithColor.config!.colorRamp = nextColor.id
      }
      return dataviewWithColor
    }
    return dataview as UrlDataviewInstance
  })
}

export const mergeDataviewIntancesToUpsert = (
  newDataviewInstance: Partial<UrlDataviewInstance>[] | Partial<UrlDataviewInstance>,
  urlDataviewInstances: UrlDataviewInstance[],
  allDataviewInstances?: UrlDataviewInstance[]
) => {
  const newDataviewInstances = Array.isArray(newDataviewInstance)
    ? newDataviewInstance
    : [newDataviewInstance]
  let dataviewInstances = urlDataviewInstances || []
  newDataviewInstances.forEach((dataviewInstance) => {
    const currentDataviewInstance = urlDataviewInstances?.find(
      (urlDataviewInstance) => urlDataviewInstance.id === dataviewInstance.id
    )
    if (currentDataviewInstance) {
      dataviewInstances = dataviewInstances.map((urlDataviewInstance) => {
        if (urlDataviewInstance.id !== dataviewInstance.id) return urlDataviewInstance
        return {
          ...urlDataviewInstance,
          ...dataviewInstance,
          config: {
            ...urlDataviewInstance.config,
            ...dataviewInstance.config,
          },
        }
      })
    } else {
      dataviewInstances = [
        ...createDataviewsInstances([dataviewInstance], allDataviewInstances),
        ...dataviewInstances,
      ]
    }
  })
  return dataviewInstances
}

export const useDataviewInstancesConnect = () => {
  const urlDataviewInstances = useSelector(selectUrlDataviewInstances)
  const allDataviews = useSelector(selectDataviewInstancesResolved)
  const { replaceQueryParams } = useReplaceQueryParams()
  const removeDataviewInstance = useCallback(
    (id: string | string[]) => {
      const ids = Array.isArray(id) ? id : [id]
      const dataviewInstances = urlDataviewInstances?.filter(
        (urlDataviewInstance) => !ids.includes(urlDataviewInstance.id)
      )
      replaceQueryParams({ dataviewInstances })
    },
    [replaceQueryParams, urlDataviewInstances]
  )

  const upsertDataviewInstance = useCallback(
    (newDataviewInstance: Partial<UrlDataviewInstance>[] | Partial<UrlDataviewInstance>) => {
      const dataviewInstances = mergeDataviewIntancesToUpsert(
        newDataviewInstance,
        urlDataviewInstances,
        allDataviews
      )
      replaceQueryParams({ dataviewInstances })
    },
    [replaceQueryParams, urlDataviewInstances, allDataviews]
  )

  const addNewDataviewInstances = useCallback(
    (dataviewInstances: Partial<UrlDataviewInstance>[]) => {
      replaceQueryParams({
        dataviewInstances: [
          ...createDataviewsInstances(dataviewInstances, allDataviews),
          ...(urlDataviewInstances || []),
        ],
      })
    },
    [replaceQueryParams, allDataviews, urlDataviewInstances]
  )

  const workspaceDataviewInstances = useSelector(selectWorkspaceDataviewInstances)
  const { closeSidePanel } = useSidePanel()
  const router = useRouter()
  const deleteDataviewInstance = useCallback(
    (id: string | string[]) => {
      const ids = Array.isArray(id) ? id : [id]
      const dataviewInstances = (urlDataviewInstances || []).filter(
        (urlDataviewInstance) => !ids.includes(urlDataviewInstance.id)
      )
      const workspaceDataviewInstance = workspaceDataviewInstances?.filter((dataviewInstance) =>
        ids.includes(dataviewInstance.id)
      )
      if (workspaceDataviewInstance?.length) {
        workspaceDataviewInstance.forEach(({ id }) => {
          dataviewInstances.push({ id, deleted: true })
        })
      }
      const { sidePanelId } = router.latestLocation.search as QueryParams
      if (sidePanelId && ids.includes(sidePanelId)) {
        closeSidePanel()
      }

      replaceQueryParams({ dataviewInstances })
    },
    [replaceQueryParams, urlDataviewInstances, workspaceDataviewInstances, router, closeSidePanel]
  )
  return useMemo(
    () => ({
      upsertDataviewInstance,
      removeDataviewInstance,
      deleteDataviewInstance,
      addNewDataviewInstances,
    }),
    [
      addNewDataviewInstances,
      deleteDataviewInstance,
      removeDataviewInstance,
      upsertDataviewInstance,
    ]
  )
}
