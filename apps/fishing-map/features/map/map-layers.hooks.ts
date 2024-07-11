import { useSelector } from 'react-redux'
import { useMemo } from 'react'
import { DataviewInstance } from '@globalfishingwatch/api-types'
import { useDeckLayerComposer } from '@globalfishingwatch/deck-layer-composer'
import { useGlobalConfigConnect } from 'features/map/map.hooks'
import { selectDataviewInstancesResolvedVisible } from 'features/dataviews/selectors/dataviews.selectors'
import { selectIsWorkspaceIndexLocation, selectIsUserLocation } from 'routes/routes.selectors'
import { DEFAULT_BASEMAP_DATAVIEW_INSTANCE } from 'data/workspaces'
import { selectWorkspaceStatus } from 'features/workspace/workspace.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'
import { useDrawLayerInstance } from './overlays/draw/draw.hooks'
import {
  selectMapReportBufferDataviews,
  selectShowWorkspaceDetail,
  selectWorkspacesListDataview,
} from './map.selectors'
import { useMapRulerInstance } from './overlays/rulers/rulers.hooks'

const useMapDataviewsLayers = () => {
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const workspaceDataviews = useSelector(selectDataviewInstancesResolvedVisible)
  const bufferDataviews = useSelector(selectMapReportBufferDataviews)
  const workspacesListDataview = useSelector(selectWorkspacesListDataview)
  const isWorkspaceIndexLocation = useSelector(selectIsWorkspaceIndexLocation)
  const isUserLocation = useSelector(selectIsUserLocation)
  const showWorkspaceDetail = useSelector(selectShowWorkspaceDetail)
  const workspaceLoading =
    showWorkspaceDetail &&
    (workspaceStatus === AsyncReducerStatus.Idle || workspaceStatus === AsyncReducerStatus.Loading)
  const globalConfig = useGlobalConfigConnect()

  const dataviews = useMemo(() => {
    if (isWorkspaceIndexLocation || isUserLocation) {
      const dataviews = [DEFAULT_BASEMAP_DATAVIEW_INSTANCE]
      if (workspacesListDataview) {
        dataviews.push(workspacesListDataview as DataviewInstance)
      }
      return dataviews
    }
    if (workspaceLoading) {
      return [DEFAULT_BASEMAP_DATAVIEW_INSTANCE]
    }
    return [...(workspaceDataviews || []), ...(bufferDataviews || [])]
  }, [
    bufferDataviews,
    isWorkspaceIndexLocation,
    isUserLocation,
    workspaceDataviews,
    workspaceLoading,
    workspacesListDataview,
  ])

  const layers = useDeckLayerComposer({
    dataviews: dataviews as DataviewInstance[],
    globalConfig,
  })

  return layers
}

const useMapOverlayLayers = () => {
  const drawLayerInstance = useDrawLayerInstance()
  const rulerLayerInstance = useMapRulerInstance()
  return useMemo(() => {
    return [drawLayerInstance!, rulerLayerInstance!].filter(Boolean)
  }, [drawLayerInstance, rulerLayerInstance])
}

export const useMapLayers = () => {
  const dataviewsLayers = useMapDataviewsLayers()
  const overlays = useMapOverlayLayers()
  return useMemo(() => [...dataviewsLayers, ...overlays], [dataviewsLayers, overlays])
}
