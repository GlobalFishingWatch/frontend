import type { Color } from '@deck.gl/core'
import type { _TileLoadProps as TileLoadProps } from '@deck.gl/geo-layers'
import { DateTime } from 'luxon'
import { stringify } from 'qs'

import type {
  FourwingsFeature,
  FourwingsInterval,
  TileCell,
} from '@globalfishingwatch/deck-loaders'
import { CONFIG_BY_INTERVAL, getFourwingsInterval } from '@globalfishingwatch/deck-loaders'

import {
  FOOTPRINT_HIGH_RES_ID,
  HEATMAP_API_TILES_URL,
  HEATMAP_HIGH_RES_ID,
  HEATMAP_ID,
  HEATMAP_LOW_RES_ID,
  MAX_RAMP_VALUES,
} from '#layers/fourwings/fourwings.config'
import { getSteps, removeOutliers } from '#layers/fourwings/fourwings.stats'
import type {
  FourwingsDeckSublayer,
  FourwingsDeckVectorSublayer,
  FourwingsVisualizationMode,
} from '#layers/fourwings/fourwings.types'
import type { GetChunkByIntervalParams } from '#layers/fourwings/fourwings.utils'
import { getChunkByInterval } from '#layers/fourwings/fourwings.utils'
import { getUTCDateTime } from '#utils'

import type {
  AggregateCellParams,
  CompareCellParams,
  FourwingsChunk,
  FourwingsHeatmapResolution,
  FourwingsHeatmapTilesCache,
  FourwingsIntervalCacheMode,
} from './fourwings-heatmap.types'
import { FourwingsAggregationOperation } from './fourwings-heatmap.types'

export function aggregateSublayerValues(
  values: number[],
  aggregationOperation = FourwingsAggregationOperation.Sum
) {
  if (aggregationOperation === FourwingsAggregationOperation.Avg) {
    let nonEmptyValuesLength = 0
    return (
      values.reduce((acc: number, value = 0) => {
        if (value) nonEmptyValuesLength++
        return acc + value
      }, 0) / (nonEmptyValuesLength || 1)
    )
  }
  if (aggregationOperation === FourwingsAggregationOperation.AvgDegrees) {
    const radians = values.map((degree) => degree * (Math.PI / 180))
    const sinSum = radians.reduce((acc, rad) => acc + Math.sin(rad), 0)
    const cosSum = radians.reduce((acc, rad) => acc + Math.cos(rad), 0)

    const avgRad = Math.atan2(sinSum, cosSum)
    const avgDeg = avgRad * (180 / Math.PI)
    return ((avgDeg % 360) + 360) % 360
  }
  return values.reduce((acc: number, value = 0) => {
    return acc + value
  }, 0)
}

export const sliceCellValues = ({
  values,
  startFrame,
  endFrame,
  startOffset,
}: {
  values: number[]
  startFrame: number
  endFrame: number
  startOffset: number
}): number[] => {
  if (!values || !values.length) {
    return []
  }
  if (startFrame === endFrame) return [values[Math.max(startFrame - startOffset, 0)]]
  return values.slice(
    Math.max(startFrame - startOffset, 0),
    endFrame - startOffset < values.length ? endFrame - startOffset : undefined
  )
}

/**
 * Returns `undefined` — not 0 — for a sublayer the cell holds no data
 */
export const aggregateCell = ({
  cellValues,
  startFrame,
  endFrame,
  cellStartOffsets,
  aggregationOperation = FourwingsAggregationOperation.Sum,
}: AggregateCellParams): (number | undefined)[] => {
  return cellValues.map((sublayerValues, sublayerIndex) => {
    if (!sublayerValues || !cellStartOffsets) {
      return undefined
    }
    const startOffset = cellStartOffsets[sublayerIndex]
    if (
      // all values are before time range
      endFrame - startOffset < 0 ||
      // all values are after time range
      startFrame - startOffset >= sublayerValues.length
    ) {
      return undefined
    }
    return aggregateSublayerValues(
      sliceCellValues({
        values: sublayerValues,
        startFrame,
        endFrame,
        startOffset,
      }),
      aggregationOperation
    )
  })
}

export const compareCell = ({
  cellValues,
  aggregationOperation = FourwingsAggregationOperation.Sum,
}: CompareCellParams): number[] => {
  const [initialValue, comparedValue] = cellValues.map((sublayerValues) => {
    if (!sublayerValues || !sublayerValues?.length) {
      return 0
    }
    const value = aggregateSublayerValues(sublayerValues, aggregationOperation)
    return value ?? 0
  })
  if (!initialValue && !comparedValue) {
    return []
  }
  if (!comparedValue) {
    return [-initialValue]
  }
  if (!initialValue) {
    return [comparedValue]
  }
  return [comparedValue - initialValue]
}

function stringHash(s: string): number {
  return Math.abs(s.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0))
}
// Copied from deck.gl as the import doesn't work
export function getURLFromTemplate(
  template: string | string[],
  tile: {
    index: TileLoadProps['index']
    id: string
  }
): string {
  if (!template || !template.length) {
    return ''
  }
  const { index, id } = tile

  if (Array.isArray(template)) {
    const i = stringHash(id) % template.length
    template = template[i]
  }

  let url = decodeURI(template)
  for (const key of Object.keys(index)) {
    const regex = new RegExp(`{${key}}`, 'g')
    url = url.replace(regex, String((index as any)[key]))
  }

  // Back-compatible support for {-y}
  if (Number.isInteger(index.y) && Number.isInteger(index.z)) {
    url = url.replace(/\{-y\}/g, String(Math.pow(2, index.z) - index.y - 1))
  }
  return url
}

type GetDataUrlParams = {
  tile: {
    index: TileLoadProps['index']
    id: string
  }
  chunk: FourwingsChunk
  sublayer?: FourwingsDeckSublayer | FourwingsDeckVectorSublayer
  sublayers?: (FourwingsDeckSublayer | FourwingsDeckVectorSublayer)[]
  tilesUrl?: string
  extentStart?: number
  mergeSublayerDatasets?: boolean
  temporalAggregation?: boolean
  intervalCacheMode?: FourwingsIntervalCacheMode
}

export function getTimeResolved(
  date: number = DateTime.utc().toMillis(),
  cacheInterval: FourwingsIntervalCacheMode = 'DATE',
  roundToUnit: 'day' | 'hour' = 'day'
): string {
  if (cacheInterval === 'NONE') {
    return DateTime.fromMillis(date, { zone: 'utc' }).toISO() as string
  }
  return roundToUnit === 'day'
    ? (getUTCDateTime(date).toISODate() as string)
    : (getUTCDateTime(date).startOf('hour').toISO() as string)
}

export const getDataUrl = ({
  tile,
  chunk,
  sublayer,
  sublayers,
  tilesUrl = HEATMAP_API_TILES_URL,
  mergeSublayerDatasets,
  temporalAggregation = false,
  extentStart,
  intervalCacheMode = 'DATE',
}: GetDataUrlParams) => {
  const sublayersArray = sublayers || (sublayer ? [sublayer] : [])

  if (sublayersArray.length === 0) {
    throw new Error('At least one sublayer must be provided')
  }

  const shouldMergeDatasets = mergeSublayerDatasets ?? sublayersArray.length > 1

  // Get vessel group from first sublayer (vectors typically have same config for U and V)
  const firstSublayer = sublayersArray[0] as FourwingsDeckSublayer
  const vesselGroup = Array.isArray(firstSublayer.vesselGroups)
    ? firstSublayer.vesselGroups?.[0]
    : firstSublayer.vesselGroups

  const filter = firstSublayer.filter

  const start = extentStart && extentStart > chunk.start ? extentStart : chunk.bufferedStart
  const tomorrow = DateTime.now().toUTC().endOf('day').plus({ millisecond: 1 }).toMillis()
  const end = tomorrow && tomorrow < chunk.end ? tomorrow : chunk.bufferedEnd

  const params = {
    format: '4WINGS',
    interval: chunk.interval,
    'temporal-aggregation': temporalAggregation,
    datasets: shouldMergeDatasets
      ? [Array.from(new Set(sublayersArray.flatMap((s) => s.datasets))).join(',')]
      : sublayersArray.map((s) => s.datasets.join(',')),
    ...(filter && {
      filters: [filter],
    }),
    ...(vesselGroup && { 'vessel-groups': [vesselGroup] }),
    ...(chunk.interval !== 'YEAR' && {
      'date-range': [
        getTimeResolved(start < end ? start : end, intervalCacheMode),
        getTimeResolved(end, intervalCacheMode),
      ].join(','),
    }),
  }
  const url = `${tilesUrl}?${stringify(params, {
    arrayFormat: 'indices',
  })}`

  return getURLFromTemplate(url, tile)
}

export interface Bounds {
  north: number
  south: number
  west: number
  east: number
}

export const filterCellsByBounds = (cells: TileCell[], bounds: Bounds) => {
  if (!bounds || cells?.length === 0) {
    return []
  }
  const { north, east, south, west } = bounds
  const rightWorldCopy = east >= 180
  const leftWorldCopy = west <= -180
  return cells.filter((c) => {
    if (!c) return false
    const [lon, lat] = (c.coordinates as any)[0][0]
    if (lat < south || lat > north) {
      return false
    }
    // This tries to translate features longitude for a proper comparison against the viewport
    // when they fall in a left or right copy of the world but not in the center one
    // but... https://c.tenor.com/YwSmqv2CZr8AAAAd/dog-mechanic.gif
    const featureInLeftCopy = lon > 0 && lon - 360 >= west
    const featureInRightCopy = lon < 0 && lon + 360 <= east
    const leftOffset = leftWorldCopy && !rightWorldCopy && featureInLeftCopy ? -360 : 0
    const rightOffset = rightWorldCopy && !leftWorldCopy && featureInRightCopy ? 360 : 0
    return lon + leftOffset + rightOffset > west && lon + leftOffset + rightOffset < east
  })
}

export const EMPTY_CELL_COLOR: Color = [0, 0, 0, 0]

export function getFourwingsChunk(
  params: Omit<GetChunkByIntervalParams, 'interval'> & {
    availableIntervals?: FourwingsInterval[]
  }
): FourwingsChunk {
  const { start, end, availableIntervals, ...rest } = params
  const interval = getFourwingsInterval(start, end, availableIntervals)
  return getChunkByInterval({
    start,
    end,
    interval,
    ...rest,
  })
}

type FourwingsIntervalFrames = {
  interval: FourwingsInterval
  tileStartFrame: number
  startFrame: number
  endFrame: number
}

const INTERVAL_FRAMES_CACHE_MAX_SIZE = 1000
const intervalFramesCache = new Map<string, FourwingsIntervalFrames>()

export function getIntervalFrames({
  startTime,
  endTime,
  availableIntervals,
  bufferedStart,
}: {
  startTime: number
  endTime: number
  availableIntervals?: FourwingsInterval[]
  bufferedStart: number
}): FourwingsIntervalFrames {
  const cacheKey = `${startTime}-${endTime}-${bufferedStart}-${availableIntervals?.join(',')}`

  if (intervalFramesCache.has(cacheKey)) {
    return intervalFramesCache.get(cacheKey)!
  }

  const interval = getFourwingsInterval(startTime, endTime, availableIntervals)
  const intervalConfig = CONFIG_BY_INTERVAL[interval]
  if (!intervalConfig) {
    console.error(`Invalid interval: ${interval}`)
    return { interval, tileStartFrame: 0, startFrame: 0, endFrame: 0 }
  }

  const tileStartFrame = Math.ceil(intervalConfig.getIntervalFrame(bufferedStart) ?? 0)
  const startFrame = Math.ceil(intervalConfig.getIntervalFrame(startTime) - tileStartFrame)
  const endFrame = Math.ceil(intervalConfig.getIntervalFrame(endTime) - tileStartFrame)

  const result = { interval, tileStartFrame, startFrame, endFrame } as FourwingsIntervalFrames
  if (intervalFramesCache.size >= INTERVAL_FRAMES_CACHE_MAX_SIZE) {
    intervalFramesCache.delete(intervalFramesCache.keys().next().value as string)
  }
  intervalFramesCache.set(cacheKey, result)
  return result
}

export function isSublayerValueVisible(
  value: number | undefined | null,
  sublayer?: { minVisibleValue?: number; maxVisibleValue?: number }
): value is number {
  // 0 is a value the API actually measured; only a missing one hides the cell
  if (value === undefined || value === null || Number.isNaN(value)) {
    return false
  }
  const { minVisibleValue, maxVisibleValue } = sublayer || {}
  return (
    (minVisibleValue === undefined || value >= minVisibleValue) &&
    (maxVisibleValue === undefined || value <= maxVisibleValue)
  )
}

export function getSublayersVisibleValuesHash(
  sublayers?: { minVisibleValue?: number; maxVisibleValue?: number }[]
) {
  return (sublayers || []).map((s) => `${s.minVisibleValue}-${s.maxVisibleValue}`).join(',')
}

export function filterCells(value: any, index: number, minValue?: number, maxValue?: number) {
  // Select only 5% of elements
  return (
    value && index % 20 === 1 && (!minValue || value > minValue) && (!maxValue || value < maxValue)
  )
}

export function getFourwingsColorDomain({
  features,
  aggregationOperation,
  startFrame,
  endFrame,
  timeRangeKey,
  // note this forces the 5% sample instead of skipping it, matching the previous behaviour
  skipColorDomainSampling,
  minVisibleValue,
  maxVisibleValue,
}: {
  features: FourwingsFeature[]
  aggregationOperation?: FourwingsAggregationOperation
  startFrame: number
  endFrame: number
  timeRangeKey: string
  skipColorDomainSampling?: boolean
  minVisibleValue?: number
  maxVisibleValue?: number
}): number[] {
  if (!features?.length) {
    return []
  }
  const dataSample =
    features.length > MAX_RAMP_VALUES || skipColorDomainSampling
      ? features.filter((d, i) => filterCells(d, i))
      : features

  // The previous filter on values was a no-op (the predicate returned an
  // array, always truthy) that allocated two copies per cell and compacted
  // sparse sublayers out of alignment with startOffsets, so values are
  // passed through directly
  let allValues = dataSample
    .flatMap(
      (feature) =>
        feature.properties.initialValues[timeRangeKey] ||
        aggregateCell({
          cellValues: feature.properties.values,
          aggregationOperation,
          startFrame,
          endFrame,
          cellStartOffsets: feature.properties.startOffsets,
        })
    )
    .filter((value): value is number => value !== undefined)
  if (minVisibleValue !== undefined || maxVisibleValue !== undefined) {
    allValues = allValues.filter((value) =>
      isSublayerValueVisible(value, { minVisibleValue, maxVisibleValue })
    )
  }
  if (!allValues.length) {
    return []
  }
  return getSteps(removeOutliers({ allValues, aggregationOperation }))
}

export const getResolutionByVisualizationMode = (
  visualizationMode?: FourwingsVisualizationMode
) => {
  if (visualizationMode === HEATMAP_HIGH_RES_ID || visualizationMode === FOOTPRINT_HIGH_RES_ID) {
    return 'high'
  } else if (visualizationMode === HEATMAP_LOW_RES_ID) {
    return 'low'
  }
  return 'default'
}

export const getVisualizationModeByResolution = (resolution?: FourwingsHeatmapResolution) => {
  if (resolution === 'high') {
    return HEATMAP_HIGH_RES_ID
  } else if (resolution === 'low') {
    return HEATMAP_LOW_RES_ID
  }
  return HEATMAP_ID
}

export const getZoomOffsetByResolution = (resolution: FourwingsHeatmapResolution, zoom: number) => {
  if (resolution === 'high') {
    return 1
  } else if (resolution === 'low') {
    return zoom > 0.5 ? -1 : 0
  }
  return 0
}

export const getTileDataCache = ({
  zoom,
  startTime,
  endTime,
  bufferedStartTime,
  bufferedEndTime,
  availableIntervals,
  compareStart,
  compareEnd,
  chunksBuffer,
  temporalAggregation,
  intervalCacheMode,
}: {
  zoom: number
  startTime: number
  endTime: number
  bufferedStartTime?: number
  bufferedEndTime?: number
  availableIntervals?: FourwingsInterval[]
  compareStart?: number
  compareEnd?: number
  chunksBuffer?: number
  temporalAggregation?: boolean
  intervalCacheMode?: FourwingsIntervalCacheMode
}): FourwingsHeatmapTilesCache => {
  const interval = getFourwingsInterval(startTime, endTime, availableIntervals)
  const { start, end, bufferedStart } = getFourwingsChunk({
    start: startTime,
    end: endTime,
    availableIntervals,
    chunksBuffer,
    intervalCacheMode,
    bufferedStartTime,
    bufferedEndTime,
  })
  return {
    zoom,
    start: temporalAggregation ? startTime : start,
    end: temporalAggregation ? endTime : end,
    bufferedStart,
    interval,
    compareStart,
    compareEnd,
    temporalAggregation,
  }
}
