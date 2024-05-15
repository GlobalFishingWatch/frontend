import { DateTime } from 'luxon'
import { ActivityTimeseriesFrame } from '@globalfishingwatch/timebar'
import { FourwingsFeature, FourwingsInterval } from '@globalfishingwatch/deck-loaders'
import { getUTCDateTime } from 'utils/dates'
import { FeaturesToTimeseriesParams } from 'features/reports/reports-timeseries.utils'

type GetGraphDataFromFourwingsFeaturesParams = Pick<
  FeaturesToTimeseriesParams,
  'start' | 'end' | 'compareStart' | 'compareEnd' | 'interval' | 'sublayers'
>

type FeatureDates = Record<number, ActivityTimeseriesFrame>
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
    data[date] = { date }
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

// TODO:deck choose a better naming for this as also used in reports
// TODO:deck support
// - [] aggregationOperation
// - [] min and maxVisibleValues
export function getGraphDataFromFourwingsFeatures(
  features: FourwingsFeature[],
  {
    start,
    end,
    compareStart,
    compareEnd,
    interval,
    sublayers,
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

  for (const feature of features) {
    const { dates, values } = feature.properties
    if (dates) {
      dates.forEach((sublayerDates, sublayerIndex) => {
        sublayerDates.forEach((sublayerDate, dateIndex) => {
          if (data[sublayerDate]) {
            data[sublayerDate][sublayerIndex] += values[sublayerIndex][dateIndex]
          }
        })
      })
    }
  }

  return Object.values(data)
}
