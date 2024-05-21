import { DateTime } from 'luxon'
import { ActivityTimeseriesFrame } from '@globalfishingwatch/timebar'
import { FourwingsFeature, FourwingsInterval } from '@globalfishingwatch/deck-loaders'
import { getUTCDateTime } from 'utils/dates'
import { FeaturesToTimeseriesParams } from 'features/reports/reports-timeseries.utils'
import { FourwingsAggregationOperation } from '../../../../libs/deck-layers/src/layers/fourwings'

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

type FeatureDates = Record<number, ActivityTimeseriesFrame & { count: number[] }>
function getDatesPopulated({
  start,
  end,
  interval,
  sublayerLength,
}: {
  start: number
  end: number
  interval: FourwingsInterval
  sublayerLength: number
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
    data[date] = { date, count: new Array(sublayerLength).fill(0) }
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

export function getGraphDataFromFourwingsFeatures(
  features: FourwingsFeature[],
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

  features.forEach((feature) => {
    const { dates, values } = feature.properties
    if (dates) {
      dates.forEach((sublayerDates, sublayerIndex) => {
        const valueArray = values[sublayerIndex]
        sublayerDates.forEach((sublayerDate, dateIndex) => {
          const sublayerDateData = data[sublayerDate]
          if (
            sublayerDateData &&
            (!minVisibleValue || valueArray[dateIndex] >= minVisibleValue) &&
            (!maxVisibleValue || valueArray[dateIndex] <= maxVisibleValue)
          ) {
            sublayerDateData[sublayerIndex] += valueArray[dateIndex]
            sublayerDateData.count[sublayerIndex]++
          }
        })
      })
    }
  })
  return Object.values(data).map(({ date, count, ...rest }) => {
    Object.keys(rest).forEach((key) => {
      if (aggregationOperation === FourwingsAggregationOperation.Avg) {
        const indexKey = parseInt(key)
        if (rest[indexKey]) {
          rest[indexKey] = rest[indexKey] / count[indexKey]
        }
      }
    })
    return { date, ...rest }
  })
}
