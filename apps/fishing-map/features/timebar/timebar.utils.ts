import { DateTime } from 'luxon'
import { ActivityTimeseriesFrame } from '@globalfishingwatch/timebar'
import { FourwingsFeature, FourwingsInterval } from '@globalfishingwatch/deck-loaders'
import { getUTCDateTime } from 'utils/dates'

type GetGraphDataFromFourwingsFeaturesParams = {
  start: number
  end: number
  interval: FourwingsInterval
  sublayers: number
}

// TODO:deck choose a better naming for this as also used in reports
// TODO:deck support
// - [] aggregationOperation
// - [] min and maxVisibleValues
export function getGraphDataFromFourwingsFeatures(
  features: FourwingsFeature[],
  { start, end, interval, sublayers }: GetGraphDataFromFourwingsFeaturesParams
): ActivityTimeseriesFrame[] {
  if (!features?.length || !start || !end) {
    return []
  }
  const data: Record<number, ActivityTimeseriesFrame> = {}
  let date = getUTCDateTime(start).toMillis()
  const now = DateTime.now().toUTC().toMillis()
  const endPlusOne = Math.min(
    getUTCDateTime(end)
      .plus({ [interval]: 1 })
      .toMillis(),
    now
  )
  while (date <= endPlusOne) {
    data[date] = { date }
    for (let i = 0; i < sublayers; i++) {
      data[date][i] = 0
    }
    date = Math.min(
      getUTCDateTime(date)
        .plus({ [interval]: 1 })
        .toMillis(),
      now + 1
    )
  }
  for (const feature of features) {
    const { dates, values } = feature.properties
    if (dates) {
      dates.forEach((sublayerDates, sublayerIndex) => {
        sublayerDates.forEach((date, dateIndex) => {
          if (data[date]) {
            data[date][sublayerIndex] += values[sublayerIndex][dateIndex]
          }
        })
      })
    }
  }
  return Object.values(data)
}
