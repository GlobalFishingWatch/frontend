import { DateTime } from 'luxon'
import { ActivityTimeseriesFrame } from '@globalfishingwatch/timebar'
import {
  CONFIG_BY_INTERVAL,
  FourwingsFeature,
  FourwingsInterval,
  FourwingsPositionFeature,
} from '@globalfishingwatch/deck-loaders'
import {
  FourwingsAggregationOperation,
  getDateInIntervalResolution,
} from '@globalfishingwatch/deck-layers'
import { getUTCDateTime } from 'utils/dates'
import { FeaturesToTimeseriesParams } from 'features/reports/reports-timeseries.utils'

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
      const date = getDateInIntervalResolution(CONFIG_BY_INTERVAL['HOUR'].getTime(htime), interval)
      if (!data[date]) {
        data[date] = { date }
      }
      data[date][layer] += value
    }
  })
  return Object.values(data)
}

export function getGraphDataFromFourwingsHeatmap(
  features: [number[], number[]][][],
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
  features.forEach((feature) => {
    for (let sublayerIndex = 0; sublayerIndex < feature.length; sublayerIndex++) {
      const sublayer = feature[sublayerIndex]
      const [values, dates] = sublayer
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

  return Object.values(data).map(({ date, count, ...rest }: any) => {
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
}
