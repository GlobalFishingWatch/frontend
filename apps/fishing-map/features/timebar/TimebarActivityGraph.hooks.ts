import { useSelector } from 'react-redux'
import { useCallback, useEffect, useMemo, useState } from 'react'
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
import { getGraphDataFromFourwingsPositions } from './timebar.utils'
import { useHeatmapGraphWorker } from './timebar.workers.hooks'

const EMPTY_ACTIVITY_DATA = [] as ActivityTimeseriesFrame[]

export const useHeatmapActivityGraph = () => {
  const [data, setData] = useState<ActivityTimeseriesFrame[]>([])
  const heatmapTimebarWorker = useHeatmapGraphWorker()
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

  const setFourwingsPositionsData = useCallback(
    async (viewportData: FourwingsPositionFeature[]) => {
      const data =
        getGraphDataFromFourwingsPositions(viewportData, {
          start: chunk.bufferedStart,
          end: chunk.bufferedEnd,
          interval: chunk.interval,
          sublayers: instance.props.sublayers,
        }) || EMPTY_ACTIVITY_DATA
      setData(data)
    },
    [chunk, instance]
  )

  const setFourwingsHeatmapData = useCallback(
    async (data: FourwingsFeature[]) => {
      if (data?.length && heatmapTimebarWorker) {
        heatmapTimebarWorker?.postMessage({
          data,
          params: {
            start: chunk.bufferedStart,
            end: chunk.bufferedEnd,
            interval: chunk.interval,
            sublayers: instance.props.sublayers,
            aggregationOperation: instance.props.aggregationOperation,
            minVisibleValue: instance.props.minVisibleValue,
            maxVisibleValue: instance.props.maxVisibleValue,
          },
        })
        heatmapTimebarWorker.onmessage = ({ data }: MessageEvent<ActivityTimeseriesFrame[]>) => {
          setData(data || EMPTY_ACTIVITY_DATA)
        }
      } else {
        setData(EMPTY_ACTIVITY_DATA)
      }
    },
    [chunk, instance, heatmapTimebarWorker]
  )

  useEffect(() => {
    if (loaded) {
      const viewportData = instance?.getViewportData()
      if (visualizationMode === 'positions') {
        setFourwingsPositionsData(viewportData as FourwingsPositionFeature[])
      }
      setFourwingsHeatmapData(viewportData as FourwingsFeature[])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    loaded,
    visualizationMode,
    debouncedViewportChangeHash,
    instance?.props.minVisibleValue,
    instance?.props.maxVisibleValue,
  ])

  return useMemo(() => ({ loading: !loaded, heatmapActivity: data }), [data, loaded])
}
