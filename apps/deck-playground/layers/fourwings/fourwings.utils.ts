import { stringify } from 'qs'
import { TileCell } from 'loaders/fourwings/fourwingsTileParser'
import { TileIndex } from '@deck.gl/geo-layers/typed/tile-layer/types'
import { DateTime } from 'luxon'
import { TimebarRange } from 'features/timebar/timebar.hooks'
import { getUTCDateTime } from 'utils/dates'
import { Chunk } from './fourwings.config'
import { FourwingsLayerMode } from './FourwingsLayer'

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
    url = url.replace(regex, String(index[key]))
  }

  // Back-compatible support for {-y}
  if (Number.isInteger(index.y) && Number.isInteger(index.z)) {
    url = url.replace(/\{-y\}/g, String(Math.pow(2, index.z) - index.y - 1))
  }
  return url
}

const API_BASE_URL =
  'https://gateway.api.dev.globalfishingwatch.org/v2/4wings/tile/heatmap/{z}/{x}/{y}'
export const getDataUrlByChunk = (
  tile: {
    index: TileIndex
    id: string
  },
  chunk: Chunk
) => {
  const params = {
    interval: chunk.interval,
    format: 'intArray',
    'temporal-aggregation': false,
    proxy: true,
    'date-range': [
      DateTime.fromMillis(chunk.start).toISODate(),
      DateTime.fromMillis(chunk.end).toISODate(),
    ].join(','),
    datasets: ['public-global-fishing-effort:v20201001'],
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

export function getFourwingsMode(zoom: number, timerange: TimebarRange): FourwingsLayerMode {
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

export const aggregateCellTimeseries = (cells: TileCell[]) => {
  if (!cells) {
    return []
  }
  const timeseries = cells.reduce((acc, cell) => {
    if (!cell) {
      return acc
    }
    cell.timeseries.forEach(({ frame, value }) => {
      if (acc[frame]) {
        acc[frame] += value
      } else {
        acc[frame] = value
      }
    })
    return acc
  }, {} as Record<number, number>)
  return timeseries
}
