import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { extent } from 'simple-statistics'

import { GFWAPI } from '@globalfishingwatch/api-client'
import type { DataviewInstance } from '@globalfishingwatch/api-types'
import { DataviewCategory } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { ResolverGlobalConfig, TimeRange } from '@globalfishingwatch/deck-layer-composer'
import {
  useDeckLayerComposer,
  useMapHoverInteraction,
} from '@globalfishingwatch/deck-layer-composer'
import type { FourwingsLayer, VesselLayer } from '@globalfishingwatch/deck-layers'
import { generateVesselGraphSteps, HEATMAP_ID } from '@globalfishingwatch/deck-layers'
import type { VesselTrackGraphExtent } from '@globalfishingwatch/deck-loaders'
import { getVesselGraphExtentClamped } from '@globalfishingwatch/deck-loaders'

import { DEFAULT_BASEMAP_DATAVIEW_INSTANCE } from 'data/workspaces'
import {
  selectActivityVisualizationMode,
  selectBivariateDataviews,
  selectDetectionsVisualizationMode,
  selectEnvironmentVisualizationMode,
} from 'features/app/selectors/app.selectors'
import { selectTimebarGraph } from 'features/app/selectors/app.timebar.selectors'
import {
  selectDataviewInstancesResolvedVisible,
  selectTrackDataviews,
} from 'features/dataviews/selectors/dataviews.instances.selectors'
import {
  selectActivityMergedDataviewId,
  selectDetectionsMergedDataviewId,
} from 'features/dataviews/selectors/dataviews.selectors'
import { selectDebugOptions } from 'features/debug/debug.slice'
import {
  selectShowTimeComparison,
  selectTimeComparisonValues,
} from 'features/reports/report-area/area-reports.selectors'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { selectHighlightedEvents, selectHighlightedTime } from 'features/timebar/timebar.slice'
import { useVesselTracksLayers } from 'features/timebar/timebar-vessel.hooks'
import {
  selectWorkspaceStatus,
  selectWorkspaceVisibleEventsArray,
} from 'features/workspace/workspace.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import {
  selectIsUserLocation,
  selectIsWorkspaceIndexLocation,
  selectIsWorkspaceLocation,
} from 'routes/routes.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'

import { useDrawLayerInstance } from './overlays/draw/draw.hooks'
import { useMapRulerInstance } from './overlays/rulers/rulers.hooks'
import {
  selectMapReportBufferDataviews,
  selectShowWorkspaceDetail,
  selectWorkspacesListDataview,
} from './map.selectors'
import { selectClickedEvent } from './map.slice'
import { useMapViewState } from './map-viewport.hooks'

export const useActivityDataviewId = (dataview: UrlDataviewInstance) => {
  const activityMergedDataviewId = useSelector(selectActivityMergedDataviewId)
  const detectionsMergedDataviewId = useSelector(selectDetectionsMergedDataviewId)
  const dataviewId = useMemo(
    () =>
      dataview.category === DataviewCategory.Environment
        ? dataview.id
        : dataview.category === DataviewCategory.Detections
          ? detectionsMergedDataviewId
          : activityMergedDataviewId,
    [activityMergedDataviewId, dataview.category, dataview.id, detectionsMergedDataviewId]
  )
  return dataviewId
}

// Used to generate the dynamic ramp for speed and elevation
export const useTimebarTracksGraphExtent = () => {
  const vesselsTimebarGraph = useSelector(selectTimebarGraph)
  const vessels = useVesselTracksLayers()
  const areAllVesselsLoaded = vessels.every((vessel) => vessel.loaded)
  const vesselsHash = vessels.map((v) => v.id).join()

  return useMemo(() => {
    if (vesselsTimebarGraph === 'none' || !vessels?.length || !areAllVesselsLoaded) {
      return
    }
    const vesselExtents = vessels.flatMap((v) =>
      (v.instance as VesselLayer).getVesselTrackGraphExtent(vesselsTimebarGraph)
    )
    if (!vesselExtents.length) {
      return
    }

    return getVesselGraphExtentClamped(
      extent(vesselExtents),
      vesselsTimebarGraph
    ) as VesselTrackGraphExtent
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areAllVesselsLoaded, vesselsHash, vesselsTimebarGraph])
}

export const useTimebarTracksGraphSteps = () => {
  const extent = useTimebarTracksGraphExtent()
  const vesselsTimebarGraph = useSelector(selectTimebarGraph)
  return useMemo(() => {
    if (
      !extent?.length ||
      (vesselsTimebarGraph !== 'speed' && vesselsTimebarGraph !== 'elevation')
    ) {
      return []
    }
    return generateVesselGraphSteps(extent, vesselsTimebarGraph)
  }, [extent, vesselsTimebarGraph])
}

export const useGlobalConfigConnect = () => {
  const { start, end } = useTimerangeConnect()
  const timebarHighlightedTime = useSelector(selectHighlightedTime)
  const highlightEventIds = useSelector(selectHighlightedEvents)
  const viewState = useMapViewState()
  const { dispatchQueryParams } = useLocationConnect()
  const { t } = useTranslation()
  const isWorkspace = useSelector(selectIsWorkspaceLocation)
  const showTimeComparison = useSelector(selectShowTimeComparison)
  const timeComparisonValues = useSelector(selectTimeComparisonValues)
  const bivariateDataviews = useSelector(selectBivariateDataviews)
  const trackDataviews = useSelector(selectTrackDataviews)
  const activityVisualizationMode = useSelector(selectActivityVisualizationMode)
  const detectionsVisualizationMode = useSelector(selectDetectionsVisualizationMode)
  const environmentVisualizationMode = useSelector(selectEnvironmentVisualizationMode)
  const visibleEvents = useSelector(selectWorkspaceVisibleEventsArray)
  const vesselsTimebarGraph = useSelector(selectTimebarGraph)
  const clickedFeatures = useSelector(selectClickedEvent)
  const trackGraphExtent = useTimebarTracksGraphExtent()
  const hoverFeatures = useMapHoverInteraction()?.features
  const debug = useSelector(selectDebugOptions)?.debug

  const highlightedTime = useMemo(() => {
    if (
      activityVisualizationMode === 'positions' ||
      detectionsVisualizationMode === 'positions' ||
      trackDataviews?.length
    ) {
      return timebarHighlightedTime as Partial<TimeRange>
    }
  }, [
    activityVisualizationMode,
    detectionsVisualizationMode,
    timebarHighlightedTime,
    trackDataviews?.length,
  ])

  const highlightedFeatures = useMemo(() => {
    return [...(clickedFeatures?.features || []), ...(hoverFeatures || [])]
  }, [clickedFeatures?.features, hoverFeatures])

  const onPositionsMaxPointsError = useCallback(
    (layer: FourwingsLayer) => {
      if (
        layer.props.category === DataviewCategory.Activity ||
        layer.props.category === DataviewCategory.Detections
      ) {
        const categoryQueryParam = `${layer.props.category}VisualizationMode`
        dispatchQueryParams({ [categoryQueryParam]: HEATMAP_ID })
        if (isWorkspace) {
          toast(
            t(
              'toasts.maxPointsVisualizationExceeded',
              'Max points visualization exceeded, swithing to heatmap mode.'
            ),
            { toastId: 'maxPointsVisualizationExceeded' }
          )
        }
      }
    },
    [dispatchQueryParams, isWorkspace, t]
  )

  return useMemo(() => {
    let globalConfig: ResolverGlobalConfig = {
      zoom: viewState.zoom,
      start,
      end,
      debug,
      token: GFWAPI.getToken(),
      bivariateDataviews,
      activityVisualizationMode,
      detectionsVisualizationMode,
      environmentVisualizationMode,
      highlightEventIds,
      highlightedTime,
      visibleEvents,
      vesselsColorBy: vesselsTimebarGraph === 'none' ? 'track' : vesselsTimebarGraph,
      highlightedFeatures,
      trackGraphExtent,
      onPositionsMaxPointsError,
    }
    if (showTimeComparison && timeComparisonValues) {
      globalConfig = {
        ...globalConfig,
        ...timeComparisonValues,
      }
    }
    return globalConfig
  }, [
    viewState.zoom,
    start,
    end,
    debug,
    bivariateDataviews,
    activityVisualizationMode,
    detectionsVisualizationMode,
    environmentVisualizationMode,
    highlightedTime,
    visibleEvents,
    vesselsTimebarGraph,
    highlightedFeatures,
    highlightEventIds,
    onPositionsMaxPointsError,
    showTimeComparison,
    trackGraphExtent,
    timeComparisonValues,
  ])
}

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
