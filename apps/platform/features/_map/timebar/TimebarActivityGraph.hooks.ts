import { useEffect, useEffectEvent, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useAtomValue } from 'jotai'

import { getUTCDate } from '@globalfishingwatch/data-transforms'
import { getMergedDataviewId } from '@globalfishingwatch/dataviews-client'
import {
  deckLayerInstancesAtom,
  getAvailableIntervalsInDataviews,
  useGetDeckLayer,
  useGetDeckLayerLegend,
} from '@globalfishingwatch/deck-layer-composer'
import type { FourwingsLayer } from '@globalfishingwatch/deck-layers'
import { getFourwingsChunk } from '@globalfishingwatch/deck-layers'
import { isMultiHueColorRampId } from '@globalfishingwatch/deck-layers/utils'
import type {
  FourwingsPositionFeature,
  FourwingsValuesAndStartFrameFeature,
} from '@globalfishingwatch/deck-loaders'
import type { ActivityTimeseriesFrame, TimebarColorScale } from '@globalfishingwatch/timebar'
import { useTimebar } from '@globalfishingwatch/timebar'

import {
  selectRealTimeTimerange,
  selectTimebarSelectedDataviews,
  selectTimebarSelectedVisualizationMode,
} from 'features/_map/timebar/timebar.selectors'
import { selectViewport } from 'features/_map/workspace/selectors/app.viewport.selectors'
import { selectIsRealTimeMode } from 'features/_map/workspace/workspace.selectors'

import {
  getGraphDataFromFourwingsHeatmap,
  getGraphDataFromFourwingsPositions,
  getLegendColorScale,
} from './timebar.utils'

const EMPTY_ACTIVITY_DATA = [] as ActivityTimeseriesFrame[]
const lastLegendRampByLayer = new Map<string, { domain: number[]; colors: string[] }>()

export const useHeatmapActivityGraph = () => {
  const [data, setData] = useState<ActivityTimeseriesFrame[]>([])
  const viewport = useSelector(selectViewport)
  const viewportChangeHash = useMemo(() => {
    if (!viewport) return ''
    return [viewport.zoom, viewport.latitude, viewport.longitude].map((v) => v.toFixed(2)).join(',')
  }, [viewport])
  const dataviews = useSelector(selectTimebarSelectedDataviews)
  const visualizationMode = useSelector(selectTimebarSelectedVisualizationMode)
  const isRealTimeMode = useSelector(selectIsRealTimeMode)
  const realTimeTimerange = useSelector(selectRealTimeTimerange)
  const { start: rangeStart, end: rangeEnd } = useTimebar()
  const start = getUTCDate(rangeStart).getTime()
  const end = getUTCDate(rangeEnd).getTime()
  const id = dataviews?.length ? getMergedDataviewId(dataviews) : ''
  const availableIntervals = getAvailableIntervalsInDataviews(dataviews)
  const chunk = getFourwingsChunk({
    start,
    end,
    availableIntervals,
    ...(isRealTimeMode &&
      realTimeTimerange && {
        intervalCacheMode: 'NONE',
        bufferedStart: getUTCDate(realTimeTimerange.start).getTime(),
        bufferedEnd: getUTCDate(realTimeTimerange.end).getTime(),
      }),
  })
  const fourwingsActivityLayer = useGetDeckLayer<FourwingsLayer>(id)
  const { loaded, instance } = fourwingsActivityLayer || {}
  const legend = useGetDeckLayerLegend(id)
  const layerInstances = useAtomValue(deckLayerInstancesAtom)

  const colorScale: TimebarColorScale = useMemo(() => {
    const layer = (instance ?? layerInstances.find((layer) => layer.id === id)) as
      FourwingsLayer | undefined
    const sublayers = layer?.props?.sublayers
    if (sublayers?.length !== 1 || !isMultiHueColorRampId(sublayers[0].colorRamp)) {
      return undefined
    }
    const domain = legend?.domain as number[] | undefined
    const colors = (legend?.ranges as string[][])?.[0]
    if (domain?.length && colors?.length) {
      lastLegendRampByLayer.set(id, { domain, colors })
    }
    const ramp = lastLegendRampByLayer.get(id)
    const legendScale = ramp && getLegendColorScale(ramp.domain, ramp.colors)
    return (value: number) => layer?.getColorByValue?.(value) ?? legendScale?.(value)
  }, [instance, layerInstances, id, legend?.domain, legend?.ranges])

  const setFourwingsPositionsData = async (viewportData: FourwingsPositionFeature[]) => {
    const data =
      getGraphDataFromFourwingsPositions(viewportData, {
        start: chunk.bufferedStart,
        end: chunk.bufferedEnd,
        interval: chunk.interval,
        sublayersLength: instance.props.sublayers.length,
      }) || EMPTY_ACTIVITY_DATA
    setData(data)
  }

  const setFourwingsHeatmapData = (data: FourwingsValuesAndStartFrameFeature[]) => {
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
  }

  const onViewportDataChange = useEffectEvent(() => {
    if (loaded) {
      if (visualizationMode === 'positions') {
        const viewportData = instance?.getViewportData?.()
        setFourwingsPositionsData(viewportData as FourwingsPositionFeature[])
      } else {
        const viewportData = instance?.getViewportData?.({ onlyValuesAndStartFrame: true })
        setFourwingsHeatmapData(viewportData as FourwingsValuesAndStartFrameFeature[])
      }
    }
  })

  useEffect(() => {
    onViewportDataChange()
  }, [
    loaded,
    id,
    visualizationMode,
    viewportChangeHash,
    // Chunk bounds only move when the playhead crosses a chunk, so playback frames
    // don't recompute identical graph data 60 times per second.
    chunk.bufferedStart,
    chunk.bufferedEnd,
    chunk.interval,
    instance?.props.minVisibleValue,
    instance?.props.maxVisibleValue,
  ])

  return useMemo(
    () => ({ loading: !loaded, heatmapActivity: data, dataviews, colorScale }),
    [data, loaded, dataviews, colorScale]
  )
}
