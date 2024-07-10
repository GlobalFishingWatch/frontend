import { useSelector } from 'react-redux'
import { useMemo } from 'react'
import { useGetDeckLayer } from '@globalfishingwatch/deck-layer-composer'
import { FourwingsLayer, getFourwingsChunk } from '@globalfishingwatch/deck-layers'
import { getMergedDataviewId } from '@globalfishingwatch/dataviews-client'
import { ActivityTimeseriesFrame } from '@globalfishingwatch/timebar'
import { useDebounce } from '@globalfishingwatch/react-hooks'
import { getUTCDate } from '@globalfishingwatch/data-transforms'
import { FourwingsFeature, FourwingsPositionFeature } from '@globalfishingwatch/deck-loaders'
import { useMapViewport } from 'features/map/map-viewport.hooks'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import {
  selectTimebarSelectedDataviews,
  selectTimebarSelectedVisualizationMode,
} from 'features/timebar/timebar.selectors'
import {
  getGraphDataFromFourwingsHeatmap,
  getGraphDataFromFourwingsPositions,
} from './timebar.utils'

const EMPTY_ACTIVITY_DATA = [] as ActivityTimeseriesFrame[]

export const useHeatmapActivityGraph = () => {
  const viewport = useMapViewport()
  const viewportChangeHash = useMemo(() => {
    if (!viewport) return ''
    return [viewport.zoom, viewport.latitude, viewport.longitude].map((v) => v.toFixed(5)).join(',')
  }, [viewport])
  const debouncedViewportChangeHash = useDebounce(viewportChangeHash, 400)
  const dataviews = useSelector(selectTimebarSelectedDataviews)
  const visualizationMode = useSelector(selectTimebarSelectedVisualizationMode)
  const timerange = useTimerangeConnect()
  const start = getUTCDate(timerange.start).getTime()
  const end = getUTCDate(timerange.end).getTime()
  const chunk = getFourwingsChunk(start, end)
  const id = dataviews?.length ? getMergedDataviewId(dataviews) : ''
  const fourwingsActivityLayer = useGetDeckLayer<FourwingsLayer>(id)
  const { loaded, instance } = fourwingsActivityLayer || {}

  const heatmapActivity = useMemo(() => {
    if (loaded) {
      const viewportData = instance?.getViewportData()
      if (visualizationMode === 'positions') {
        return (
          getGraphDataFromFourwingsPositions(viewportData as FourwingsPositionFeature[], {
            start: chunk.bufferedStart,
            end: chunk.bufferedEnd,
            interval: chunk.interval,
            sublayers: instance.props.sublayers,
          }) || EMPTY_ACTIVITY_DATA
        )
      }
      return (
        getGraphDataFromFourwingsHeatmap(viewportData as FourwingsFeature[], {
          start: chunk.bufferedStart,
          end: chunk.bufferedEnd,
          interval: chunk.interval,
          sublayers: instance.props.sublayers,
          aggregationOperation: instance.props.aggregationOperation,
          minVisibleValue: instance.props.minVisibleValue,
          maxVisibleValue: instance.props.maxVisibleValue,
        }) || EMPTY_ACTIVITY_DATA
      )
    }
    return EMPTY_ACTIVITY_DATA
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    loaded,
    visualizationMode,
    debouncedViewportChangeHash,
    instance?.props.minVisibleValue,
    instance?.props.maxVisibleValue,
  ])

  return useMemo(() => ({ loading: !loaded, heatmapActivity }), [heatmapActivity, loaded])
}
