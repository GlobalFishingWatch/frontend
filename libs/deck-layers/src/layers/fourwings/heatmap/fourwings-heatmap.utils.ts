import { stringify } from 'qs'
import { DateTime } from 'luxon'
import type { Feature } from 'geojson'
import { Color } from '@deck.gl/core'
import { TileIndex } from '@deck.gl/geo-layers/dist/tileset-2d/types'
import {
  CONFIG_BY_INTERVAL,
  FourwingsFeature,
  FourwingsInterval,
  getFourwingsInterval,
  TileCell,
} from '@globalfishingwatch/deck-loaders'
import { getUTCDateTime } from '../../../utils'
import { FourwingsDeckSublayer, FourwingsVisualizationMode } from '../fourwings.types'
import {
  HEATMAP_API_TILES_URL,
  HEATMAP_HIGH_RES_ID,
  HEATMAP_ID,
  HEATMAP_LOW_RES_ID,
  getChunkByInterval,
} from '../fourwings.config'
import {
  AggregateCellParams,
  CompareCellParams,
  FourwingsAggregationOperation,
  FourwingsChunk,
  FourwingsHeatmapResolution,
} from './fourwings-heatmap.types'

export function aggregateSublayerValues(
  values: number[],
  aggregationOperation = FourwingsAggregationOperation.Sum
) {
  let nonEmptyValuesLength = 0
  return values.reduce((acc: number, value = 0, index) => {
    if (value) nonEmptyValuesLength++
    if (index === values.length - 1 && aggregationOperation === FourwingsAggregationOperation.Avg) {
      return nonEmptyValuesLength ? (acc + value) / nonEmptyValuesLength : 0
    }
    return acc + value
  }, 0)
}

export const aggregateCell = ({
  cellValues,
  startFrame,
  endFrame,
  cellStartOffsets,
  aggregationOperation = FourwingsAggregationOperation.Sum,
}: AggregateCellParams): number[] => {
  return cellValues.map((sublayerValues, sublayerIndex) => {
    if (
      !sublayerValues ||
      !cellStartOffsets ||
      // all values are before time range
      endFrame - cellStartOffsets[sublayerIndex] < 0 ||
      // all values are after time range
      startFrame - cellStartOffsets[sublayerIndex] >= sublayerValues.length
    ) {
      return 0
    }
    return aggregateSublayerValues(
      sliceCellValues({
        values: sublayerValues,
        startFrame,
        endFrame,
        startOffset: cellStartOffsets[sublayerIndex],
      }),
      aggregationOperation
    )
  })
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
  return values.slice(
    Math.max(startFrame - startOffset, 0),
    endFrame - startOffset < values.length ? endFrame - startOffset : undefined
  )
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
    index: TileIndex
    id: string
  }
): string | null {
  if (!template || !template.length) {
    return null
  }
  const { index, id } = tile

  if (Array.isArray(template)) {
    const i = stringHash(id) % template.length
    template = template[i]
  }

  let url = template
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

type GetDataUrlByChunk = {
  tile: {
    index: TileIndex
    id: string
  }
  chunk: FourwingsChunk
  sublayer: FourwingsDeckSublayer
  filter?: string
  vesselGroups?: string[]
  tilesUrl?: string
}

export const getDataUrlBySublayer = ({
  tile,
  chunk,
  sublayer,
  tilesUrl = HEATMAP_API_TILES_URL,
}: GetDataUrlByChunk) => {
  const vesselGroup = Array.isArray(sublayer.vesselGroups)
    ? sublayer.vesselGroups[0]
    : sublayer.vesselGroups
  const params = {
    format: '4WINGS',
    interval: chunk.interval,
    'temporal-aggregation': false,
    datasets: [sublayer.datasets.join(',')],
    ...(sublayer.filter && { filters: [sublayer.filter] }),
    ...(vesselGroup && { 'vessel-groups': [vesselGroup] }),
    ...(chunk.interval !== 'YEAR' && {
      'date-range': [
        DateTime.fromMillis(chunk.bufferedStart).toISODate(),
        DateTime.fromMillis(chunk.bufferedEnd).toISODate(),
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

export function getRoundedDateFromTS(ts: number) {
  return getUTCDateTime(ts).toISODate()
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

export const aggregateCellTimeseries = (
  cells: FourwingsFeature[],
  sublayers: FourwingsDeckSublayer[]
) => {
  if (!cells) {
    return []
  }
  return []
  // TODO: fix this with new Deck.gl data format
  // What we have from the data is
  // [{index:number, timeseries: {id: {frame:value, ...}  }}]
  // What we want for the timebar is
  // [{date: date, 0:number, 1:number ...}, ...]
  // const timeseries = cells.reduce(
  //   (acc: any, { timeseries }) => {
  //     if (!timeseries) {
  //       return acc
  //     }
  //     sublayers.forEach((sublayer, index) => {
  //       const sublayerTimeseries = timeseries[sublayer.id]
  //       if (sublayerTimeseries) {
  //         const frames = Object.keys(sublayerTimeseries)
  //         frames.forEach((frame: any) => {
  //           if (!acc[frame]) {
  //             // We populate the frame with 0s for all the sublayers
  //             acc[frame] = Object.fromEntries(sublayers.map((key, index) => [index, 0]))
  //           }
  //           acc[frame][index] += sublayerTimeseries[frame]
  //         })
  //       }
  //     })
  //     return acc
  //   },
  //   {} as Record<number, Record<number, number>>
  // )

  // return Object.entries(timeseries)
  //   .map(([frame, values]) => ({
  //     date: parseInt(frame),
  //     ...(values as any),
  //   }))
  //   .sort((a, b) => a.date - b.date)
}

const getMillisFromHtime = (htime: number) => {
  return htime * 1000 * 60 * 60
}

export const aggregatePositionsTimeseries = (positions: Feature[]) => {
  if (!positions) {
    return []
  }
  const timeseries = positions.reduce((acc, position) => {
    const { htime, value } = position.properties as any
    const activityStart = getMillisFromHtime(htime)
    if (acc[activityStart]) {
      acc[activityStart] += value
    } else {
      acc[activityStart] = value
    }
    return acc
  }, {} as Record<number, number>)
  return timeseries
}

export const EMPTY_CELL_COLOR: Color = [0, 0, 0, 0]

export function getFourwingsChunk(
  minDate: number,
  maxDate: number,
  availableIntervals?: FourwingsInterval[]
) {
  const interval = getFourwingsInterval(minDate, maxDate, availableIntervals)
  return getChunkByInterval(minDate, maxDate, interval)
}

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
}) {
  const interval = getFourwingsInterval(startTime, endTime, availableIntervals)
  const tileStartFrame = Math.ceil(CONFIG_BY_INTERVAL[interval].getIntervalFrame(bufferedStart))
  const startFrame = Math.ceil(
    CONFIG_BY_INTERVAL[interval].getIntervalFrame(startTime) - tileStartFrame
  )
  const endFrame = Math.ceil(
    CONFIG_BY_INTERVAL[interval].getIntervalFrame(endTime) - tileStartFrame
  )
  return { interval, tileStartFrame, startFrame, endFrame }
}

export function filterCells(value: any, index: number, minValue?: number, maxValue?: number) {
  // Select only 5% of elements
  return (
    value && index % 20 === 1 && (!minValue || value > minValue) && (!maxValue || value < maxValue)
  )
}

export const getResolutionByVisualizationMode = (
  visualizationMode?: FourwingsVisualizationMode
) => {
  if (visualizationMode === HEATMAP_HIGH_RES_ID) {
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

export const getZoomOffsetByResolution = (resolution?: FourwingsHeatmapResolution) => {
  if (resolution === 'high') {
    return 1
  } else if (resolution === 'low') {
    return -1
  }
  return 0
}