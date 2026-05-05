import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useAtomValue } from 'jotai'
import { extent } from 'simple-statistics'

import { GFWAPI } from '@globalfishingwatch/api-client'
import type { DataviewInstance } from '@globalfishingwatch/api-types'
import { DataviewCategory } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { ResolverGlobalConfig, TimeRange } from '@globalfishingwatch/deck-layer-composer'
import {
  deckLayerInstancesAtom,
  useDeckLayerComposer,
  useMapHoverInteraction,
} from '@globalfishingwatch/deck-layer-composer'
import type {
  DeckLayerPickingObject,
  FourwingsLayer,
  VesselLayer,
} from '@globalfishingwatch/deck-layers'
import { generateVesselGraphSteps, HEATMAP_ID } from '@globalfishingwatch/deck-layers'
import type {
  FourwingsFeatureProperties,
  VesselTrackGraphExtent,
} from '@globalfishingwatch/deck-loaders'
import { getVesselGraphExtentClamped } from '@globalfishingwatch/deck-loaders'
import { useMemoCompare } from '@globalfishingwatch/react-hooks'

import { DEFAULT_BASEMAP_DATAVIEW_INSTANCE } from 'data/workspaces'
import {
  selectActivityVisualizationMode,
  selectBivariateDataviews,
  selectDetectionsVisualizationMode,
  selectEnvironmentVisualizationMode,
  selectSkipColorDomainSampling,
  selectVesselGroupsVisualizationMode,
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
  selectIsAnyReportLocation,
  selectIsIndexLocation,
  selectIsUserLocation,
  selectIsWorkspaceLocation,
  selectVesselsMaxTimeGapHours,
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
  const vesselGroupsVisualizationMode = useSelector(selectVesselGroupsVisualizationMode)
  const visibleEvents = useSelector(selectWorkspaceVisibleEventsArray)
  const vesselsTimebarGraph = useSelector(selectTimebarGraph)
  const clickedFeatures = useSelector(selectClickedEvent)
  const trackGraphExtent = useTimebarTracksGraphExtent()
  // const hoverFeatures = useMapHoverInteraction()?.features
  const debugOptions = useSelector(selectDebugOptions)
  const vesselsMaxTimeGapHours = useSelector(selectVesselsMaxTimeGapHours)
  const isAnyReportLocation = useSelector(selectIsAnyReportLocation)
  const skipColorDomainSampling = useSelector(selectSkipColorDomainSampling)

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
    return [...(clickedFeatures?.features || [])]
  }, [clickedFeatures?.features])

  // This was the way we managed highlighted features in "@deck.gl/core": "9.1.15"
  // but after upgrading to 9.3 the performance was terrible so had to create the
  // useSyncMapHoverHighlightedFeatures workaround
  // const highlightedFeatures = useMemo(() => {
  //   return [...(clickedFeatures?.features || []), ...(hoverFeatures || [])]
  // }, [clickedFeatures?.features, hoverFeatures])

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
            t((t) => t.toasts.maxPointsVisualizationExceeded),
            {
              toastId: 'maxPointsVisualizationExceeded',
            }
          )
        }
      }
    },
    [dispatchQueryParams, isWorkspace, t]
  )

  return useMemo(() => {
    let globalConfig: ResolverGlobalConfig = {
      activityVisualizationMode,
      bivariateDataviews,
      debugTiles: debugOptions?.debugTiles,
      detectionsVisualizationMode,
      end,
      environmentVisualizationMode,
      highlightedFeatures,
      highlightedTime,
      highlightEventIds,
      onPositionsMaxPointsError,
      skipColorDomainSampling,
      start,
      token: GFWAPI.token,
      trackGraphExtent,
      vesselGroupsVisualizationMode,
      vesselsColorBy: vesselsTimebarGraph === 'none' ? 'track' : vesselsTimebarGraph,
      vectorsTemporalAggregation: isAnyReportLocation ? false : true,
      vesselTrackVisualizationMode: debugOptions.vesselsAsPositions ? 'positions' : 'track',
      ...(debugOptions.vesselsAsPositions &&
        debugOptions.vesselsMaxTimeGapHours && { vesselsMaxTimeGapHours }),
      visibleEvents,
      zoom: viewState.zoom,
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
    debugOptions,
    bivariateDataviews,
    isAnyReportLocation,
    activityVisualizationMode,
    detectionsVisualizationMode,
    environmentVisualizationMode,
    highlightEventIds,
    highlightedTime,
    visibleEvents,
    vesselsTimebarGraph,
    vesselsMaxTimeGapHours,
    vesselGroupsVisualizationMode,
    highlightedFeatures,
    trackGraphExtent,
    onPositionsMaxPointsError,
    skipColorDomainSampling,
    showTimeComparison,
    timeComparisonValues,
  ])
}

export const useMapDataviewsLayers = () => {
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const workspaceDataviews = useSelector(selectDataviewInstancesResolvedVisible)
  const bufferDataviews = useSelector(selectMapReportBufferDataviews)
  const workspacesListDataview = useSelector(selectWorkspacesListDataview)
  const isIndexLocation = useSelector(selectIsIndexLocation)
  const isUserLocation = useSelector(selectIsUserLocation)
  const showWorkspaceDetail = useSelector(selectShowWorkspaceDetail)
  const workspaceLoading =
    showWorkspaceDetail &&
    (workspaceStatus === AsyncReducerStatus.Idle || workspaceStatus === AsyncReducerStatus.Loading)
  const globalConfig = useGlobalConfigConnect()

  const dataviews = useMemo(() => {
    if (isIndexLocation || isUserLocation) {
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
    isIndexLocation,
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

type HighlightableLayer = {
  id: string
  state?: unknown
  setHighlightedFeatures?: (features: DeckLayerPickingObject[]) => void
}
const EMPTY_HOVER_FEATURES: DeckLayerPickingObject[] = []

function getHoverFeaturesHash(features: DeckLayerPickingObject[] = []) {
  return features
    .map((feature) => {
      const propertyId =
        'properties' in feature
          ? (feature.properties as FourwingsFeatureProperties)?.cellId || ''
          : ''
      return `${feature.category}-${feature.layerId}-${feature.id}-${propertyId}`
    })
    .join('|')
}

function getLayerHoverFeatures(layer: HighlightableLayer, features: DeckLayerPickingObject[] = []) {
  return features.filter((feature) => {
    return layer.id.includes(feature.layerId) || feature.layerId.includes(layer.id)
  })
}

export const useSyncMapHoverHighlightedFeatures = () => {
  const layers = useAtomValue(deckLayerInstancesAtom) as HighlightableLayer[]
  const hoverFeatures = useMemoCompare(
    useMapHoverInteraction()?.features ?? EMPTY_HOVER_FEATURES,
    (previousFeatures, nextFeatures) => {
      return getHoverFeaturesHash(previousFeatures) === getHoverFeaturesHash(nextFeatures)
    }
  )
  const hoverFeaturesHash = getHoverFeaturesHash(hoverFeatures)
  const layerHighlightsHashRef = useRef<Record<string, string>>({})

  useEffect(() => {
    layers.forEach((layer) => {
      if (typeof layer.setHighlightedFeatures !== 'function' || !layer.state) {
        return
      }
      const layerHoverFeatures = getLayerHoverFeatures(layer, hoverFeatures)
      const layerHoverFeaturesHash = getHoverFeaturesHash(layerHoverFeatures)
      if (layerHighlightsHashRef.current[layer.id] === layerHoverFeaturesHash) {
        return
      }
      layerHighlightsHashRef.current[layer.id] = layerHoverFeaturesHash
      layer.setHighlightedFeatures(layerHoverFeatures)
    })
  }, [hoverFeatures, hoverFeaturesHash, layers])
}

const useMapOverlayLayers = () => {
  const drawLayerInstance = useDrawLayerInstance()
  const rulerLayerInstance = useMapRulerInstance()
  return useMemo(() => {
    return [drawLayerInstance!, rulerLayerInstance!].filter(Boolean)
  }, [drawLayerInstance, rulerLayerInstance])
}

export const useMapLayers = () => {
  // Read from the atom directly — layer composition runs in LayersComposer (a sibling of DeckGLWrapper)
  // so hover changes do not recompose the expensive data/tile layers.
  const dataviewsLayers = useAtomValue(deckLayerInstancesAtom)
  const overlays = useMapOverlayLayers()
  return useMemo(() => [...dataviewsLayers, ...overlays], [dataviewsLayers, overlays])
}
