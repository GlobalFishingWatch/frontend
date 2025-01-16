import fs from 'fs'
import path from 'path'

import { parse } from 'papaparse'

import { getUTCDate } from '../dates'
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

describe('Basic raw csv to track', () => {
  const rawCsv = fs.readFileSync(path.join(__dirname, 'mock/messages.csv'), 'utf-8')

  const { data, meta } = parse(rawCsv, { dynamicTyping: true, header: true, skipEmptyLines: true })

  const columns = {
    latitude: 'location-lat',
    longitude: 'location-long',
    timestamp: 'timestamp',
    id: 'individual-local-identifier',
  }
  const lineColorBarOptions = LINE_COLOR_BAR_OPTIONS
  const { segments } = listToTrackSegments({
    records: data as Record<string, any>[],
    ...columns,
    lineColorBarOptions,
  })
  const ids = Array.from(new Set(data.map((item: any) => item[columns.id])))

  // Map index position in segment array for a given id
  const segmentIndexPerId = ids.reduce((prev, id) => {
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i]
      if (segment[0]?.[0]?.id === id) return { ...prev, [id]: i }
    }
    return { ...prev }
  }, {})

  const getSegmentById = (id: string) => {
    return segments[segmentIndexPerId[id]]
  }

  it('guesses columns correctly', () => {
    expect(guessColumn('timestamp', meta?.fields)).toEqual('timestamp')
    expect(guessColumn('latitude', meta?.fields)).toEqual('location-lat')
    expect(guessColumn('longitude', meta?.fields)).toEqual('location-long')
  })

  it('checks record validity correctly', () => {
    const badRecord = {
      latitude: 'ggg',
      longitude: 1234,
      timestamp: 'ggg',
    }
    const goodRecord = {
      latitude: 1.234,
      longitude: 43.21,
      timestamp: '2015-09-11 09:25:27.000',
    }
    const columns = {
      latitude: 'latitude',
      longitude: 'longitude',
      timestamp: 'timestamp',
    }
    const errors = checkRecordValidity({ record: badRecord, ...columns })
    expect(errors).toEqual(['latitude', 'longitude', 'timestamp'])

    const noErrors = checkRecordValidity({
      record: goodRecord,
      ...columns,
    })
    expect(noErrors).toEqual([])
  })

  it('creates one segment per id', () => {
    expect(segments.length).toEqual(ids.length)
  })

  it.each(ids)('includes all the points of id %s in the track segment', (id) => {
    const segment = getSegmentById(id)
    const idPoints = data.filter((item: any) => item[columns.id] === id).length
    expect(segment?.length).toEqual(idPoints)
  })

  // Use a data sample to verify point by point
  const dataSample: any[] = ids.reduce((prev, id) => {
    return [
      ...prev,
      ...data
        // per id
        .filter((item: any) => item[columns.id] === id)
        // get only some records
        .slice(0, 20)
        // and add the index position that should match the position in the segment
        .map((r: any, i) => ({ ...r, i })),
    ]
  }, [])

  it.each(dataSample)(
    'checks point $i of id $individual-local-identifier converted to segment. {lat: $location-lat, lon: $location-long, timestamp: $timestamp} ',
    (point: any) => {
      const i = point.i
      const segment = getSegmentById(point[columns.id])
      const segmentPoint = segment[i]

      expect(segmentPoint).toBeDefined()
      expect(segmentPoint[0]?.latitude).toEqual(point[columns.latitude])
      expect(segmentPoint[0]?.longitude).toEqual(point[columns.longitude])
      const dateCsv = getUTCDate(point[columns.timestamp])
      expect(segmentPoint[0]?.timestamp).toEqual(dateCsv.getTime())
    }
  )
})

describe('Raw csv to track with UTC timestamps', () => {
  const rawUtcCsv = fs.readFileSync(path.join(__dirname, 'mock/messages_utc.csv'), 'utf-8')

  const { data, meta } = parse(rawUtcCsv, {
    dynamicTyping: true,
    header: true,
    skipEmptyLines: true,
  })

  const columns = {
    latitude: 'lat',
    longitude: 'lon',
    timestamp: 'timestamp',
    id: 'ssvid',
  }
  const lineColorBarOptions = LINE_COLOR_BAR_OPTIONS
  const { segments } = listToTrackSegments({
    records: data as Record<string, any>[],
    ...columns,
    lineColorBarOptions,
  })
  const ids = Array.from(new Set(data.map((item: any) => item[columns.id])))

  // Map index position in segment array for a given id
  const segmentIndexPerId = ids.reduce((prev, id) => {
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i]
      if (segment[0]?.[0]?.id === id) return { ...prev, [id]: i }
    }
    return { ...prev }
  }, {})

  const getSegmentById = (id: string) => {
    return segments[segmentIndexPerId[id]]
  }

  it('guesses columns correctly', () => {
    expect(guessColumn('timestamp', meta?.fields)).toEqual('timestamp')
    expect(guessColumn('latitude', meta?.fields)).toEqual('lat')
    expect(guessColumn('longitude', meta?.fields)).toEqual('lon')
  })

  it('checks record validity correctly', () => {
    const badRecord = {
      latitude: 'ggg',
      longitude: 1234,
      timestamp: 'ggg',
    }
    const goodRecord = data.slice().pop() as Record<string, any>
    const columns = {
      latitude: 'lat',
      longitude: 'lon',
      timestamp: 'timestamp',
    }
    const errors = checkRecordValidity({ record: badRecord, ...columns })
    expect(errors).toEqual(['latitude', 'longitude', 'timestamp'])

    const noErrors = checkRecordValidity({
      record: goodRecord,
      ...columns,
    })
    expect(noErrors).toEqual([])
  })

  it('creates one segment per id', () => {
    expect(segments.length).toEqual(ids.length)
  })

  it.each(ids)('includes all the points of id %s in the track segment', (id) => {
    const segment = getSegmentById(id)
    const idPoints = data.filter((item: any) => item[columns.id] === id).length
    expect(segment?.length).toEqual(idPoints)
  })

  // Use a data sample to verify point by point
  const dataSample: any[] = ids.reduce((prev, id) => {
    return [
      ...prev,
      ...data
        // per id
        .filter((item: any) => item[columns.id] === id)
        // get only some records
        .slice(0, 20)
        // and add the index position that should match the position in the segment
        .map((r: any, i) => ({ ...r, i })),
    ]
  }, [])

  it.each(dataSample)(
    'checks point $i of id $id converted to segment. {lat: $lat, lon: $lon, timestamp: $timestamp} ',
    (point: any) => {
      const i = point.i
      const segment = getSegmentById(point[columns.id])
      const segmentPoint = segment[i]

      expect(segmentPoint).toBeDefined()
      expect(segmentPoint[0]?.latitude).toEqual(point[columns.latitude])
      expect(segmentPoint[0]?.longitude).toEqual(point[columns.longitude])
      const dateCsv = getUTCDate(point[columns.timestamp])
      expect(segmentPoint[0]?.timestamp).toEqual(dateCsv.getTime())
    }
  )
})
