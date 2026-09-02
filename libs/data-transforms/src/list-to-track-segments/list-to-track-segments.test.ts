import fs from 'fs'
import path from 'path'

import { parse } from 'papaparse'

import { getUTCDate } from '../dates'
import { getFilterIdClean } from '../schema'
import { guessColumn } from '../schema/guess-columns'

import { checkRecordValidity } from './check-record-validity'
import { listToTrackSegments } from './list-to-track-segments'

export const LINE_COLOR_BAR_OPTIONS = [
  { id: 'carnation', value: '#F95E5E' },
  { id: 'jungle-green', value: '#33B679' },
  { id: 'tangerine', value: '#F09300' },
  // { id: 'dolly', value: '#FBFF8B' },  // Not compatible with encounter events
  { id: 'spring-green', value: '#1AFF6B' },
  // { id: 'wisteria', value: '#9E6AB0' }, // Not compatible with loitering events
  { id: 'pomegranate', value: '#F4511F' },
  // { id: 'cold-purple', value: '#B39DDB' }, // Not compatible with loitering events
  { id: 'salem', value: '#0B8043' },
  // { id: 'aquamarine', value: '#67FBFE' },  // Not compatible with port events
  // { id: 'electric-violet', value: '#BB00FF' }, // Not compatible with loitering events
  { id: 'gossamer', value: '#069688' },
  { id: 'cornflower-blue', value: '#4184F4' },
  { id: 'jazzberry-jam', value: '#AD1457' },
  // { id: 'blush-pink', value: '#FE81E5' }, // Not compatible with loitering events
  { id: 'earls-green', value: '#C0CA33' },
  { id: 'seance', value: '#8E24A9' },
  { id: 'green-yellow', value: '#ABFF34' },
  { id: 'atomic-tangerine', value: '#FCA26F' },
]
describe('getUTCDate', () => {
  it('parses timestamps in milliseconds as number', () => {
    const date = getUTCDate(1689362551274)
    expect(date.getTime()).not.toBeNaN()
    expect(date.toISOString()).toEqual('2023-07-14T19:22:31.274Z')
  })

  it('parses timestamps in milliseconds as string', () => {
    const date = getUTCDate('1689362551274')
    expect(date.getTime()).not.toBeNaN()
    expect(date.toISOString()).toEqual('2023-07-14T19:22:31.274Z')
  })

  it('parses timestamps in ISO format with timezone', () => {
    const date = getUTCDate('2023-07-14T19:22:31.274Z')
    expect(date.getTime()).not.toBeNaN()
    expect(date.toISOString()).toEqual('2023-07-14T19:22:31.274Z')
  })

  it('parses timestamps in ISO format with numeric timezone', () => {
    const date = getUTCDate('2023-07-14T11:22:31.274-0800')
    expect(date.getTime()).not.toBeNaN()
    expect(date.toISOString()).toEqual('2023-07-14T19:22:31.274Z')
  })

  it('parses timestamps in ISO format without timezone asuming they are in UTC', () => {
    const date = getUTCDate('2023-07-14T19:22:31.274')
    expect(date.getTime()).not.toBeNaN()
    expect(date.toISOString()).toEqual('2023-07-14T19:22:31.274Z')
  })

  it('parses timestamps in SQL format with timezone', () => {
    const date = getUTCDate('2020-01-01 00:00:24.000000 UTC')
    expect(date.getTime()).not.toBeNaN()
    expect(date.toISOString()).toEqual('2020-01-01T00:00:24.000Z')
  })

  it('parses timestamps in SQL format with numeric timezone', () => {
    const date = getUTCDate('2020-01-01 12:00:24.000000 -0300')
    expect(date.getTime()).not.toBeNaN()
    expect(date.toISOString()).toEqual('2020-01-01T15:00:24.000Z')
  })

  it('parses timestamps in SQL format without timezone asuming they are in UTC', () => {
    const date = getUTCDate('2015-09-11 08:52:28.000')
    expect(date.getTime()).not.toBeNaN()
    expect(date.toISOString()).toEqual('2015-09-11T08:52:28.000Z')
  })

  it('parses invalid timestamp to an Invalid Date object', () => {
    const date = getUTCDate('This Is Not a Formatted Date')
    expect(date.getTime()).toBeNaN()
  })
})

type Columns = { latitude: string; longitude: string; startTime: string; lineId: string }

// Headers are cleaned on upload (see the platform's datasets-parse.utils.ts) and
// listToTrackSegments normalizes record keys the same way before reading them, so the column
// names handed to it are always the cleaned ones.
const readCsv = (file: string) => {
  const raw = fs.readFileSync(path.join(__dirname, `mock/${file}`), 'utf-8')
  const rawFields = parse(raw, { header: true, preview: 1 }).meta?.fields
  const parsed = parse(raw, {
    dynamicTyping: true,
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => getFilterIdClean(header),
  })
  return { ...parsed, rawFields }
}

const describeTrackCsv = (name: string, file: string, columns: Columns) => {
  describe(name, () => {
    const { data, rawFields } = readCsv(file)
    const records = data as Record<string, any>[]
    const { segments } = listToTrackSegments({
      records,
      ...columns,
      lineColorBarOptions: LINE_COLOR_BAR_OPTIONS,
    })
    const ids = Array.from(new Set(records.map((record) => record[columns.lineId])))

    // `segments` holds one entry per line, each one holding that line's segments. Without a
    // segmentId column every line resolves to exactly one segment.
    const getPointsById = (id: any) => segments.find((line) => line[0]?.[0]?.id === id)?.[0]

    const getExpectedPoints = (id: any) =>
      records
        .filter((record) => record[columns.lineId] === id)
        .map((record) => ({
          latitude: record[columns.latitude],
          longitude: record[columns.longitude],
          timestamp: getUTCDate(record[columns.startTime]).getTime(),
        }))
        .sort((a, b) => a.timestamp - b.timestamp)

    // guessColumn matches raw headers only — its dictionary holds `location-lat`, not the
    // `location_lat` the cleaning step produces — so guess first, clean after.
    it('guesses columns correctly', () => {
      const guess = (col: 'latitude' | 'longitude' | 'timestamp') =>
        getFilterIdClean(guessColumn(col, rawFields) as string)
      expect(guess('timestamp')).toEqual(columns.startTime)
      expect(guess('latitude')).toEqual(columns.latitude)
      expect(guess('longitude')).toEqual(columns.longitude)
    })

    it('checks record validity correctly', () => {
      const badRecord = { latitude: 'ggg', longitude: 1234, timestamp: 'ggg' }
      const badColumns = { latitude: 'latitude', longitude: 'longitude', timestamp: 'timestamp' }
      expect(checkRecordValidity({ record: badRecord, ...badColumns })).toEqual([
        'latitude',
        'longitude',
        'timestamp',
      ])

      const goodRecord = records[records.length - 1]
      expect(
        checkRecordValidity({
          record: goodRecord,
          latitude: columns.latitude,
          longitude: columns.longitude,
          timestamp: columns.startTime,
        })
      ).toEqual([])
    })

    it('creates one line per id', () => {
      expect(segments.length).toEqual(ids.length)
    })

    it.each(ids)('converts every point of id %s, in timestamp order', (id) => {
      const points = getPointsById(id)
      expect(points).toBeDefined()
      expect(
        points!.map(({ latitude, longitude, timestamp }) => ({ latitude, longitude, timestamp }))
      ).toEqual(getExpectedPoints(id))
    })
  })
}

describeTrackCsv('Basic raw csv to track', 'messages.csv', {
  latitude: 'location_lat',
  longitude: 'location_long',
  startTime: 'timestamp',
  lineId: 'individual_local_identifier',
})

describeTrackCsv('Raw csv to track with UTC timestamps', 'messages_utc.csv', {
  latitude: 'lat',
  longitude: 'lon',
  startTime: 'timestamp',
  lineId: 'ssvid',
})

describe('Meridian handling', () => {
  const columns = { latitude: 'lat', longitude: 'lon', startTime: 't', lineId: 'id' }
  const toSegments = (records: Record<string, any>[]) =>
    listToTrackSegments({
      records,
      ...columns,
      lineColorBarOptions: LINE_COLOR_BAR_OPTIONS,
    }).segments

  it('keeps a track crossing the prime meridian as one line, in time order', () => {
    const segments = toSegments([
      { id: 'a', lat: 1, lon: -0.5, t: '2025-01-01T00:00:00Z' },
      { id: 'a', lat: 1.5, lon: 0.5, t: '2025-01-02T00:00:00Z' },
      { id: 'a', lat: 2, lon: 0, t: '2025-01-03T00:00:00Z' },
      { id: 'a', lat: 2.5, lon: -0.5, t: '2025-01-04T00:00:00Z' },
    ])
    expect(segments).toHaveLength(1)
    expect(segments[0]).toHaveLength(1)
    expect(segments[0][0].map((point) => point.longitude)).toEqual([-0.5, 0.5, 0, -0.5])
  })

  it('splits a track crossing the antimeridian', () => {
    const segments = toSegments([
      { id: 'a', lat: 1, lon: 179, t: '2025-01-01T00:00:00Z' },
      { id: 'a', lat: 1.5, lon: 179.5, t: '2025-01-02T00:00:00Z' },
      { id: 'a', lat: 2, lon: -179.5, t: '2025-01-03T00:00:00Z' },
    ])
    expect(segments).toHaveLength(1)
    expect(segments[0]).toHaveLength(2)
    expect(segments[0][0].map((point) => point.longitude)).toEqual([179, 179.5])
    expect(segments[0][1].map((point) => point.longitude)).toEqual([-179.5])
  })
})
