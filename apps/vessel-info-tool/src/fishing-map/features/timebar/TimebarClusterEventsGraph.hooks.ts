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

import { selectViewport } from 'features/app/selectors/app.viewport.selectors'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { selectTimebarSelectedDataviews } from 'features/timebar/timebar.selectors'

import { getGraphDataFromFourwingsPositions } from './timebar.utils'

const EMPTY_ACTIVITY_DATA = [] as ActivityTimeseriesFrame[]

export const useClusterEventsGraph = () => {
  const [data, setData] = useState<ActivityTimeseriesFrame[]>([])
  const viewport = useSelector(selectViewport)
  const dataviews = useSelector(selectTimebarSelectedDataviews)
  const timerange = useTimerangeConnect()
  const start = getUTCDate(timerange.start).getTime()
  const end = getUTCDate(timerange.end).getTime()
  const dataviewIds = useMemo(() => dataviews?.map(({ id }) => id), [dataviews])
  const clusterEventsLayers = useGetDeckLayers<FourwingsClustersLayer>(dataviewIds)

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
      const allAvailableIntervals = getAvailableIntervalsInDataviews(dataviews)
      const { interval } = getFourwingsChunk(start, end, allAvailableIntervals)
      const data =
        getGraphDataFromFourwingsPositions(viewportData, {
          start,
          end,
          interval,
          sublayersLength: dataviews.length,
        }) || EMPTY_ACTIVITY_DATA
      setData(data)
    },
    [dataviews, end, start]
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, instances, dataviewIds, viewportChangeHash])

  return useMemo(() => ({ loading: !loaded, eventsActivity: data }), [data, loaded])
}
