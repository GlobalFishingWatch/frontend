import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { getGeometryDissolved } from '@globalfishingwatch/data-transforms'
import { DataviewType } from '@globalfishingwatch/api-types'
import {
  ContextFeature,
  ContextLayer,
  ContextPickingObject,
  UserLayerPickingObject,
} from '@globalfishingwatch/deck-layers'
import { useGetDeckLayer } from '@globalfishingwatch/deck-layer-composer'
import { getEventLabel } from 'utils/analytics'
import { AreaKeyId, fetchAreaDetailThunk } from 'features/areas/areas.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import { setDownloadActivityAreaKey } from 'features/download/downloadActivity.slice'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import { selectLocationAreaId } from 'routes/routes.selectors'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectContextAreasDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import { getBufferedAreaBbox } from 'features/reports/reports.utils'
import { selectReportAreaDataview } from 'features/reports/reports.selectors'
import { setClickedEvent } from '../../map.slice'

export const getFeatureBounds = (feature: ContextPickingObject) => {
  if (feature.geometry) {
    const geometry = getGeometryDissolved(feature.geometry)
    const bounds = getBufferedAreaBbox({ area: { geometry } } as any)
    return bounds
  }
}

export const useHighlightReportArea = () => {
  const areaDataview = useSelector(selectReportAreaDataview)
  const areaLayer = useGetDeckLayer<ContextLayer>(areaDataview?.id || '')

  return useCallback(
    (area?: ContextFeature) => {
      if (areaLayer?.instance?.setHighlightedFeatures) {
        areaLayer.instance.setHighlightedFeatures(area ? [area] : [])
      }
    },
    [areaLayer]
  )
}

export const getAreaIdFromFeature = (
  feature: ContextPickingObject | UserLayerPickingObject
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
  const areaId = useSelector(selectLocationAreaId)
  const datasets = useSelector(selectAllDatasets)
  const dataviews = useSelector(selectContextAreasDataviews)
  // const fitMapBounds = useMapFitBounds()

  const onDownloadClick = useCallback(
    (
      ev: React.MouseEvent<Element, MouseEvent>,
      feature: ContextPickingObject | UserLayerPickingObject
    ) => {
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
    [datasets, dataviews, dispatch]
  )

  const setReportArea = useCallback(
    (feature: ContextPickingObject | UserLayerPickingObject) => {
      const { title, value } = feature
      // const areaId = getAreaIdFromFeature(feature) as string
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

      dispatch(setClickedEvent(null))

      trackEvent({
        category: TrackCategory.Analysis,
        action: `Open report`,
        label: getEventLabel([title ?? '', value.toString()]),
      })
    },
    [dispatch]
  )

  const onReportClick = useCallback(
    (
      ev: React.MouseEvent<Element, MouseEvent>,
      feature: ContextPickingObject | UserLayerPickingObject
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
    [areaId, setReportArea]
  )

  return useMemo(() => ({ onDownloadClick, onReportClick }), [onDownloadClick, onReportClick])
}
