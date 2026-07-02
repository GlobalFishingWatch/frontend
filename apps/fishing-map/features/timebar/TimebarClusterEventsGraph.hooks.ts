import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import { getUTCDate } from '@globalfishingwatch/data-transforms'
import {
  getAvailableIntervalsInDataviews,
  useGetDeckLayers,
} from '@globalfishingwatch/deck-layer-composer'
import type { FourwingsClustersLayer } from '@globalfishingwatch/deck-layers'
import { getFourwingsChunk } from '@globalfishingwatch/deck-layers'
import type { FourwingsPointFeature } from '@globalfishingwatch/deck-loaders'
import type { ActivityTimeseriesFrame } from '@globalfishingwatch/timebar'
import { useTimebar } from '@globalfishingwatch/timebar'

import { selectViewport } from 'features/app/selectors/app.viewport.selectors'
import { selectTimebarSelectedDataviews } from 'features/timebar/timebar.selectors'

import { getGraphDataFromFourwingsPositions } from './timebar.utils'

const EMPTY_ACTIVITY_DATA = [] as ActivityTimeseriesFrame[]

export const useClusterEventsGraph = () => {
  const [data, setData] = useState<ActivityTimeseriesFrame[]>([])
  const viewport = useSelector(selectViewport)
  const dataviews = useSelector(selectTimebarSelectedDataviews)
  const { start: rangeStart, end: rangeEnd } = useTimebar()
  const start = getUTCDate(rangeStart).getTime()
  const end = getUTCDate(rangeEnd).getTime()
  const dataviewIds = useMemo(() => dataviews?.map(({ id }) => id), [dataviews])
  const clusterEventsLayers = useGetDeckLayers<FourwingsClustersLayer>(dataviewIds)
  const availableIntervals = getAvailableIntervalsInDataviews(dataviews)
  const chunk = getFourwingsChunk({ start, end, availableIntervals })

  const viewportChangeHash = useMemo(() => {
    if (!viewport) return ''
    return [viewport.zoom, viewport.latitude, viewport.longitude].map((v) => v.toFixed(2)).join(',')
  }, [viewport])

  const loaded = clusterEventsLayers?.length
    ? clusterEventsLayers.every(({ instance }) => instance.isLoaded)
    : false

  const instances = useMemo(() => {
    return clusterEventsLayers?.map(({ instance }) => instance)
  }, [clusterEventsLayers])

  const setFourwingsPositionsData = useCallback(
    async (viewportData: FourwingsPointFeature[]) => {
      const data =
        getGraphDataFromFourwingsPositions(viewportData, {
          start: chunk.bufferedStart,
          end: chunk.bufferedEnd,
          interval: chunk.interval,
          sublayersLength: dataviews.length,
        }) || EMPTY_ACTIVITY_DATA
      setData(data)
    },
    [dataviews, chunk.bufferedStart, chunk.bufferedEnd, chunk.interval]
  )

  useEffect(() => {
    if (loaded) {
      const viewportData = instances.flatMap((instance, index) => {
        return instance?.getViewportData?.().map((feature) => {
          return {
            ...feature,
            properties: {
              ...feature.properties,
              layer: index,
            } as any,
          } as FourwingsPointFeature
        })
      })
      setFourwingsPositionsData(viewportData)
    }
    // Chunk bounds only move when the playhead crosses a chunk, so playback frames
    // don't recompute identical graph data 60 times per second.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    loaded,
    instances,
    dataviewIds,
    viewportChangeHash,
    chunk.bufferedStart,
    chunk.bufferedEnd,
    chunk.interval,
  ])

  return useMemo(() => ({ loading: !loaded, eventsActivity: data }), [data, loaded])
}
