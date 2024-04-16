import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { DEFAULT_CONTEXT_SOURCE_LAYER } from '@globalfishingwatch/layer-composer'
import { getGeometryDissolved } from '@globalfishingwatch/data-transforms'
import { DataviewType } from '@globalfishingwatch/api-types'
import { ContextPickingObject, UserContextPickingObject } from '@globalfishingwatch/deck-layers'
import { getEventLabel } from 'utils/analytics'
import { TIMEBAR_HEIGHT } from 'features/timebar/timebar.config'
import { FOOTER_HEIGHT } from 'features/footer/Footer'
import { FIT_BOUNDS_REPORT_PADDING } from 'data/config'
import { AreaKeyId, fetchAreaDetailThunk } from 'features/areas/areas.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import { setDownloadActivityAreaKey } from 'features/download/downloadActivity.slice'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import { selectReportAreaSource } from 'features/app/selectors/app.reports.selector'
import { selectLocationAreaId } from 'routes/routes.selectors'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectContextAreasDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import { getBufferedAreaBbox } from 'features/reports/reports.utils'
import { setClickedEvent } from '../map.slice'
import { useMapFitBounds } from '../map-bounds.hooks'

export const getFeatureBounds = (feature: ContextPickingObject) => {
  if (feature.geometry) {
    const geometry = getGeometryDissolved(feature.geometry)
    const bounds = getBufferedAreaBbox({ area: { geometry } } as any)
    return bounds
  }
}

export type HighlightedAreaParams = {
  sourceId: string
  areaId: string
  sourceLayer?: string
}
export const useHighlightArea = () => {
  return useCallback(
    ({ sourceId, areaId, sourceLayer = DEFAULT_CONTEXT_SOURCE_LAYER }: HighlightedAreaParams) => {
      // TODO:deck:featureState review if this still needed
      // cleanFeatureState('click')
      // const featureState = {
      //   source: sourceId,
      //   sourceLayer: sourceLayer !== '' ? sourceLayer : undefined,
      //   id: areaId,
      // }
      // TODO:deck:featureState review if this still needed
      // updateFeatureState([featureState], 'highlight')
    },
    []
  )
}

export const getAreaIdFromFeature = (
  feature: ContextPickingObject | UserContextPickingObject
): AreaKeyId => {
  return (
    feature.properties?.gfw_id ||
    // TODO:deck check if promoteId is covered for every case in the getPickingInfo function
    feature.properties?.[(feature as any).promoteId as string] ||
    (feature.id as string)
  )
}

export const useContextInteractions = () => {
  const dispatch = useAppDispatch()
  const highlightArea = useHighlightArea()
  const areaId = useSelector(selectLocationAreaId)
  const sourceId = useSelector(selectReportAreaSource)
  const datasets = useSelector(selectAllDatasets)
  const dataviews = useSelector(selectContextAreasDataviews)
  const fitMapBounds = useMapFitBounds()

  const onDownloadClick = useCallback(
    (ev: React.MouseEvent<Element, MouseEvent>, feature: ContextPickingObject) => {
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
        const areaName =
          dataview?.config?.type === DataviewType.UserContext
            ? dataview?.datasets?.[0]?.name
            : feature.value.toString() || feature.title
        dispatch(setDownloadActivityAreaKey({ datasetId, areaId, areaName }))
        dispatch(setClickedEvent(null))
        dispatch(fetchAreaDetailThunk({ dataset, areaId, areaName }))
      }
      // TODO:deck:featureState review if this still needed
      // cleanFeatureState('highlight')
    },
    [datasets, cleanFeatureState, dataviews, dispatch]
  )

  const setReportArea = useCallback(
    (feature: ContextPickingObject | UserContextPickingObject) => {
      const { title, value } = feature
      const areaId = getAreaIdFromFeature(feature) as string
      // Report already does it on page reload but to avoid waiting
      // this moves the map to the same position
      // const bounds = getFeatureBounds(feature)
      // if (bounds) {
      //   const boundsParams = {
      //     padding: FIT_BOUNDS_REPORT_PADDING,
      //     mapWidth: window.innerWidth / 2,
      //     mapHeight: window.innerHeight - TIMEBAR_HEIGHT - FOOTER_HEIGHT,
      //   }
      //   fitMapBounds(bounds, boundsParams)
      // }

      highlightArea({ sourceId, areaId })
      dispatch(setClickedEvent(null))

      trackEvent({
        category: TrackCategory.Analysis,
        action: `Open report`,
        label: getEventLabel([title ?? '', value.toString()]),
      })
    },
    [highlightArea, dispatch]
  )

  const onReportClick = useCallback(
    (
      ev: React.MouseEvent<Element, MouseEvent>,
      feature: ContextPickingObject | UserContextPickingObject
    ) => {
      const featureAreaId = getAreaIdFromFeature(feature)
      if (!featureAreaId) {
        console.warn('No areaId available in the feature to report', feature)
        return
      }
      // TODO:deck check if we can remove source from the url
      if (areaId?.toString() !== featureAreaId /*|| sourceId !== feature.source */) {
        setReportArea(feature)
      }
    },
    [areaId, sourceId, setReportArea]
  )

  return useMemo(() => ({ onDownloadClick, onReportClick }), [onDownloadClick, onReportClick])
}
