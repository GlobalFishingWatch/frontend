import { useSelector } from 'react-redux'
import { useMemo } from 'react'
import { useGetDeckLayer } from '@globalfishingwatch/deck-layer-composer'
import { FourwingsLayer } from '@globalfishingwatch/deck-layers'
import { getMergedDataviewId } from '@globalfishingwatch/dataviews-client'
import { ActivityTimeseriesFrame } from '@globalfishingwatch/timebar'
import { TimebarVisualisations } from 'types'
import {
  selectActiveActivityDataviews,
  selectActiveDetectionsDataviews,
} from 'features/dataviews/selectors/dataviews.selectors'
import { selectTimebarVisualisation } from 'features/app/selectors/app.timebar.selectors'
import { getGraphDataFromFourwingsFeatures } from './timebar.utils'

const EMPTY_ACTIVITY_DATA = [] as ActivityTimeseriesFrame[]

export const useHeatmapActivityGraph = () => {
  const timebarVisualisation = useSelector(selectTimebarVisualisation)
  const detectionsDataviews = useSelector(selectActiveDetectionsDataviews)
  const activityDataviews = useSelector(selectActiveActivityDataviews)
  const dataviews =
    timebarVisualisation === TimebarVisualisations.HeatmapDetections
      ? detectionsDataviews
      : activityDataviews
  const id = getMergedDataviewId(dataviews)
  const fourwingsActivityLayer = useGetDeckLayer<FourwingsLayer>(id)
  const { loaded, instance } = fourwingsActivityLayer || {}

  const heatmapActivity = useMemo(() => {
    if (loaded) {
      const viewportData = instance?.getViewportData()
      return getGraphDataFromFourwingsFeatures(viewportData) || EMPTY_ACTIVITY_DATA
    }
    return EMPTY_ACTIVITY_DATA
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded])

  return useMemo(() => ({ loading: !loaded, heatmapActivity }), [heatmapActivity, loaded])
}
