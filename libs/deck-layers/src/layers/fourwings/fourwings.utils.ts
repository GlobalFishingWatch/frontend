import { stringify } from 'qs'
import { TileIndex } from '@deck.gl/geo-layers/typed/tileset-2d/types'
import { DateTime } from 'luxon'
import type { Feature } from 'geojson'
import { Color } from '@deck.gl/core/typed'
import {
  CONFIG_BY_INTERVAL,
  Cell,
  FourWingsFeature,
  TileCell,
  getTimeRangeKey,
} from '@globalfishingwatch/deck-loaders'
import { getUTCDateTime, rgbaToDeckColor } from '../../utils'
import { FourwingsLayerMode } from './FourwingsLayer'
import {
  AggregateCellParams,
  Chunk,
  FourwingsDeckSublayer,
  GetFillColorParams,
  HeatmapAnimatedMode,
} from './fourwings.types'
import { getChunkByInterval, getInterval } from './fourwings.config'

export const aggregateCell = (
  cell: Cell,
  { minIntervalFrame, maxIntervalFrame, startFrames }: AggregateCellParams
): number[] => {
  // TODO decide if we want the last day to be included or not in maxIntervalFrame
  return cell.map(
    (sublayer, sublayerIndex) =>
      sublayer &&
      startFrames &&
      sublayer
        .slice(
          Math.max(minIntervalFrame - startFrames[sublayerIndex], 0),
          maxIntervalFrame ? maxIntervalFrame - startFrames[sublayerIndex] : undefined
        )
        .reduce((acc: number, value) => (value ? acc + value : acc), 0)
  )
}

export function asyncAwaitMS(millisec: any) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('')
    }, millisec)
  })
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
  chunk: Chunk
  sublayer: FourwingsDeckSublayer
}

const API_BASE_URL =
  'https://gateway.api.dev.globalfishingwatch.org/v3/4wings/tile/heatmap/{z}/{x}/{y}'
export const getDataUrlBySublayer = ({ tile, chunk, sublayer }: GetDataUrlByChunk) => {
  const params = {
    interval: chunk.interval,
    format: '4WINGS',
    'temporal-aggregation': false,
    proxy: true,
    ...(chunk.interval !== 'YEAR' && {
      'date-range': [
        DateTime.fromMillis(chunk.bufferedStart).toISODate(),
        DateTime.fromMillis(chunk.bufferedEnd).toISODate(),
      ].join(','),
    }),
    datasets: [sublayer.datasets.join(',')],
  }
  const url = `${API_BASE_URL}?${stringify(params, {
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

export const getDateRangeParam = (minFrame: number, maxFrame: number) => {
  return `date-range=${getRoundedDateFromTS(minFrame)},${getRoundedDateFromTS(maxFrame)}`
}

export const ACTIVITY_SWITCH_ZOOM_LEVEL = 9

export function getFourwingsMode(
  zoom: number,
  timerange: { start: string; end: string }
): FourwingsLayerMode {
  const duration = getUTCDateTime(timerange?.end).diff(getUTCDateTime(timerange?.start), 'days')
  return zoom >= ACTIVITY_SWITCH_ZOOM_LEVEL && duration.days < 30 ? 'positions' : 'heatmap'
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
  cells: FourWingsFeature[],
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

const getBucketIndex = (breaks: number[], value?: number) => {
  if (!breaks) return
  if (!value) return 0
  let currentBucketIndex
  for (let bucketIndex = 0; bucketIndex < breaks.length + 1; bucketIndex++) {
    const stopValue = breaks?.[bucketIndex] ?? Number.POSITIVE_INFINITY
    if (value <= stopValue) {
      currentBucketIndex = bucketIndex
      break
    }
  }
  if (currentBucketIndex === undefined) {
    currentBucketIndex = breaks.length
  }
  return currentBucketIndex
}

export const getBivariateValue = (realValues: number[], breaks: number[][]) => {
  //  y: datasetB
  //   |    0 | 0
  //   |   --(u)--+---+---+---+
  //   |    0 | 1 | 2 | 3 | 4 |
  //   |      +---+---+---+---+
  //   v      | 5 | 6 | 7 | 8 |
  //          +---+---+---+---+
  //          | 9 | 10| 11| 12|
  //          +---+---+---+---+
  //          | 13| 14| 15| 16|
  //          +---+---+---+---+
  //          --------------> x: datasetA
  const valueA = getBucketIndex(breaks[0], realValues[0])
  const valueB = getBucketIndex(breaks[1], realValues[1])
  // || 1: We never want a bucket of 0 - values below first break are not used in bivariate
  const colIndex = (valueA || 1) - 1
  const rowIndex = (valueB || 1) - 1

  const index = rowIndex * 4 + colIndex
  // offset by one because values start at 1 (0 reserved for values < min value)
  return index + 1
}

const EMPTY_CELL_COLOR: Color = [0, 0, 0, 0]
export const chooseColor = (
  feature: FourWingsFeature,
  {
    colorDomain,
    colorRanges,
    chunk,
    minIntervalFrame,
    maxIntervalFrame,
    comparisonMode,
  }: GetFillColorParams
): Color => {
  if (!colorDomain || !colorRanges || !chunk) {
    return EMPTY_CELL_COLOR
  }
  const { initialValues, startFrames, values } = feature.properties

  const aggregatedCellValues =
    initialValues[getTimeRangeKey(minIntervalFrame, maxIntervalFrame)] ||
    aggregateCell(values, {
      minIntervalFrame,
      maxIntervalFrame: maxIntervalFrame > 0 ? maxIntervalFrame : undefined,
      startFrames,
    })
  let chosenValueIndex = 0
  let chosenValue: number | undefined
  if (comparisonMode === HeatmapAnimatedMode.Compare) {
    aggregatedCellValues.forEach((value, index) => {
      // TODO add more comparison modes (bivariate)
      if (value && (!chosenValue || value > chosenValue)) {
        chosenValue = value
        chosenValueIndex = index
      }
    })
    const colorIndex = (colorDomain as number[]).findIndex((d, i) =>
      (chosenValue as number) <= d || i === colorRanges[0].length - 1 ? i : 0
    )
    if (!chosenValue) {
      return EMPTY_CELL_COLOR
    }
    return colorRanges[chosenValueIndex][colorIndex] as Color
  } else if (comparisonMode === HeatmapAnimatedMode.Bivariate) {
    chosenValue = getBivariateValue(aggregatedCellValues, colorDomain as number[][])
    if (!chosenValue) {
      return EMPTY_CELL_COLOR
    }
    return rgbaToDeckColor(colorRanges[chosenValue] as string)
  } else {
    return EMPTY_CELL_COLOR
  }
}

export function getChunk(minFrame: number, maxFrame: number) {
  const interval = getInterval(minFrame, maxFrame)
  return getChunkByInterval(minFrame, maxFrame, interval)
}

export function getIntervalFrames(minFrame: number, maxFrame: number) {
  const interval = getInterval(minFrame, maxFrame)
  const chunk = getChunk(minFrame, maxFrame)
  const tileMinIntervalFrame = Math.ceil(CONFIG_BY_INTERVAL[interval].getIntervalFrame(chunk.start))
  const minIntervalFrame = Math.ceil(
    CONFIG_BY_INTERVAL[interval].getIntervalFrame(minFrame) - tileMinIntervalFrame
  )
  const maxIntervalFrame = Math.ceil(
    CONFIG_BY_INTERVAL[interval].getIntervalFrame(maxFrame) - tileMinIntervalFrame
  )
  return { interval, tileMinIntervalFrame, minIntervalFrame, maxIntervalFrame }
}

export function filterElementByPercentOfIndex(value: any, index: number) {
  // Select only 5% of elements
  return value && index % 20 === 1
}
