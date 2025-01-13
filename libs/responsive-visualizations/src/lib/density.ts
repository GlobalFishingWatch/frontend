import type { DurationUnit } from 'luxon'
import { DateTime, Duration } from 'luxon'
import type { FourwingsInterval } from '@globalfishingwatch/deck-loaders'
import type { ResponsiveVisualizationAnyItemKey } from '../charts'
import {
  COLUMN_PADDING,
  POINT_SIZE,
  AXIS_LABEL_PADDING,
  COLUMN_LABEL_SIZE,
  TIMESERIES_PADDING,
} from '../charts/config'
import type {
  ResponsiveVisualizationAggregatedItem,
  ResponsiveVisualizationData,
  ResponsiveVisualizationIndividualItem,
} from '../types'

export const getBarProps = (
  data: ResponsiveVisualizationData,
  width: number
): { columnsNumber: number; columnsWidth: number; pointsByRow: number } => {
  const columnsNumber = data.length
  const columnsWidth = width / columnsNumber - COLUMN_PADDING * 2
  const pointsByRow = Math.floor(columnsWidth / POINT_SIZE)

  return { columnsNumber, columnsWidth, pointsByRow }
}

export const getBiggestColumnValue = (
  data: ResponsiveVisualizationData,
  aggregatedValueKey: ResponsiveVisualizationAnyItemKey,
  individualValueKey: ResponsiveVisualizationAnyItemKey
): number => {
  return data.reduce((acc, column) => {
    const value = (column as ResponsiveVisualizationIndividualItem)[aggregatedValueKey]
      ? (column as ResponsiveVisualizationIndividualItem)[aggregatedValueKey]
      : (column as ResponsiveVisualizationAggregatedItem)[individualValueKey]?.length || 0
    if (value > acc) {
      return value
    }
    return acc
  }, 0)
}

type IsIndividualSupportedParams = {
  data: ResponsiveVisualizationData
  width: number
  height: number
  aggregatedValueKey: ResponsiveVisualizationAnyItemKey
  individualValueKey: ResponsiveVisualizationAnyItemKey
}
export function getIsIndividualBarChartSupported({
  data,
  width,
  height,
  aggregatedValueKey,
  individualValueKey,
}: IsIndividualSupportedParams): boolean {
  const { pointsByRow } = getBarProps(data, width)
  const biggestColumnValue = getBiggestColumnValue(data, aggregatedValueKey, individualValueKey)
  const rowsInBiggestColumn = Math.ceil(biggestColumnValue / pointsByRow)
  const heightNeeded = rowsInBiggestColumn * POINT_SIZE
  return heightNeeded < height - AXIS_LABEL_PADDING - COLUMN_PADDING - COLUMN_LABEL_SIZE
}

type getIsIndividualTimeseriesSupportedParams = {
  data: ResponsiveVisualizationData
  start?: string
  end?: string
  timeseriesInterval?: FourwingsInterval
  width: number
  height: number
  aggregatedValueKey: string
  individualValueKey: string
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
}: getIsIndividualTimeseriesSupportedParams): boolean {
  const biggestColumnValue = getBiggestColumnValue(data, aggregatedValueKey, individualValueKey)
  const heightNeeded = biggestColumnValue * POINT_SIZE
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
