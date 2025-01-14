import type { DurationUnit } from 'luxon'
import { DateTime, Duration } from 'luxon'
import type { FourwingsInterval } from '@globalfishingwatch/deck-loaders'
import {
  COLUMN_PADDING,
  POINT_SIZE,
  AXIS_LABEL_PADDING,
  COLUMN_LABEL_SIZE,
  TIMESERIES_PADDING,
  MAX_INDIVIDUAL_ITEMS,
} from '../charts/config'
import type { ResponsiveVisualizationData } from '../types'

export const getBarProps = (
  data: ResponsiveVisualizationData,
  width: number
): { columnsNumber: number; columnsWidth: number; pointsByRow: number } => {
  const columnsNumber = data.length
  const columnsWidth = width / columnsNumber - COLUMN_PADDING * 2
  const pointsByRow = Math.floor(columnsWidth / POINT_SIZE)

  return { columnsNumber, columnsWidth, pointsByRow }
}

type ColumnsStats = {
  total: number
  max: number
}
export const getColumnsStats = (
  data: ResponsiveVisualizationData,
  aggregatedValueKey: keyof ResponsiveVisualizationData<'aggregated'>[0],
  individualValueKey: keyof ResponsiveVisualizationData<'individual'>[0]
): ColumnsStats => {
  return data.reduce(
    (acc, column) => {
      const value = (
        column[aggregatedValueKey as keyof typeof column]
          ? column[aggregatedValueKey as keyof typeof column]
          : column[individualValueKey as keyof typeof column]?.length || 0
      ) as number
      return { total: acc.total + value, max: Math.max(acc.max, value) }
    },
    { total: 0, max: 0 } as ColumnsStats
  )
}

export type IsIndividualSupportedParams = {
  data: ResponsiveVisualizationData
  start?: string
  end?: string
  timeseriesInterval?: FourwingsInterval
  width: number
  height: number
  aggregatedValueKey: keyof ResponsiveVisualizationData<'aggregated'>[0]
  individualValueKey: keyof ResponsiveVisualizationData<'individual'>[0]
}
export function getIsIndividualBarChartSupported({
  data,
  width,
  height,
  aggregatedValueKey,
  individualValueKey,
}: IsIndividualSupportedParams): boolean {
  const { total, max } = getColumnsStats(data, aggregatedValueKey, individualValueKey)
  if (total > MAX_INDIVIDUAL_ITEMS) {
    return false
  }
  const { pointsByRow } = getBarProps(data, width)
  const rowsInBiggestColumn = Math.ceil(max / pointsByRow)
  const heightNeeded = rowsInBiggestColumn * POINT_SIZE
  return heightNeeded < height - AXIS_LABEL_PADDING - COLUMN_PADDING - COLUMN_LABEL_SIZE
}

export function getIsIndividualTimeseriesSupported({
  data,
  width,
  height,
  start,
  end,
  timeseriesInterval,
  aggregatedValueKey,
  individualValueKey,
}: IsIndividualSupportedParams): boolean {
  const { total, max } = getColumnsStats(data, aggregatedValueKey, individualValueKey)
  if (total > MAX_INDIVIDUAL_ITEMS) {
    return false
  }
  const heightNeeded = max * POINT_SIZE
  const matchesHeight = heightNeeded < height - AXIS_LABEL_PADDING
  if (!matchesHeight) {
    return false
  }
  if (start && end && timeseriesInterval) {
    const startMillis = DateTime.fromISO(start).toMillis()
    const endMillis = DateTime.fromISO(end).toMillis()
    const intervalDiff = Math.floor(
      Duration.fromMillis(endMillis - startMillis).as(
        timeseriesInterval.toLowerCase() as DurationUnit
      )
    )
    return intervalDiff * POINT_SIZE <= width - TIMESERIES_PADDING * 2
  }
  return true
}
