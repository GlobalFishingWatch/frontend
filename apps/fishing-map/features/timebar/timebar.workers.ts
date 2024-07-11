// eslint-disable-next-line import/no-webpack-loader-syntax
// import worker from 'workerize-loader!./timebar.utils'
// const worker = new Worker(new URL('./timebar.utils', import.meta.url))
// import { getGraphDataFromFourwingsHeatmap } from './timebar.utils'

import { DateTime } from 'luxon'

export const getUTCDateTime = (d: any) => {
  if (!d || (typeof d !== 'string' && typeof d !== 'number' && typeof d !== 'object')) {
    console.warn('Not a valid date', typeof d, d)
    return DateTime.utc()
  }
  if (typeof d === 'object') {
    try {
      return DateTime.fromJSDate(d, { zone: 'utc' })
    } catch (error) {
      console.warn('Not a valid date', typeof d, d)
      return DateTime.utc()
    }
  }
  if (typeof d === 'string') {
    return DateTime.fromISO(d, { zone: 'utc' })
  }
  return DateTime.fromMillis(d, { zone: 'utc' })
}

type FeatureDates = Record<number, any & { count?: number[] }>
function getDatesPopulated({
  start,
  end,
  interval,
  sublayerLength,
  count = true,
}: {
  start: number
  end: number
  interval: any
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
  } = {} as any
): any[] {
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
              values[dateIndex] >= minVisibleValue &&
              values[dateIndex] <= maxVisibleValue
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

// eslint-disable-next-line no-restricted-globals
addEventListener('message', (event: MessageEvent<{ data: any; params: any }>) => {
  postMessage(getGraphDataFromFourwingsHeatmap(event.data.data, event.data.params))
})
