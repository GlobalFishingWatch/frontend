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
import type { ActivityTimeseriesFrame } from '@globalfishingwatch/timebar'

import { selectViewport } from 'features/app/selectors/app.viewport.selectors'
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
  const viewport = useSelector(selectViewport)
  const viewportChangeHash = useMemo(() => {
    if (!viewport) return ''
    return [viewport.zoom, viewport.latitude, viewport.longitude].map((v) => v.toFixed(2)).join(',')
  }, [viewport])
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
          sublayersLength: instance.props.sublayers.length,
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
    viewportChangeHash,
    instance?.props.minVisibleValue,
    instance?.props.maxVisibleValue,
  ])

  return useMemo(() => ({ loading: !loaded, heatmapActivity: data }), [data, loaded])
}
