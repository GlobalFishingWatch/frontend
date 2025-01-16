import { DateTime } from 'luxon'

import { getDateInIntervalResolution } from '@globalfishingwatch/deck-layers'
import type {
  FourwingsFeature,
  FourwingsInterval,
  FourwingsPositionFeature,
  FourwingsValuesAndDatesFeature,
} from '@globalfishingwatch/deck-loaders'
import { CONFIG_BY_INTERVAL } from '@globalfishingwatch/deck-loaders'
import type { ActivityTimeseriesFrame } from '@globalfishingwatch/timebar'

import type { FeaturesToTimeseriesParams } from 'features/reports/shared/activity/reports-activity-timeseries.utils'
import { getUTCDateTime } from 'utils/dates'

type GetGraphDataFromFourwingsFeaturesParams = Pick<
  FeaturesToTimeseriesParams,
  | 'start'
  | 'end'
  | 'compareStart'
  | 'compareEnd'
  | 'interval'
  | 'sublayers'
  | 'aggregationOperation'
  | 'minVisibleValue'
  | 'maxVisibleValue'
>

type FeatureDates = Record<number, ActivityTimeseriesFrame & { count?: number[] }>
function getDatesPopulated({
  start,
  end,
  interval,
  sublayerLength,
  count = true,
}: {
  start: number
  end: number
  interval: FourwingsInterval
  sublayerLength: number
  count?: boolean
}): FeatureDates {
  const data = {} as FeatureDates
  const now = DateTime.now().toUTC().toMillis()
  let date = getUTCDateTime(start).toMillis()
  const endPlusOne = Math.min(
    getUTCDateTime(end)
      .plus({ [interval]: 1 })
      .toMillis(),
    now
  )
  while (date <= endPlusOne) {
    data[date] = { date }
    if (count) {
      data[date].count = Array(sublayerLength).fill(0)
    }
    for (let i = 0; i < sublayerLength; i++) {
      data[date][i] = 0
    }
    date = Math.min(
      getUTCDateTime(date)
        .plus({ [interval]: 1 })
        .toMillis(),
      now + 1
    )
  }
  return data
}

export function getGraphDataFromFourwingsPositions(
  features: FourwingsPositionFeature[],
  {
    start,
    end,
    interval,
    sublayers,
  }: Pick<GetGraphDataFromFourwingsFeaturesParams, 'start' | 'end' | 'interval' | 'sublayers'>
): ActivityTimeseriesFrame[] {
  if (!features?.length || !start || !end) {
    return []
  }
  const sublayerLength = sublayers.length
  const data = getDatesPopulated({ start, end, interval, sublayerLength, count: false })

  features.forEach((feature) => {
    const { htime, value, layer } = feature.properties
    if (htime && value) {
      const date = getDateInIntervalResolution(
        CONFIG_BY_INTERVAL['HOUR'].getIntervalTimestamp(htime),
        interval
      )
      if (!data[date]) {
        data[date] = { date }
      }
      data[date][layer] += value
    }
  })
  return Object.values(data)
}

export function getGraphDataFromFourwingsHeatmap(
  features: FourwingsFeature[] | FourwingsValuesAndDatesFeature[],
  {
    start,
    end,
    compareStart,
    compareEnd,
    interval,
    sublayers,
    aggregationOperation,
    minVisibleValue,
    maxVisibleValue,
  }: GetGraphDataFromFourwingsFeaturesParams
): ActivityTimeseriesFrame[] {
  if (!features?.length || !start || !end) {
    return []
  }

  const sublayerLength = sublayers.length
  const data = {
    ...getDatesPopulated({ start, end, interval, sublayerLength }),
    ...(compareStart &&
      compareEnd && {
        ...getDatesPopulated({ start: compareStart, end: compareEnd, interval, sublayerLength }),
      }),
  }

  const hasMinVisibleValue = minVisibleValue !== undefined
  const hasMaxVisibleValue = maxVisibleValue !== undefined

  const areFourwingsFeatures = (features as FourwingsFeature[]).some(
    (f) => f.properties !== undefined
  )

  if (areFourwingsFeatures) {
    ;(features as FourwingsFeature[]).forEach((feature) => {
      const { dates, values } = feature.properties
      if (dates) {
        dates.forEach((sublayerDates, sublayerIndex) => {
          const valueArray = values[sublayerIndex]
          if (hasMinVisibleValue || hasMaxVisibleValue) {
            sublayerDates.forEach((sublayerDate, dateIndex) => {
              const sublayerDateData = data[sublayerDate]
              if (
                sublayerDateData &&
                (!minVisibleValue || valueArray[dateIndex] >= minVisibleValue) &&
                (!maxVisibleValue || valueArray[dateIndex] <= maxVisibleValue)
              ) {
                sublayerDateData[sublayerIndex] += valueArray[dateIndex]
                sublayerDateData.count![sublayerIndex]++
              }
            })
          } else {
            sublayerDates.forEach((sublayerDate, dateIndex) => {
              const sublayerDateData = data[sublayerDate]
              if (sublayerDateData) {
                sublayerDateData[sublayerIndex] += valueArray[dateIndex]
                sublayerDateData.count![sublayerIndex]++
              }
            })
          }
        })
      }
    })
  } else {
    ;(features as FourwingsValuesAndDatesFeature[]).forEach((feature) => {
      for (let sublayerIndex = 0; sublayerIndex < feature.length; sublayerIndex++) {
        const sublayer = feature[sublayerIndex]
        const [values, dates] = sublayer || []
        if (dates) {
          if (hasMinVisibleValue || hasMaxVisibleValue) {
            for (let dateIndex = 0; dateIndex < dates.length; dateIndex++) {
              const sublayerDate = dates[dateIndex]
              const sublayerDateData = data[sublayerDate]
              if (
                sublayerDateData &&
                (!hasMinVisibleValue || values[dateIndex] >= minVisibleValue) &&
                (!hasMaxVisibleValue || values[dateIndex] <= maxVisibleValue)
              ) {
                sublayerDateData[sublayerIndex] += values[dateIndex]
                sublayerDateData.count![sublayerIndex]++
              }
            }
          } else {
            for (let dateIndex = 0; dateIndex < dates.length; dateIndex++) {
              const sublayerDate = dates[dateIndex]
              const sublayerDateData = data[sublayerDate]
              if (sublayerDateData) {
                sublayerDateData[sublayerIndex] += values[dateIndex]
                sublayerDateData.count![sublayerIndex]++
              }
            }
          }
        }
      }
    })
  }

  const timeseries = Object.values(data).map(({ date, count, ...rest }: any) => {
    Object.keys(rest).forEach((key) => {
      if (aggregationOperation === 'avg') {
        const indexKey = parseInt(key)
        if (count && rest[indexKey]) {
          rest[indexKey] = rest[indexKey] / count[indexKey]
        }
      }
    })
    return { date, ...rest }
  })

  // Inserts a middle point for every sublayer at the start and end of the dataset
  const extentStarts = sublayers
    .map((sublayer, index) => ({ extent: sublayer.extentStart, index }))
    .sort((a, b) => (a?.extent ?? 0) - (b?.extent ?? 0))
  const extentEnds = sublayers
    .map((sublayer, index) => ({ extent: sublayer.extentEnd, index }))
    .sort((a, b) => (a?.extent ?? 0) - (b?.extent ?? 0))

  extentStarts.forEach(({ extent, index }) => {
    if (extent) {
      const firstSublayerValueIndex = timeseries.findIndex((v) => v.date >= extent!) - 1
      if (firstSublayerValueIndex >= 0) {
        // Use the initial date as a new element with all values 0
        const initialStartDate = timeseries[firstSublayerValueIndex].date
        const startData = {
          ...timeseries[firstSublayerValueIndex],
          date: initialStartDate,
          [index]: 0,
        }
        timeseries.splice(firstSublayerValueIndex, 0, startData)
        // And replace the original first element with the dataset start extent
        timeseries[firstSublayerValueIndex + 1].date = extent
      }
    }
  })

  extentEnds.forEach(({ extent, index }) => {
    if (extent) {
      const lastSublayerValueIndex = timeseries.findLastIndex((frame) => frame[index] > 0)
      if (lastSublayerValueIndex >= 0) {
        const lastSublayerTime = timeseries[lastSublayerValueIndex]
        const nextIntervalDate = DateTime.fromMillis(lastSublayerTime.date, {
          zone: 'utc',
        })
          .plus({ [interval]: 1 })
          .toMillis()
        if (nextIntervalDate > extent) {
          timeseries.splice(lastSublayerValueIndex + 1, 0, {
            ...lastSublayerTime,
            date: extent,
            [index]: 0,
          })
        }
      }
    }
  })

  return timeseries.sort((a, b) => a.date - b.date)
}
