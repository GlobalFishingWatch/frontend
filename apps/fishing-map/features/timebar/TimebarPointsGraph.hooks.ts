import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import { DatasetStatus } from '@globalfishingwatch/api-types'
import { getUTCDate } from '@globalfishingwatch/data-transforms'
import {
  getAvailableIntervalsInDataviews,
  useGetDeckLayers,
} from '@globalfishingwatch/deck-layer-composer'
import type { UserPointsTileLayer } from '@globalfishingwatch/deck-layers'
import { getFourwingsChunk } from '@globalfishingwatch/deck-layers'
import type { FourwingsPointFeature } from '@globalfishingwatch/deck-loaders'
import type { ActivityTimeseriesFrame } from '@globalfishingwatch/timebar'

import { selectViewport } from 'features/app/selectors/app.viewport.selectors'
import { selectActiveUserPointsDataviews } from 'features/dataviews/selectors/dataviews.categories.selectors'
import type { PointsFeaturesToTimeseriesParams } from 'features/reports/tabs/others/reports-points-timeseries.utils'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'

import { getGraphDataFromPoints } from './timebar.utils'

const EMPTY_ACTIVITY_DATA = [] as ActivityTimeseriesFrame[]

export const useTimebarPoints = () => {
  const [data, setData] = useState<ActivityTimeseriesFrame[]>([])
  const [filteredDataviews, setFilteredDataviews] = useState<typeof dataviews>([])
  const viewport = useSelector(selectViewport)
  const dataviews = useSelector(selectActiveUserPointsDataviews)
  const timerange = useTimerangeConnect()
  const dataviewIds = useMemo(() => dataviews?.map(({ id }) => id), [dataviews])
  const userPointsLayers = useGetDeckLayers<UserPointsTileLayer>(dataviewIds)

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

  const instances = useMemo(() => {
    return userPointsLayers?.map(({ instance }) => instance)
  }, [userPointsLayers])

  const setFourwingsPositionsData = useCallback(
    async (
      instancesData: { data: FourwingsPointFeature[]; params: PointsFeaturesToTimeseriesParams }[]
    ) => {
      const allTimeseriesData = instancesData.map(({ data: viewportData, params }) => {
        const { start, end, sublayers, startTimeProperty, endTimeProperty, interval } = params
        return getGraphDataFromPoints(viewportData, {
          start: start,
          end: end,
          interval: interval || 'MONTH',
          sublayersLength: sublayers.length,
          startTimeProperty: startTimeProperty,
          endTimeProperty: endTimeProperty,
        })
      })

      const mergedData: Record<number, ActivityTimeseriesFrame> = {}
      const instancesWithData = new Set<number>()

      allTimeseriesData.forEach((timeseries, instanceIndex) => {
        timeseries?.forEach((frame) => {
          const frameDate = frame.date
          const existingDate = Object.keys(mergedData).find((dateKey) => {
            const existingTimestamp = parseInt(dateKey)
            return Math.abs(existingTimestamp - frameDate) <= 1000
          })

          const targetDate = existingDate ? parseInt(existingDate) : frameDate

          if (!mergedData[targetDate]) {
            mergedData[targetDate] = { date: targetDate }
          }
          const value = frame[0] || 0
          mergedData[targetDate][instanceIndex] = value

          if (value > 0) {
            instancesWithData.add(instanceIndex)
          }
        })
      })

      setFilteredDataviews(dataviews.filter((_, index) => instancesWithData.has(index)))

      const data = Object.values(mergedData).sort((a, b) => a.date - b.date) || EMPTY_ACTIVITY_DATA
      setData(data)
    },
    [dataviews]
  )

  useEffect(() => {
    if (loaded && instances.length > 0) {
      const instancesData = instances.map((instance) => {
        const { startTime, endTime, startTimeProperty, endTimeProperty, layers } =
          instance?.props || {}
        const allAvailableIntervals = getAvailableIntervalsInDataviews(dataviews)
        const { interval } = getFourwingsChunk(
          startTime || getUTCDate(timerange.start).getTime(),
          endTime || getUTCDate(timerange.end).getTime(),
          allAvailableIntervals
        )

        const viewportData =
          instance?.getViewportData?.().map((feature) => {
            return {
              ...feature,
              properties: {
                ...feature.properties,
                layer: 0,
              } as any,
            } as FourwingsPointFeature
          }) || []

        return {
          data: viewportData,
          params: {
            startTimeProperty: startTimeProperty,
            endTimeProperty,
            sublayers: layers.flatMap((l) => l.sublayers) || [],
            start: startTime,
            end: endTime,
            interval: interval || 'MONTH',
          } as PointsFeaturesToTimeseriesParams,
        }
      })

      setFourwingsPositionsData(instancesData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, instances, dataviewIds, viewportChangeHash])

  return useMemo(
    () => ({ loading: !loaded, points: data, dataviews: filteredDataviews }),
    [data, loaded, filteredDataviews]
  )
}
