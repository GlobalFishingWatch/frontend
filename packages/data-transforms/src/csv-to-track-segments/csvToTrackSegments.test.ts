import { parse } from 'papaparse'
import csvToTrackSegment from './csvToTrackSegments'
import checkRecordValidity from './checkRecordValidity'
import guessColumns from './guessColumns'
const fs = require('fs')
const path = require('path')
const rawCsv = fs.readFileSync(path.join(__dirname, 'test/mock.csv'), 'utf-8')

const { data, meta } = parse(rawCsv, { dynamicTyping: true, header: true })

it('guesses columns correctly', () => {
  const guessedColumns = guessColumns(meta?.fields)
  console.log(guessedColumns)
  expect(guessedColumns.timestamp).toEqual('timestamp')
  expect(guessedColumns.latitude).toEqual('location-lat')
  expect(guessedColumns.longitude).toEqual('location-long')
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
