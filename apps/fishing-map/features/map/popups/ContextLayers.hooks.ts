import { useCallback, useMemo } from 'react'
import { batch, useDispatch, useSelector } from 'react-redux'
import { event as uaEvent } from 'react-ga'
import { DEFAULT_CONTEXT_SOURCE_LAYER } from '@globalfishingwatch/layer-composer'
import { useFeatureState } from '@globalfishingwatch/react-hooks'
import { useLocationConnect } from 'routes/routes.hook'
import { getEventLabel } from 'utils/analytics'
import { selectAnalysisQuery, selectSidebarOpen } from 'features/app/app.selectors'
import { TIMEBAR_HEIGHT } from 'features/timebar/timebar.config'
import { FOOTER_HEIGHT } from 'features/footer/Footer'
import { FIT_BOUNDS_ANALYSIS_PADDING } from 'data/config'
import { parsePropertiesBbox } from 'features/map/map.utils'
import { setClickedEvent } from '../map.slice'
import useMapInstance, { useMapContext } from '../map-context.hooks'
import { TooltipEventFeature } from '../map.hooks'
import { useMapFitBounds } from '../map-viewport.hooks'

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
  const dispatch = useDispatch()
  const highlightArea = useHighlightArea()
  const { eventManager } = useMapContext()
  const isSidebarOpen = useSelector(selectSidebarOpen)
  const { dispatchQueryParams } = useLocationConnect()
  const { areaId, sourceId } = useSelector(selectAnalysisQuery) || {}
  const { cleanFeatureState } = useFeatureState(useMapInstance())
  const fitMapBounds = useMapFitBounds()

  const onDownloadClick = useCallback(
    (ev: React.MouseEvent<Element, MouseEvent>, feature: TooltipEventFeature) => {
      eventManager.once('click', (e: any) => e.stopPropagation(), ev.target)

      if (!feature.properties?.gfw_id) {
        console.warn('No gfw_id available in the feature to analyze', feature)
        return
      }
      batch(() => {
        // TODO get geometry from API too
        // dispatch(
        //   setDownloadActivityGeometry({
        //     geometry: feature.geometry,
        //     name: feature.value || feature.title,
        //   })
        // )
        dispatch(setClickedEvent(null))
      })

      cleanFeatureState('highlight')
    },
    [cleanFeatureState, dispatch, eventManager]
  )

  const setAnalysisArea = useCallback(
    (feature: TooltipEventFeature) => {
      const { source: sourceId, datasetId, properties = {}, title, value } = feature
      const { gfw_id: areaId, bbox } = properties
      // Analysis already does it on page reload but to avoid waiting
      // this moves the map to the same position
      const bounds = parsePropertiesBbox(bbox)
      if (bounds) {
        const boundsParams = {
          padding: FIT_BOUNDS_ANALYSIS_PADDING,
          mapWidth: window.innerWidth / 2,
          mapHeight: window.innerHeight - TIMEBAR_HEIGHT - FOOTER_HEIGHT,
        }
        fitMapBounds(bounds, boundsParams)
      }

      highlightArea(areaId, sourceId)
      batch(() => {
        dispatchQueryParams({
          analysis: { areaId, sourceId, datasetId, bounds },
          ...(!isSidebarOpen && { sidebarOpen: true }),
        })
        dispatch(setClickedEvent(null))
      })

      uaEvent({
        category: 'Analysis',
        action: `Open analysis panel`,
        label: getEventLabel([title ?? '', value ?? '']),
      })
    },
    [highlightArea, dispatchQueryParams, isSidebarOpen, dispatch, fitMapBounds]
  )

  const onAnalysisClick = useCallback(
    (ev: React.MouseEvent<Element, MouseEvent>, feature: TooltipEventFeature) => {
      eventManager.once('click', (e: any) => e.stopPropagation(), ev.target)

      if (!feature.properties?.gfw_id) {
        console.warn('No gfw_id available in the feature to report', feature)
        return
      }

      if (areaId !== feature.properties?.gfw_id || sourceId !== feature.source) {
        setAnalysisArea(feature)
      }
    },
    [areaId, sourceId, eventManager, setAnalysisArea]
  )

  return useMemo(() => ({ onDownloadClick, onAnalysisClick }), [onDownloadClick, onAnalysisClick])
}
