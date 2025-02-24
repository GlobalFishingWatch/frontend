import { useMemo } from 'react'
import type { DateTimeUnit, DurationUnit } from 'luxon'
import { Duration } from 'luxon'

import { getUTCDateTime } from '@globalfishingwatch/data-transforms/dates'
import type { FourwingsInterval } from '@globalfishingwatch/deck-loaders'

import type { ResponsiveVisualizationData } from '../../types'

export function useTimeseriesDomain({
  start,
  end,
  timeseriesInterval,
}: {
  start: string
  end: string
  timeseriesInterval: FourwingsInterval
}) {
  return useMemo(() => {
    if (start && end && timeseriesInterval) {
      const cleanEnd = getUTCDateTime(end)
        .minus({ [timeseriesInterval]: 1 })
        .toMillis() as number
      return [getUTCDateTime(end).toMillis(), cleanEnd]
    }
    return []
  }, [start, end, timeseriesInterval])
}

type UseFullTimeseriesProps = {
  start: string
  end: string
  data: ResponsiveVisualizationData
  timeseriesInterval: FourwingsInterval
  dateKey: keyof ResponsiveVisualizationData[0]
  valueKeys: (keyof ResponsiveVisualizationData[0])[]
  aggregated?: boolean
}

export function useFullTimeseries({
  start,
  end,
  data,
  timeseriesInterval,
  dateKey,
  valueKeys,
  aggregated = true,
}: UseFullTimeseriesProps) {
  return useMemo(() => {
    if (!data || !dateKey || !valueKeys?.length) {
      return []
    }
    const startMillis = getUTCDateTime(start)
      .startOf(timeseriesInterval.toLowerCase() as DateTimeUnit)
      .toMillis()
    const endMillis = getUTCDateTime(end)
      .endOf(timeseriesInterval.toLowerCase() as DateTimeUnit)
      .toMillis()

    const intervalDiff = Math.floor(
      Duration.fromMillis(endMillis - startMillis).as(
        timeseriesInterval.toLowerCase() as DurationUnit
      )
    )

    return Array(intervalDiff)
      .fill(0)
      .map((_, i) => {
        const d = getUTCDateTime(startMillis)
          .plus({ [timeseriesInterval]: i })
          .toISO()
        const values = Object.fromEntries(
          valueKeys.map((valueKey) => {
            const dataValue = data.find((item) =>
              d?.startsWith(item[dateKey as keyof typeof item] as any)
            )?.[valueKey]
            const fallbackValue = typeof dataValue === 'number' ? 0 : { value: 0 }
            return [valueKey, dataValue ? dataValue : aggregated ? fallbackValue : []]
          })
        )
        return {
          [dateKey]: d,
          ...values,
        }
      })
  }, [aggregated, data, dateKey, end, start, timeseriesInterval, valueKeys])
}
