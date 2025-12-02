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

  const instances = useMemo(() => {
    return userPointsLayers?.map(({ instance }) => instance)
  }, [userPointsLayers])

  const setFourwingsPointsData = useCallback(
    async (
      instancesData: { data: FourwingsPointFeature[]; params: PointsFeaturesToTimeseriesParams }[]
    ) => {
      const allTimeseriesData = instancesData.map(({ data: viewportData, params }) => {
        const {
          start,
          end,
          sublayers,
          startTimeProperty,
          endTimeProperty,
          interval,
          timeFilterType,
        } = params

        return getGraphDataFromPoints(viewportData, {
          start: start,
          end: end,
          interval: interval || 'MONTH',
          sublayersLength: sublayers.length,
          startTimeProperty: startTimeProperty,
          endTimeProperty: endTimeProperty,
          timeFilterType: timeFilterType,
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

      const data = Object.values(mergedData).sort((a, b) => a.date - b.date) || EMPTY_ACTIVITY_DATA
      setData(data)
    },
    []
  )

  useEffect(() => {
    if (loaded && instances.length > 0) {
      const instancesData = instances.map((instance) => {
        const { startTimeProperty, endTimeProperty, layers, timeFilterType } = instance?.props || {}

        const availableIntervals = getAvailableIntervalsInDataviews(dataviews)
        const { interval } = getFourwingsChunk({ start, end, availableIntervals })

        let featureStartTime: number = Infinity
        let featureEndTime: number = -Infinity

        const viewportData =
          instance?.getViewportData?.({ skipTemporalFilter: true }).map((feature) => {
            const { featureStart, featureEnd } = getFeatureTimeRange(feature, {
              startTimeProperty: startTimeProperty || '',
              endTimeProperty: endTimeProperty || '',
              timeFilterType,
            })
            featureStartTime = Math.min(featureStartTime, featureStart)
            featureEndTime = Math.max(featureEndTime, featureEnd)

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
            start: featureStartTime,
            end: featureEndTime,
            interval: interval || 'MONTH',
            timeFilterType: timeFilterType,
          } as PointsFeaturesToTimeseriesParams,
        }
      })

      setFourwingsPointsData(instancesData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, instances, dataviewIds, viewportChangeHash])

  return useMemo(() => ({ loading: !loaded, points: data, dataviews }), [data, loaded, dataviews])
}
