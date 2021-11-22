import { useCallback, useMemo } from 'react'
import { batch, useDispatch, useSelector } from 'react-redux'
import { event as uaEvent } from 'react-ga'
import bbox from '@turf/bbox'
import { DEFAULT_CONTEXT_SOURCE_LAYER } from '@globalfishingwatch/layer-composer'
import { useFeatureState } from '@globalfishingwatch/react-hooks'
import { Bbox } from 'types'
import { setDownloadActivityGeometry } from 'features/download/downloadActivity.slice'
import { useLocationConnect } from 'routes/routes.hook'
import { getEventLabel } from 'utils/analytics'
import { selectSidebarOpen } from 'features/app/app.selectors'
import { TIMEBAR_HEIGHT } from 'features/timebar/Timebar'
import { FOOTER_HEIGHT } from 'features/footer/Footer'
import { FIT_BOUNDS_ANALYSIS_PADDING } from 'data/config'
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
        dispatch(setDownloadActivityGeometry(feature))
        dispatch(setClickedEvent(null))
      })

      cleanFeatureState('highlight')
    },
    [cleanFeatureState, dispatch, eventManager]
  )

  const onReportClick = useCallback(
    (ev: React.MouseEvent<Element, MouseEvent>, feature: TooltipEventFeature) => {
      eventManager.once('click', (e: any) => e.stopPropagation(), ev.target)

      if (!feature.properties?.gfw_id) {
        console.warn('No gfw_id available in the feature to report', feature)
        return
      }

      const areaId = feature.properties?.gfw_id
      const sourceId = feature.source
      highlightArea(areaId, sourceId)
      batch(() => {
        dispatchQueryParams({
          analysis: { areaId, sourceId },
          ...(!isSidebarOpen && { sidebarOpen: true }),
        })
        dispatch(setClickedEvent(null))
      })

      // Analysis already does it on page reload but to avoid waiting
      // this moves the map to the same position
      const bounds = bbox(feature.geometry) as Bbox
      if (bounds) {
        const boundsParams = {
          padding: FIT_BOUNDS_ANALYSIS_PADDING,
          mapWidth: window.innerWidth / 2,
          mapHeight: window.innerHeight - TIMEBAR_HEIGHT - FOOTER_HEIGHT,
        }
        fitMapBounds(bounds, boundsParams)
      }
      uaEvent({
        category: 'Analysis',
        action: `Open analysis panel`,
        label: getEventLabel([feature.title ?? '', feature.value ?? '']),
      })
    },
    [eventManager, highlightArea, dispatchQueryParams, isSidebarOpen, dispatch, fitMapBounds]
  )

  return useMemo(() => ({ onDownloadClick, onReportClick }), [onDownloadClick, onReportClick])
}
