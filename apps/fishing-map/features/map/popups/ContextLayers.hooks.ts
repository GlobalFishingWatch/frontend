import { useCallback, useMemo } from 'react'
import { batch, useSelector } from 'react-redux'
import { event as uaEvent } from 'react-ga'
import bbox from '@turf/bbox'
import { DEFAULT_CONTEXT_SOURCE_LAYER } from '@globalfishingwatch/layer-composer'
import { useFeatureState } from '@globalfishingwatch/react-hooks'
import { getEventLabel } from 'utils/analytics'
import { selectAnalysisQuery } from 'features/app/app.selectors'
import { TIMEBAR_HEIGHT } from 'features/timebar/timebar.config'
import { FOOTER_HEIGHT } from 'features/footer/Footer'
import { FIT_BOUNDS_ANALYSIS_PADDING } from 'data/config'
import { parsePropertiesBbox } from 'features/map/map.utils'
import { fetchAreaDetailThunk } from 'features/areas/areas.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import { setDownloadActivityAreaKey } from 'features/download/downloadActivity.slice'
import useMapInstance from 'features/map/map-context.hooks'
import { Bbox } from 'types'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import { setClickedEvent } from '../map.slice'
import { TooltipEventFeature } from '../map.hooks'
import { useMapFitBounds } from '../map-viewport.hooks'

export const getFeatureBounds = (feature: TooltipEventFeature) => {
  return feature.properties.bbox
    ? parsePropertiesBbox(feature.properties.bbox)
    : feature.geometry
    ? (bbox(feature.geometry) as Bbox)
    : null
}

export const getFeatureAreaId = (feature: TooltipEventFeature) => {
  return feature.properties.gfw_id || feature.properties[feature.promoteId]
}

export const useHighlightArea = () => {
  const { updateFeatureState, cleanFeatureState } = useFeatureState(useMapInstance())
  return useCallback(
    (source: string, id: string) => {
      cleanFeatureState('highlight')
      const featureState = { source, sourceLayer: DEFAULT_CONTEXT_SOURCE_LAYER, id }
      updateFeatureState([featureState], 'highlight')
    },
    [cleanFeatureState, updateFeatureState]
  )
}

export const useContextInteractions = () => {
  const dispatch = useAppDispatch()
  const highlightArea = useHighlightArea()
  const { areaId, sourceId } = useSelector(selectAnalysisQuery) || {}
  const datasets = useSelector(selectAllDatasets)
  const { cleanFeatureState } = useFeatureState(useMapInstance())
  const fitMapBounds = useMapFitBounds()

  const onDownloadClick = useCallback(
    (ev: React.MouseEvent<Element, MouseEvent>, feature: TooltipEventFeature) => {
      const areaId = feature.properties.gfw_id || feature.properties[feature.promoteId]
      if (!areaId) {
        console.warn('No gfw_id available in the feature to analyze', feature)
        return
      }

      const datasetId = feature.datasetId
      const dataset = datasets.find((d) => d.id === datasetId)
      if (dataset) {
        const areaName = feature.value || feature.title
        batch(() => {
          dispatch(setDownloadActivityAreaKey({ datasetId, areaId }))
          dispatch(setClickedEvent(null))
        })
        dispatch(fetchAreaDetailThunk({ dataset, areaId, areaName }))
      }

      cleanFeatureState('highlight')
    },
    [cleanFeatureState, dispatch, datasets]
  )

  const setAnalysisArea = useCallback(
    (feature: TooltipEventFeature) => {
      const { source: sourceId, title, value } = feature
      const areaId = getFeatureAreaId(feature)
      // Analysis already does it on page reload but to avoid waiting
      // this moves the map to the same position
      const bounds = getFeatureBounds(feature)
      if (bounds) {
        const boundsParams = {
          padding: FIT_BOUNDS_ANALYSIS_PADDING,
          mapWidth: window.innerWidth / 2,
          mapHeight: window.innerHeight - TIMEBAR_HEIGHT - FOOTER_HEIGHT,
        }
        fitMapBounds(bounds, boundsParams)
      }

      highlightArea(areaId, sourceId)
      dispatch(setClickedEvent(null))

      uaEvent({
        category: 'Analysis',
        action: `Open analysis panel`,
        label: getEventLabel([title ?? '', value ?? '']),
      })
    },
    [highlightArea, dispatch, fitMapBounds]
  )

  const onAnalysisClick = useCallback(
    (ev: React.MouseEvent<Element, MouseEvent>, feature: TooltipEventFeature) => {
      const gfw_id = feature.properties.gfw_id || feature.properties[feature.promoteId]
      if (!gfw_id) {
        console.warn('No gfw_id available in the feature to report', feature)
        return
      }

      if (areaId !== gfw_id || sourceId !== feature.source) {
        setAnalysisArea(feature)
      }
    },
    [areaId, sourceId, setAnalysisArea]
  )

  return useMemo(() => ({ onDownloadClick, onAnalysisClick }), [onDownloadClick, onAnalysisClick])
}
