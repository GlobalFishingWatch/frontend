import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import { getUTCDate } from '@globalfishingwatch/data-transforms'
import { getMergedDataviewId } from '@globalfishingwatch/dataviews-client'
import {
  getAvailableIntervalsInDataviews,
  useGetDeckLayer,
} from '@globalfishingwatch/deck-layer-composer'
import type { FourwingsLayer } from '@globalfishingwatch/deck-layers'
import { getFourwingsChunk } from '@globalfishingwatch/deck-layers'
import type { FourwingsPositionFeature } from '@globalfishingwatch/deck-loaders'
import { useDebounce } from '@globalfishingwatch/react-hooks'
import type { ActivityTimeseriesFrame } from '@globalfishingwatch/timebar'

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
  const [data, setData] = useState<ActivityTimeseriesFrame[]>([])
  const viewport = useMapViewport()
  const viewportChangeHash = useMemo(() => {
    if (!viewport) return ''
    return [viewport.zoom, viewport.latitude, viewport.longitude].map((v) => v.toFixed(2)).join(',')
  }, [viewport])
  const debouncedViewportChangeHash = useDebounce(viewportChangeHash, 400)
  const dataviews = useSelector(selectTimebarSelectedDataviews)
  const visualizationMode = useSelector(selectTimebarSelectedVisualizationMode)
  const timerange = useTimerangeConnect()
  const start = getUTCDate(timerange.start).getTime()
  const end = getUTCDate(timerange.end).getTime()
  const id = dataviews?.length ? getMergedDataviewId(dataviews) : ''
  const allAvailableIntervals = getAvailableIntervalsInDataviews(dataviews)
  const chunk = getFourwingsChunk(start, end, allAvailableIntervals)
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
    [chunk, instance?.props?.sublayers]
  )

  const setFourwingsHeatmapData = useCallback(
    (data: [number[], number[]][][]) => {
      if (data?.length) {
        setData(
          getGraphDataFromFourwingsHeatmap(data, {
            start: chunk.bufferedStart,
            end: chunk.bufferedEnd,
            interval: chunk.interval,
            sublayers: instance.props.sublayers,
            aggregationOperation: instance.props.aggregationOperation,
            minVisibleValue: instance.props.minVisibleValue,
            maxVisibleValue: instance.props.maxVisibleValue,
          })
        )
      } else {
        setData(EMPTY_ACTIVITY_DATA)
      }
    },
    [
      chunk,
      instance?.props?.aggregationOperation,
      instance?.props?.maxVisibleValue,
      instance?.props?.minVisibleValue,
      instance?.props?.sublayers,
    ]
  )

  useEffect(() => {
    if (loaded) {
      if (visualizationMode === 'positions') {
        const viewportData = instance?.getViewportData()
        setFourwingsPositionsData(viewportData as FourwingsPositionFeature[])
      } else {
        const viewportData = instance?.getViewportData({
          onlyValuesAndDates: true,
          sampleData: instance.props.aggregationOperation === 'avg',
        })
        setFourwingsHeatmapData(viewportData as [number[], number[]][][])
      }
    }
  }, [
    loaded,
    id,
    visualizationMode,
    debouncedViewportChangeHash,
    instance?.props.minVisibleValue,
    instance?.props.maxVisibleValue,
  ])

  return useMemo(() => ({ loading: !loaded, heatmapActivity: data }), [data, loaded])
}
