import csvToTrackSegment from './csvToTrackSegments'
import guessColumns from './guessColumns'
const fs = require('fs')
const path = require('path')
const rawCsv = fs.readFileSync(path.join(__dirname, 'test/mock.csv'), 'utf-8')

it('guesses columns correctly', () => {
  const guessedColumns = guessColumns(rawCsv)
  console.log(guessedColumns)
  expect(guessedColumns.timestamp).toEqual('timestamp')
  expect(guessedColumns.latitude).toEqual('location-lat')
  expect(guessedColumns.longitude).toEqual('location-long')
})
