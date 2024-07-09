import { useSelector } from 'react-redux'
import { useCallback, useMemo } from 'react'
import { debounce } from 'lodash'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { GFWAPI } from '@globalfishingwatch/api-client'
import {
  ResolverGlobalConfig,
  useMapHoverInteraction,
} from '@globalfishingwatch/deck-layer-composer'
import { FourwingsLayer, HEATMAP_ID } from '@globalfishingwatch/deck-layers'
import { DataviewCategory } from '@globalfishingwatch/api-types'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { selectHighlightedTime, setHighlightedEvents } from 'features/timebar/timebar.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import {
  selectShowTimeComparison,
  selectTimeComparisonValues,
} from 'features/reports/reports.selectors'
import {
  selectActivityVisualizationMode,
  selectBivariateDataviews,
  selectDetectionsVisualizationMode,
} from 'features/app/selectors/app.selectors'
import { selectWorkspaceVisibleEventsArray } from 'features/workspace/workspace.selectors'
import { selectDebugOptions } from 'features/debug/debug.slice'
import { useLocationConnect } from 'routes/routes.hook'
import { selectIsWorkspaceLocation } from 'routes/routes.selectors'
import { MAX_TOOLTIP_LIST, ExtendedFeatureVessel, selectClickedEvent } from './map.slice'
import { useViewState } from './map-viewport.hooks'

export const SUBLAYER_INTERACTION_TYPES_WITH_VESSEL_INTERACTION = ['activity', 'detections']

export const getVesselsInfoConfig = (vessels: ExtendedFeatureVessel[]) => {
  if (!vessels?.length) return {}
  return {
    numVessels: vessels.length,
    overflow: vessels.length > MAX_TOOLTIP_LIST,
    overflowNumber: Math.max(vessels.length - MAX_TOOLTIP_LIST, 0),
    overflowLoad: vessels.length > MAX_TOOLTIP_LIST,
    overflowLoadNumber: Math.max(vessels.length - MAX_TOOLTIP_LIST, 0),
  }
}

export const useGlobalConfigConnect = () => {
  const { start, end } = useTimerangeConnect()
  const highlightedTime = useSelector(selectHighlightedTime)
  const viewState = useViewState()
  const { dispatchQueryParams } = useLocationConnect()
  const { t } = useTranslation()
  const isWorkspace = useSelector(selectIsWorkspaceLocation)
  const showTimeComparison = useSelector(selectShowTimeComparison)
  const timeComparisonValues = useSelector(selectTimeComparisonValues)
  const bivariateDataviews = useSelector(selectBivariateDataviews)
  const activityVisualizationMode = useSelector(selectActivityVisualizationMode)
  const detectionsVisualizationMode = useSelector(selectDetectionsVisualizationMode)
  const visibleEvents = useSelector(selectWorkspaceVisibleEventsArray)
  const clickedFeatures = useSelector(selectClickedEvent)
  const hoverFeatures = useMapHoverInteraction()?.features
  const debug = useSelector(selectDebugOptions)?.debug

  const highlightedFeatures = useMemo(() => {
    return [...(clickedFeatures?.features || []), ...(hoverFeatures || [])]
  }, [clickedFeatures?.features, hoverFeatures])

  const onPositionsMaxPointsError = useCallback(
    (layer: FourwingsLayer, max: number) => {
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
      highlightedTime: highlightedTime || {},
      visibleEvents,
      highlightedFeatures,
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
    highlightedTime,
    visibleEvents,
    highlightedFeatures,
    onPositionsMaxPointsError,
    showTimeComparison,
    timeComparisonValues,
  ])
}

export const useDebouncedDispatchHighlightedEvent = () => {
  const dispatch = useAppDispatch()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(
    debounce((eventIds?: string | string[]) => {
      let ids: string[] | undefined
      if (eventIds) {
        ids = Array.isArray(eventIds) ? eventIds : [eventIds]
      }
      dispatch(setHighlightedEvents(ids))
    }, 100),
    []
  )
}
