import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'

import { DataviewType } from '@globalfishingwatch/api-types'
import type { ContextPickingObject, UserLayerPickingObject } from '@globalfishingwatch/deck-layers'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import type { AreaKeyId } from 'features/areas/areas.slice'
import { fetchAreaDetailThunk } from 'features/areas/areas.slice'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import { selectContextAreasDataviews } from 'features/dataviews/selectors/dataviews.categories.selectors'
import { setDownloadActivityAreaKey } from 'features/download/downloadActivity.slice'
import { useClickedEventConnect } from 'features/map/map-interactions.hooks'
import { selectLocationAreaId } from 'routes/routes.selectors'
import { getEventLabel } from 'utils/analytics'

export const getAreaIdFromFeature = (
  feature: ContextPickingObject | UserLayerPickingObject
): AreaKeyId => {
  return (
    feature.properties?.gfw_id ||
    feature.properties?.[(feature as any).promoteId as string] ||
    (feature.id as string)
  )
}

export const useContextInteractions = () => {
  const dispatch = useAppDispatch()
  const areaId = useSelector(selectLocationAreaId)
  const datasets = useSelector(selectAllDatasets)
  const dataviews = useSelector(selectContextAreasDataviews)
  const { dispatchClickedEvent } = useClickedEventConnect()
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
        dispatch(fetchAreaDetailThunk({ datasetId, areaId, areaName }))
        dispatchClickedEvent(null)
      }
    },
    [datasets, dataviews, dispatch, dispatchClickedEvent]
  )

  const setReportArea = useCallback(
    (feature: ContextPickingObject | UserLayerPickingObject) => {
      const { title, value } = feature
      dispatchClickedEvent(null)

      trackEvent({
        category: TrackCategory.Analysis,
        action: `Open report`,
        label: getEventLabel([title ?? '', value.toString()]),
      })
    },
    [dispatchClickedEvent]
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
      if (areaId?.toString() !== featureAreaId) {
        setReportArea(feature)
      }
    },
    [areaId, setReportArea]
  )

  return useMemo(() => ({ onDownloadClick, onReportClick }), [onDownloadClick, onReportClick])
}
