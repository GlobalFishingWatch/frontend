import type { DurationUnit } from 'luxon'
import { DateTime, Duration } from 'luxon'
import type { FourwingsInterval } from '@globalfishingwatch/deck-loaders'
import {
  COLUMN_PADDING,
  DEFAULT_POINT_SIZE,
  AXIS_LABEL_PADDING,
  COLUMN_LABEL_SIZE,
  TIMESERIES_PADDING,
  MAX_INDIVIDUAL_ITEMS,
  POINT_GAP,
  POINT_SIZES,
} from '../charts/config'
import type { ResponsiveVisualizationData, ResponsiveVisualizationValue } from '../types'

export const getItemValue = (value: ResponsiveVisualizationValue) => {
  if (typeof value === 'number') {
    return value
  }
  return value.value
}

export const getBarProps = (
  data: ResponsiveVisualizationData,
  width: number,
  pointSize: number
): { columnsNumber: number; columnsWidth: number; pointsByRow: number } => {
  const columnsNumber = data.length
  const columnsWidth = width / columnsNumber - COLUMN_PADDING * 2
  const pointsByRow = Math.floor(columnsWidth / (pointSize + POINT_GAP))

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
  return data.reduce<ColumnsStats>(
    (acc, column) => {
      const value: number = column[aggregatedValueKey]
        ? getItemValue(column[aggregatedValueKey] as ResponsiveVisualizationValue)
        : (column[individualValueKey] as ResponsiveVisualizationValue[])?.length || 0
      return { total: acc.total + value, max: Math.max(acc.max, value) }
    },
    { total: 0, max: 0 }
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
type IsIndividualSupportedResult = {
  isSupported: boolean
  individualItemSize?: number
}
export function getIsIndividualBarChartSupported({
  data,
  width,
  height,
  aggregatedValueKey,
  individualValueKey,
}: IsIndividualSupportedParams): IsIndividualSupportedResult {
  const { total, max } = getColumnsStats(data, aggregatedValueKey, individualValueKey)
  if (total > MAX_INDIVIDUAL_ITEMS) {
    return { isSupported: false }
  }
  const individualItemSize = POINT_SIZES.find((pointSize) => {
    const { pointsByRow } = getBarProps(data, width, pointSize)
    const rowsInBiggestColumn = Math.ceil(max / pointsByRow)
    const heightNeeded = rowsInBiggestColumn * (pointSize + POINT_GAP)
    return heightNeeded < height - AXIS_LABEL_PADDING - COLUMN_PADDING - COLUMN_LABEL_SIZE
  })
  return { isSupported: individualItemSize !== undefined, individualItemSize }
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
}: IsIndividualSupportedParams): IsIndividualSupportedResult {
  const { total, max } = getColumnsStats(data, aggregatedValueKey, individualValueKey)
  if (total > MAX_INDIVIDUAL_ITEMS) {
    return { isSupported: false }
  }
  const heightNeeded = max * (DEFAULT_POINT_SIZE + POINT_GAP)
  const matchesHeight = heightNeeded < height - AXIS_LABEL_PADDING
  if (!matchesHeight) {
    return { isSupported: false }
  }
  if (start && end && timeseriesInterval) {
    const startMillis = DateTime.fromISO(start).toMillis()
    const endMillis = DateTime.fromISO(end).toMillis()
    const intervalDiff = Math.floor(
      Duration.fromMillis(endMillis - startMillis).as(
        timeseriesInterval.toLowerCase() as DurationUnit
      )
    )
    return { isSupported: intervalDiff * DEFAULT_POINT_SIZE <= width - TIMESERIES_PADDING * 2 }
  }
  return { isSupported: true }
}
