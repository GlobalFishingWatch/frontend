import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import { DatasetStatus } from '@globalfishingwatch/api-types'
import { getUTCDate } from '@globalfishingwatch/data-transforms'
import { useGetDeckLayers } from '@globalfishingwatch/deck-layer-composer'
import type { UserPointsTileLayer } from '@globalfishingwatch/deck-layers'
import type { ActivityTimeseriesFrame } from '@globalfishingwatch/timebar'
import { useTimebar } from '@globalfishingwatch/timebar'

import {
  selectRealTimeTimerange,
  selectTimebarUserDataviewsSelected,
} from 'features/_map/timebar/timebar.selectors'
import { selectViewport } from 'features/_map/workspace/selectors/app.viewport.selectors'
import { selectIsRealTimeMode } from 'features/_map/workspace/workspace.selectors'

import { getPointsFrames, getTimebarChunk } from './timebar-frames'

export const useTimebarPoints = () => {
  const [data, setData] = useState<ActivityTimeseriesFrame[]>([])
  const viewport = useSelector(selectViewport)
  const dataviews = useSelector(selectTimebarUserDataviewsSelected)
  const isRealTimeMode = useSelector(selectIsRealTimeMode)
  const realTimeTimerange = useSelector(selectRealTimeTimerange)
  const { start: rangeStart, end: rangeEnd } = useTimebar()
  const dataviewIds = useMemo(() => dataviews?.map(({ id }) => id), [dataviews])
  const userPointsLayers = useGetDeckLayers<UserPointsTileLayer>(dataviewIds)
  const start = getUTCDate(rangeStart).getTime()
  const end = getUTCDate(rangeEnd).getTime()

  const datasetImporting = dataviews?.some(
    (dv) => dv.datasets?.[0].status === DatasetStatus.Importing
  )

  const viewportChangeHash = useMemo(() => {
    if (!viewport) return ''
    return [viewport.zoom, viewport.latitude, viewport.longitude].map((v) => v.toFixed(2)).join(',')
  }, [viewport])

  const loaded = dataviews?.length
    ? userPointsLayers.every(({ instance }) => instance.isLoaded) && !datasetImporting
    : false

  const chunk = getTimebarChunk({ start, end, dataviews, isRealTimeMode, realTimeTimerange })
  const { interval, bufferedStart, bufferedEnd } = chunk

  const instanceCacheHash = useMemo(() => {
    if (!userPointsLayers[0]?.instance) return ''

    const { startTimeProperty, endTimeProperty, layers, timeFilterType } =
      userPointsLayers[0]?.instance?.props || {}
    const { filtersHash = '', aggregatedPropertyHash = '' } = userPointsLayers[0]?.instance || {}

    return `${bufferedStart}-${bufferedEnd}-${interval}-${startTimeProperty}-${endTimeProperty}-${layers.length}-${timeFilterType}-${filtersHash}-${aggregatedPropertyHash}`
  }, [userPointsLayers, bufferedStart, bufferedEnd, interval])

  const instance = useMemo(() => {
    return userPointsLayers[0]?.instance
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instanceCacheHash])

  useEffect(() => {
    if (loaded && instance) {
      setData(getPointsFrames(instance, chunk))
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, dataviewIds, viewportChangeHash, instance])

  return useMemo(() => ({ loading: !loaded, points: data, dataviews }), [data, loaded, dataviews])
}
