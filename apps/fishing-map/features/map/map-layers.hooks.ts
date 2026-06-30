import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { PolygonLayer } from '@deck.gl/layers'
import { useAtomValue } from 'jotai'

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
import type { DeckLayerPickingObject, FourwingsLayer } from '@globalfishingwatch/deck-layers'
import { HEATMAP_ID } from '@globalfishingwatch/deck-layers'
import type { FourwingsFeatureProperties } from '@globalfishingwatch/deck-loaders'
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
import { useTimebarTracksGraphExtent } from 'features/map/timebar-graph.hooks'
import {
  selectShowTimeComparison,
  selectTimeComparisonValues,
} from 'features/reports/report-area/area-reports.selectors'
import { hotspotGeometryAtom } from 'features/reports/reports-hotspot.hooks'
import { selectReportHotspotSettings } from 'features/reports/tabs/activity/reports-activity.slice'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { selectHighlightedEvents, selectHighlightedTime } from 'features/timebar/timebar.slice'
import {
  selectWorkspaceStatus,
  selectWorkspaceVisibleEventsArray,
} from 'features/workspace/workspace.selectors'
import { useReplaceQueryParams } from 'router/routes.hook'
import {
  selectIsAnyReportLocation,
  selectIsIndexLocation,
  selectIsUserLocation,
  selectIsWorkspaceLocation,
} from 'router/routes.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'

import { useDrawLayerInstance } from './overlays/draw/draw.hooks'
import { useMapRulerInstance } from './overlays/rulers/rulers.hooks'
import { HOTSPOT_COLOR, HOTSPOT_FILL, REPORT_HOTSPOT_ID } from './map.config'
import {
  selectMapReportBufferDataviews,
  selectShowWorkspaceDetail,
  selectWorkspacesListDataview,
} from './map.selectors'
import { selectClickedEvent } from './map.slice'

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

export const useGlobalConfigConnect = () => {
  const { start, end } = useTimerangeConnect()
  const { replaceQueryParams } = useReplaceQueryParams()
  const timebarHighlightedTime = useSelector(selectHighlightedTime)
  const highlightEventIds = useSelector(selectHighlightedEvents)
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
  const trackGraphExtent = useTimebarTracksGraphExtent()
  // const hoverFeatures = useMapHoverInteraction()?.features
  const debugOptions = useSelector(selectDebugOptions)
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
        replaceQueryParams({ [categoryQueryParam]: HEATMAP_ID })
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
    [isWorkspace, replaceQueryParams, t]
  )

  return useMemo(() => {
    let globalConfig: ResolverGlobalConfig = {
      activityVisualizationMode,
      bivariateDataviews,
      debugTiles: debugOptions?.debugTiles,
      detectionsVisualizationMode,
      end,
      environmentVisualizationMode,
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
      visibleEvents,
    }
    if (showTimeComparison && timeComparisonValues) {
      globalConfig = {
        ...globalConfig,
        ...timeComparisonValues,
      }
    }
    return globalConfig
  }, [
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
    vesselGroupsVisualizationMode,
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
          : 'timestamp' in feature
            ? (feature.timestamp as number) || ''
            : ''
      return `${feature.category}-${feature.layerId}-${feature.id}-${propertyId}`
    })
    .join('|')
}

function getLayerHoverFeatures(layer: HighlightableLayer, features: DeckLayerPickingObject[] = []) {
  return features.filter((feature) => {
    if (!feature.layerId) return false
    return layer.id.includes(feature.layerId) || feature.layerId.includes(layer.id)
  })
}

export const useSyncMapHoverHighlightedFeatures = () => {
  const layers = useAtomValue(deckLayerInstancesAtom) as HighlightableLayer[]
  const clickedEvent = useSelector(selectClickedEvent)
  const highlightedFeatures = useMemoCompare(
    [
      ...((clickedEvent?.features ?? []) as DeckLayerPickingObject[]),
      ...(useMapHoverInteraction()?.features ?? EMPTY_HOVER_FEATURES),
    ],
    (previousFeatures, nextFeatures) => {
      return getHoverFeaturesHash(previousFeatures) === getHoverFeaturesHash(nextFeatures)
    }
  )
  const highlightedFeaturesHash = getHoverFeaturesHash(highlightedFeatures)
  const layerHighlightsHashRef = useRef<Record<string, string>>({})

  useEffect(() => {
    layers.forEach((layer) => {
      if (typeof layer.setHighlightedFeatures !== 'function' || !layer.state) {
        return
      }
      const layerFeatures = getLayerHoverFeatures(layer, highlightedFeatures)
      const layerFeaturesHash = getHoverFeaturesHash(layerFeatures)
      if (layerHighlightsHashRef.current[layer.id] === layerFeaturesHash) {
        return
      }
      layerHighlightsHashRef.current[layer.id] = layerFeaturesHash
      layer.setHighlightedFeatures(layerFeatures)
    })
  }, [highlightedFeatures, highlightedFeaturesHash, layers])
}

const useHotspotOverlayLayer = () => {
  const settings = useSelector(selectReportHotspotSettings)
  const geometry = useAtomValue(hotspotGeometryAtom)
  return useMemo(() => {
    if (!settings.enabled || !geometry) return null
    return new PolygonLayer({
      id: REPORT_HOTSPOT_ID,
      data: [geometry],
      getPolygon: (f) => f.geometry.coordinates,
      filled: true,
      getFillColor: HOTSPOT_FILL,
      stroked: true,
      getLineColor: HOTSPOT_COLOR,
      getLineWidth: 3,
      lineWidthUnits: 'pixels',
      pickable: true,
    })
  }, [settings.enabled, geometry])
}

const useMapOverlayLayers = () => {
  const drawLayerInstance = useDrawLayerInstance()
  const rulerLayerInstance = useMapRulerInstance()
  const hotspotLayer = useHotspotOverlayLayer()
  return useMemo(() => {
    return [drawLayerInstance!, rulerLayerInstance!, hotspotLayer!].filter(Boolean)
  }, [drawLayerInstance, rulerLayerInstance, hotspotLayer])
}

export const useMapLayers = () => {
  // Read from the atom directly — layer composition runs in LayersComposer (a sibling of DeckGLWrapper)
  // so hover changes do not recompose the expensive data/tile layers.
  const dataviewsLayers = useAtomValue(deckLayerInstancesAtom)
  const overlays = useMapOverlayLayers()
  return useMemo(() => [...dataviewsLayers, ...overlays], [dataviewsLayers, overlays])
}
