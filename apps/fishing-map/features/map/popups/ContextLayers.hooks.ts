import { useCallback, useMemo } from 'react'
import { batch, useSelector } from 'react-redux'
import { DEFAULT_CONTEXT_SOURCE_LAYER } from '@globalfishingwatch/layer-composer'
import { useFeatureState } from '@globalfishingwatch/react-hooks'
import { getEventLabel } from 'utils/analytics'
import { TIMEBAR_HEIGHT } from 'features/timebar/timebar.config'
import { FOOTER_HEIGHT } from 'features/footer/Footer'
import { FIT_BOUNDS_REPORT_PADDING } from 'data/config'
import { parsePropertiesBbox } from 'features/map/map.utils'
import { AreaKeyId, fetchAreaDetailThunk } from 'features/areas/areas.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import {
  setDownloadActivityAreaDataview,
  setDownloadActivityAreaKey,
} from 'features/download/downloadActivity.slice'
import useMapInstance from 'features/map/map-context.hooks'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import { selectReportAreaSource } from 'features/app/app.selectors'
import { selectLocationAreaId } from 'routes/routes.selectors'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectContextAreasDataviews } from 'features/dataviews/dataviews.selectors'
import { setClickedEvent } from '../map.slice'
import { TooltipEventFeature } from '../map.hooks'
import { useMapFitBounds } from '../map-bounds.hooks'

export const getFeatureBounds = (feature: TooltipEventFeature) => {
  return feature.properties.bbox ? parsePropertiesBbox(feature.properties.bbox) : null
}

export const getFeatureAreaId = (feature: TooltipEventFeature) => {
  return feature.properties.gfw_id || feature.properties[feature.promoteId as string]
}

export const useHighlightArea = () => {
  const { updateFeatureState, cleanFeatureState } = useFeatureState(useMapInstance())
  return useCallback(
    ({ sourceId, areaId }: { sourceId: string; areaId: string }) => {
      cleanFeatureState('click')
      cleanFeatureState('highlight')
      const featureState = {
        source: sourceId,
        sourceLayer: DEFAULT_CONTEXT_SOURCE_LAYER,
        id: areaId,
      }
      updateFeatureState([featureState], 'highlight')
    },
    [cleanFeatureState, updateFeatureState]
  )
}

const getAreaIdFromFeature = (feature: TooltipEventFeature): AreaKeyId => {
  return feature.properties?.gfw_id || feature.properties?.[feature.promoteId as string]
}

export const useContextInteractions = () => {
  const dispatch = useAppDispatch()
  const highlightArea = useHighlightArea()
  const areaId = useSelector(selectLocationAreaId)
  const sourceId = useSelector(selectReportAreaSource)
  const datasets = useSelector(selectAllDatasets)
  const dataviews = useSelector(selectContextAreasDataviews)
  const { cleanFeatureState } = useFeatureState(useMapInstance())
  const fitMapBounds = useMapFitBounds()

  const onDownloadClick = useCallback(
    (ev: React.MouseEvent<Element, MouseEvent>, feature: TooltipEventFeature) => {
      const areaId = getAreaIdFromFeature(feature)
      if (!areaId) {
        console.warn('No gfw_id available in the feature to analyze', feature)
        return
      }

      const datasetId = feature.datasetId as string
      const dataset = datasets.find((d) => d.id === datasetId)
      if (dataset) {
        const dataview = dataviews.find((dataview) =>
          dataview.datasets?.some((dataset) => dataset.id === datasetId)
        )
        const areaName = feature.value || feature.title
        batch(() => {
          dispatch(setDownloadActivityAreaKey({ datasetId, areaId }))
          dispatch(setDownloadActivityAreaDataview(dataview))
          dispatch(setClickedEvent(null))
        })
        dispatch(fetchAreaDetailThunk({ dataset, areaId, areaName }))
      }

      cleanFeatureState('highlight')
    },
    [datasets, cleanFeatureState, dataviews, dispatch]
  )

  const setReportArea = useCallback(
    (feature: TooltipEventFeature) => {
      const { source: sourceId, title, value } = feature
      const areaId = getFeatureAreaId(feature)
      // Report already does it on page reload but to avoid waiting
      // this moves the map to the same position
      const bounds = getFeatureBounds(feature)
      if (bounds) {
        const boundsParams = {
          padding: FIT_BOUNDS_REPORT_PADDING,
          mapWidth: window.innerWidth / 2,
          mapHeight: window.innerHeight - TIMEBAR_HEIGHT - FOOTER_HEIGHT,
        }
        fitMapBounds(bounds, boundsParams)
      }

      highlightArea({ sourceId, areaId })
      dispatch(setClickedEvent(null))

      trackEvent({
        category: TrackCategory.Analysis,
        action: `Open report`,
        label: getEventLabel([title ?? '', value ?? '']),
      })
    },
    [highlightArea, dispatch, fitMapBounds]
  )

  const onReportClick = useCallback(
    (ev: React.MouseEvent<Element, MouseEvent>, feature: TooltipEventFeature) => {
      const featureAreaId = getAreaIdFromFeature(feature)
      if (!featureAreaId) {
        console.warn('No areaId available in the feature to report', feature)
        return
      }

      if (areaId?.toString() !== featureAreaId || sourceId !== feature.source) {
        setReportArea(feature)
      }
    },
    [areaId, sourceId, setReportArea]
  )

  return useMemo(() => ({ onDownloadClick, onReportClick }), [onDownloadClick, onReportClick])
}
