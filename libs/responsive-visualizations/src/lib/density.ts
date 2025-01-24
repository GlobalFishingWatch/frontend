import type { DurationUnit } from 'luxon'
import { DateTime, Duration } from 'luxon'

import type { FourwingsInterval } from '@globalfishingwatch/deck-loaders'

import {
  AXIS_LABEL_PADDING,
  COLUMN_LABEL_SIZE,
  COLUMN_PADDING,
  DEFAULT_POINT_SIZE,
  MAX_INDIVIDUAL_ITEMS,
  POINT_GAP,
  POINT_SIZES,
  TIMESERIES_PADDING,
} from '../charts/config'
import type {
  ResponsiveVisualizationAggregatedValueKey,
  ResponsiveVisualizationIndividualValueKey,
} from '../charts/types'
import type {
  ResponsiveVisualizationData,
  ResponsiveVisualizationLabel,
  ResponsiveVisualizationValue,
} from '../types'

export const getResponsiveVisualizationItemValue = (
  value: ResponsiveVisualizationValue | ResponsiveVisualizationLabel
): number => {
  if (typeof value === 'string') {
    return parseFloat(value)
  }
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
  aggregatedValueKeys: ResponsiveVisualizationAggregatedValueKey[],
  individualValueKey: ResponsiveVisualizationIndividualValueKey
): ColumnsStats => {
  return data.reduce<ColumnsStats>(
    (acc, column) => {
      const useAggregatedValue = aggregatedValueKeys.every((key) => column[key] !== undefined)
      let value = 0
      if (useAggregatedValue) {
        value = aggregatedValueKeys.reduce((acc, key) => {
          const v = getResponsiveVisualizationItemValue(column[key])
          return acc + v
        }, 0)
      } else {
        value = (column[individualValueKey] as ResponsiveVisualizationValue[])?.length || 0
      }
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
  aggregatedValueKeys: ResponsiveVisualizationAggregatedValueKey[]
  individualValueKey: ResponsiveVisualizationIndividualValueKey
}
type IsIndividualSupportedResult = {
  isSupported: boolean
  individualItemSize?: number
}
export function getIsIndividualBarChartSupported({
  data,
  width,
  height,
  aggregatedValueKeys,
  individualValueKey,
}: IsIndividualSupportedParams): IsIndividualSupportedResult {
  const { total, max } = getColumnsStats(data, aggregatedValueKeys, individualValueKey)
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
  aggregatedValueKeys,
  individualValueKey,
}: IsIndividualSupportedParams): IsIndividualSupportedResult {
  const { total, max } = getColumnsStats(data, aggregatedValueKeys, individualValueKey)
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
