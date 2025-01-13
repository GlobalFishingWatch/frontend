import type { DurationUnit } from 'luxon'
import { DateTime, Duration } from 'luxon'
import { useMemo } from 'react'
import type { FourwingsInterval } from '@globalfishingwatch/deck-loaders'
import type { ResponsiveVisualizationData } from '../../types'
import type { ResponsiveVisualizationAnyItemKey } from '../types'

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
      const cleanEnd = DateTime.fromISO(end, { zone: 'utc' })
        .minus({ [timeseriesInterval]: 1 })
        .toISO() as string
      return [new Date(start).getTime(), new Date(cleanEnd).getTime()]
    }
    return []
  }, [start, end, timeseriesInterval])
}

type UseFullTimeseriesProps = {
  start: string
  end: string
  data: ResponsiveVisualizationData
  timeseriesInterval: FourwingsInterval
  dateKey: ResponsiveVisualizationAnyItemKey
  valueKey: ResponsiveVisualizationAnyItemKey
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
    if (!data) {
      return []
    }

    const startMillis = DateTime.fromISO(start).toMillis()
    const endMillis = DateTime.fromISO(end).toMillis()

    const intervalDiff = Math.floor(
      Duration.fromMillis(endMillis - startMillis).as(
        timeseriesInterval.toLowerCase() as DurationUnit
      )
    )

    return Array(intervalDiff)
      .fill(0)
      .map((_, i) => {
        const d = DateTime.fromMillis(startMillis, { zone: 'UTC' })
          .plus({ [timeseriesInterval]: i })
          .toISO()
        const dataValue = data.find((item) => d?.startsWith(item[dateKey]))?.[valueKey]
        return {
          [dateKey]: d,
          [valueKey]: dataValue ? dataValue : aggregated ? 0 : [],
        }
      })
  }, [aggregated, data, dateKey, end, start, timeseriesInterval, valueKey])
}
