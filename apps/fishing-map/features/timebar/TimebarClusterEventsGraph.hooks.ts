import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import { getUTCDate } from '@globalfishingwatch/data-transforms'
import { getMergedDataviewId } from '@globalfishingwatch/dataviews-client'
import {
  getAvailableIntervalsInDataviews,
  useGetDeckLayer,
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
  const viewportChangeHash = useMemo(() => {
    if (!viewport) return ''
    return [viewport.zoom, viewport.latitude, viewport.longitude].map((v) => v.toFixed(2)).join(',')
  }, [viewport])
  const dataviews = useSelector(selectTimebarSelectedDataviews)
  const timerange = useTimerangeConnect()
  const start = getUTCDate(timerange.start).getTime()
  const end = getUTCDate(timerange.end).getTime()
  const id = dataviews?.length ? getMergedDataviewId(dataviews) : ''
  const allAvailableIntervals = getAvailableIntervalsInDataviews(dataviews)
  const { interval } = getFourwingsChunk(start, end, allAvailableIntervals)
  const clusterEventsLayer = useGetDeckLayer<FourwingsClustersLayer>(id)
  const { loaded, instance } = clusterEventsLayer || {}

  const setFourwingsPositionsData = useCallback(
    async (viewportData: FourwingsPointFeature[]) => {
      const data =
        getGraphDataFromFourwingsPositions(viewportData, {
          start,
          end,
          interval,
          sublayersLength: 1,
        }) || EMPTY_ACTIVITY_DATA
      setData(data)
    },
    [interval, end, start]
  )

  useEffect(() => {
    if (loaded) {
      const viewportData = instance?.getViewportData()
      setFourwingsPositionsData(viewportData as FourwingsPointFeature[])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, id, viewportChangeHash])

  return useMemo(() => ({ loading: !loaded, eventsActivity: data }), [data, loaded])
}
