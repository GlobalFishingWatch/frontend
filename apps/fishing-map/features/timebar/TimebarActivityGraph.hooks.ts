import { useSelector } from 'react-redux'
import { useMemo } from 'react'
import { useGetDeckLayers } from '@globalfishingwatch/deck-layer-composer'
import { TileCell } from '@globalfishingwatch/deck-loaders'
import { FourwingsLayer } from '@globalfishingwatch/deck-layers'
import { TimebarVisualisations } from 'types'
import {
  selectActivityDataviews,
  selectDetectionsDataviews,
} from 'features/dataviews/selectors/dataviews.selectors'
import { selectTimebarVisualisation } from 'features/app/selectors/app.timebar.selectors'
import { getGraphFromGridCellsData } from './timebar.utils'

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
  const loading = fourwingsActivityLayer?.some((layer) => !layer.loaded)
  const cellsData: TileCell[] = fourwingsActivityLayer?.[0]?.instance?.getViewportData()
  console.log('🚀 ~ useHeatmapActivityGraph ~ cellsData:', cellsData)

  const heatmapActivity = useMemo(
    () => (cellsData?.length ? getGraphFromGridCellsData(cellsData) || [] : []),
    [cellsData]
  )

  return useMemo(() => ({ loading, heatmapActivity }), [heatmapActivity, loading])
}
