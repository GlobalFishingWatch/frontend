import { useSelector } from 'react-redux'
import { useMemo } from 'react'
import { useGetDeckLayers } from '@globalfishingwatch/deck-layer-composer'
import { FourwingsLayer } from '@globalfishingwatch/deck-layers'
import { TimebarVisualisations } from 'types'
import {
  selectActivityDataviews,
  selectDetectionsDataviews,
} from 'features/dataviews/selectors/dataviews.selectors'
import { selectTimebarVisualisation } from 'features/app/selectors/app.timebar.selectors'
import { getGraphDataFromFourwingsFeatures } from './timebar.utils'

export const useHeatmapActivityGraph = () => {
  const timebarVisualisation = useSelector(selectTimebarVisualisation)
  const detectionsDataviews = useSelector(selectDetectionsDataviews)
  const activityDataviews = useSelector(selectActivityDataviews)
  const dataviews =
    timebarVisualisation === TimebarVisualisations.HeatmapDetections
      ? detectionsDataviews
      : activityDataviews
  const ids = useMemo(() => {
    return dataviews.map((d) => d.id)
  }, [dataviews])
  const fourwingsActivityLayer = useGetDeckLayers<FourwingsLayer>(ids)
  // TODO select instance based on timebar settings selection
  const instance = fourwingsActivityLayer?.[0]?.instance
  const loaded = fourwingsActivityLayer?.every((layer) => layer.loaded)

  const heatmapActivity = useMemo(() => {
    if (loaded) {
      const viewportData = instance?.getViewportData()
      return getGraphDataFromFourwingsFeatures(viewportData) || []
    }
    return []
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded])

  return useMemo(() => ({ loading: !loaded, heatmapActivity }), [heatmapActivity, loaded])
}
