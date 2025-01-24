import { useMemo } from 'react'
import type { DurationUnit } from 'luxon'
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
  valueKey: keyof ResponsiveVisualizationData[0]
  aggregated?: boolean
}
export function useFullTimeseries({
  start,
  end,
  data,
  timeseriesInterval,
  dateKey,
  valueKey,
  aggregated = true,
}: UseFullTimeseriesProps) {
  return useMemo(() => {
    if (!data || !dateKey || !valueKey) {
      return []
    }
    const startMillis = getUTCDateTime(start).toMillis()
    const endMillis = getUTCDateTime(end).toMillis()

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
        const dataValue = data.find((item) =>
          d?.startsWith(item[dateKey as keyof typeof item] as any)
        )?.[valueKey]
        return {
          [dateKey]: d,
          [valueKey]: dataValue ? dataValue : aggregated ? 0 : [],
        }
      })
  }, [aggregated, data, dateKey, end, start, timeseriesInterval, valueKey])
}
