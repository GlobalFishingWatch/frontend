import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import { DatasetStatus } from '@globalfishingwatch/api-types'
import { getUTCDate } from '@globalfishingwatch/data-transforms'
import {
  getAvailableIntervalsInDataviews,
  useGetDeckLayers,
} from '@globalfishingwatch/deck-layer-composer'
import type { UserPointsTileLayer } from '@globalfishingwatch/deck-layers'
import { getFeatureTimeRange, getFourwingsChunk } from '@globalfishingwatch/deck-layers'
import type { FourwingsPointFeature } from '@globalfishingwatch/deck-loaders'
import type { ActivityTimeseriesFrame } from '@globalfishingwatch/timebar'

import { selectViewport } from 'features/app/selectors/app.viewport.selectors'
import type { PointsFeaturesToTimeseriesParams } from 'features/reports/tabs/others/reports-points-timeseries.utils'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { selectTimebarUserDataviewsSelected } from 'features/timebar/timebar.selectors'

import { getGraphDataFromPoints } from './timebar.utils'

const EMPTY_ACTIVITY_DATA = [] as ActivityTimeseriesFrame[]

export const useTimebarPoints = () => {
  const [data, setData] = useState<ActivityTimeseriesFrame[]>([])
  const viewport = useSelector(selectViewport)
  const dataviews = useSelector(selectTimebarUserDataviewsSelected)
  const timerange = useTimerangeConnect()
  const dataviewIds = useMemo(() => dataviews?.map(({ id }) => id), [dataviews])
  const userPointsLayers = useGetDeckLayers<UserPointsTileLayer>(dataviewIds)
  const start = getUTCDate(timerange.start).getTime()
  const end = getUTCDate(timerange.end).getTime()

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

  const availableIntervals = getAvailableIntervalsInDataviews(dataviews)
  const { interval, bufferedStart, bufferedEnd } = getFourwingsChunk({
    start,
    end,
    availableIntervals,
  })

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

  const setFourwingsPointsData = useCallback(
    async (data: FourwingsPointFeature[], params: PointsFeaturesToTimeseriesParams) => {
      const {
        start,
        end,
        sublayers,
        startTimeProperty,
        endTimeProperty,
        interval,
        timeFilterType,
      } = params

      const perfStart = performance.now()
      const result =
        getGraphDataFromPoints(data, {
          start: start,
          end: end,
          interval: interval || 'MONTH',
          sublayersLength: sublayers.length,
          startTimeProperty: startTimeProperty,
          endTimeProperty: endTimeProperty,
          timeFilterType: timeFilterType,
        }) || EMPTY_ACTIVITY_DATA
      const perfEnd = performance.now()
      console.log(
        `⏱️ getGraphDataFromPoints took ${(perfEnd - perfStart).toFixed(2)}ms for ${data.length} features`
      )
      setData(result)
    },
    []
  )

  useEffect(() => {
    if (loaded && instance) {
      const { startTimeProperty, endTimeProperty, layers, timeFilterType } = instance?.props || {}
      const viewportData =
        (instance?.getViewportData?.({ skipTemporalFilter: true }) as FourwingsPointFeature[]) || []

      const params = {
        startTimeProperty: startTimeProperty,
        endTimeProperty,
        sublayers: layers.flatMap((l) => l.sublayers) || [],
        start: bufferedStart,
        end: bufferedEnd,
        interval: interval || 'MONTH',
        timeFilterType: timeFilterType,
      } as PointsFeaturesToTimeseriesParams

      setFourwingsPointsData(viewportData, params)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, dataviewIds, viewportChangeHash, instance])

  return useMemo(() => ({ loading: !loaded, points: data, dataviews }), [data, loaded, dataviews])
}
