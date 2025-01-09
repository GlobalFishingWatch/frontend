import type {
  ResponsiveVisualizationAggregatedItem,
  ResponsiveVisualizationData,
  ResponsiveVisualizationIndividualItem,
} from '../types'

const COLUMN_LABEL_SIZE = 10
const COLUMN_PADDING = 10
// Comment this is the sum of .point size + .bar flex gap
const POINT_WIDTH = 15
const AXIX_LABEL_PADDING = 40

export const getBarProps = (
  data: ResponsiveVisualizationData,
  width: number
): { columnsNumber: number; columnsWidth: number; pointsByRow: number } => {
  const columnsNumber = data.length
  const columnsWidth = width / columnsNumber - COLUMN_PADDING * 2
  const pointsByRow = Math.floor(columnsWidth / POINT_WIDTH)

  return { columnsNumber, columnsWidth, pointsByRow }
}

type IsIndividualSupportedParams = {
  data: ResponsiveVisualizationData
  width: number
  height: number
  aggregatedValueKey: string
  individualValueKey: string
}
export function getIsIndividualBarChartSupported({
  data,
  width,
  height,
  aggregatedValueKey,
  individualValueKey,
}: IsIndividualSupportedParams): boolean {
  const { pointsByRow } = getBarProps(data, width)
  const biggestColumnValue = data.reduce((acc, column) => {
    const value = (column as ResponsiveVisualizationIndividualItem)[aggregatedValueKey]
      ? (column as ResponsiveVisualizationIndividualItem)[aggregatedValueKey].length
      : (column as ResponsiveVisualizationAggregatedItem)[individualValueKey].value
    if (value > acc) {
      return value
    }
    return acc
  }, 0)
  const rowsInBiggestColumn = Math.ceil(biggestColumnValue / pointsByRow)
  const heightNeeded = rowsInBiggestColumn * POINT_WIDTH
  return heightNeeded < height - AXIX_LABEL_PADDING - COLUMN_PADDING - COLUMN_LABEL_SIZE
}

type getIsIndividualTimeseriesSupportedParams = {
  data: ResponsiveVisualizationData
  width: number
  height: number
  aggregatedValueKey: string
  individualValueKey: string
}
export function getIsIndividualTimeseriesSupported({
  data,
  width,
  height,
  aggregatedValueKey,
  individualValueKey,
}: getIsIndividualTimeseriesSupportedParams): boolean {
  return false
}
