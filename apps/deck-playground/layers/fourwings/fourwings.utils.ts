import { stringify } from 'qs'
import { TileCell } from 'loaders/fourwings/fourwingsTileParser'
import { TileIndex } from '@deck.gl/geo-layers/typed/tile-layer/types'
import { DateTime } from 'luxon'
import { Feature } from 'geojson'
import { TimebarRange } from 'features/timebar/timebar.hooks'
import { getUTCDateTime } from 'utils/dates'
import { Chunk } from './fourwings.config'
import { FourwingsLayerMode } from './FourwingsLayer'
import { FourwingsSublayer } from './fourwings.types'

export function asyncAwaitMS(millisec) {
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
    url = url.replace(regex, String(index[key]))
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
  datasets: FourwingsSublayer['datasets']
}

const API_BASE_URL =
  'https://gateway.api.dev.globalfishingwatch.org/v2/4wings/tile/heatmap/{z}/{x}/{y}'
export const getDataUrlByChunk = ({ tile, chunk, datasets }: GetDataUrlByChunk) => {
  const params = {
    interval: chunk.interval,
    format: '4wings',
    'temporal-aggregation': false,
    proxy: true,
    'date-range': [
      DateTime.fromMillis(chunk.start).toISODate(),
      DateTime.fromMillis(chunk.end).toISODate(),
    ].join(','),
    datasets,
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

export const aggregateCellTimeseries = (cells: TileCell[], sublayers: FourwingsSublayer[]) => {
  if (!cells) {
    return []
  }
  // What we have from the data is
  // [{index:number, timeseries: {id: {frame:value, ...}  }}]
  // What we want for the timebar is
  // [{date: date, 0:number, 1:number ...}, ...]
  const timeseries = cells.reduce((acc, { timeseries }) => {
    if (!timeseries) {
      return acc
    }
    sublayers.forEach((sublayer, index) => {
      const sublayerTimeseries = timeseries[sublayer.id]
      if (sublayerTimeseries) {
        const frames = Object.keys(sublayerTimeseries)
        frames.forEach((frame) => {
          if (!acc[frame]) {
            // We populate the frame with 0s for all the sublayers
            acc[frame] = Object.fromEntries(sublayers.map((key, index) => [index, 0]))
          }

          acc[frame][index] += sublayerTimeseries[frame]
        })
      }
    })
    return acc
  }, {} as Record<number, Record<number, number>>)

  return Object.entries(timeseries)
    .map(([frame, values]) => ({
      date: parseInt(frame),
      ...values,
    }))
    .sort((a, b) => a.date - b.date)
}

const getMillisFromHtime = (htime: number) => {
  return htime * 1000 * 60 * 60
}

export const aggregatePositionsTimeseries = (positions: Feature[]) => {
  if (!positions) {
    return []
  }
  const timeseries = positions.reduce((acc, position) => {
    const { htime, value } = position.properties
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

// need to save this, this a soft polygon that represent south america
// and can be used to see polygon overlap and avoid requests to continents that take +2 seconds
export const southAmerica = {
  coordinates: [
    [
      [-76.7624187, 7.3372697],
      [-75.53195, 8.8816796],
      [-74.6530437, 10.3980007],
      [-73.5104656, 10.765183],
      [-72.3678875, 11.0025344],
      [-71.950407, 10.5924461],
      [-72.5876141, 9.6190292],
      [-71.950407, 8.729684],
      [-70.6320477, 8.7514015],
      [-70.6320477, 9.7706412],
      [-70.8517742, 10.7435963],
      [-69.0060711, 11.0456687],
      [-68.5446453, 10.1385521],
      [-65.0729656, 9.7273305],
      [-63.4030437, 10.2250586],
      [-61.4255047, 8.9468014],
      [-59.0964031, 6.8139439],
      [-57.1408367, 5.5032223],
      [-53.7042618, 5.3205343],
      [-50.8917618, 1.5047823],
      [-50.9576797, -0.6263799],
      [-45.0470352, -2.0541748],
      [-44.9151993, -3.349093],
      [-40.1031876, -3.2613485],
      [-37.136879, -5.2989978],
      [-35.7526016, -5.3865066],
      [-35.1593399, -8.0267648],
      [-39.0124512, -12.928778],
      [-40.177002, -19.6728174],
      [-42.3303223, -22.4407015],
      [-46.6948986, -23.5342451],
      [-48.5406017, -25.215347],
      [-49.1558361, -28.0627404],
      [-54.7010136, -34.6053075],
      [-58.4583378, -33.7692303],
      [-58.765955, -34.7498641],
      [-57.6453495, -35.3614061],
      [-57.1839237, -36.7645356],
      [-57.9339123, -38.0878239],
      [-60.7903576, -38.7934297],
      [-62.3943615, -38.5016986],
      [-62.680006, -40.7355514],
      [-64.9431896, -40.4686291],
      [-65.4265881, -40.7022444],
      [-65.2508068, -43.1698803],
      [-65.753088, -44.72393],
      [-67.4669552, -45.3759053],
      [-67.8404903, -46.2184456],
      [-66.9615841, -47.1380085],
      [-66.0826778, -47.3617344],
      [-67.796545, -48.872506],
      [-67.9503536, -49.859788],
      [-69.3126583, -50.3670363],
      [-68.9029026, -52.1219485],
      [-72.7041721, -53.0431224],
      [-75.0552464, -48.270683],
      [-73.5611057, -46.9974071],
      [-72.3898602, -41.9265478],
      [-73.2353783, -37.6283719],
      [-71.0874653, -32.6239064],
      [-71.3511372, -30.5464436],
      [-70.8018208, -29.2512085],
      [-70.1540565, -23.139334],
      [-70.1373196, -18.0231395],
      [-75.7623196, -14.181849],
      [-79.7514725, -6.3222939],
      [-80.5864334, -5.9946066],
      [-80.7622147, -4.3096093],
      [-79.39991, -3.45465],
      [-79.7075272, -2.115932],
      [-80.3886795, -2.0280988],
      [-79.5537186, 0.6301562],
      [-77.0399952, 3.0656101],
      [-76.7763233, 7.2880631],
    ],
  ],
  type: 'LineString',
}
