import tap from 'tap'
import { aggregateTile, aggregateCell } from '../dist/index.js'
import { getAt } from './util.mjs'

const BASE_CONFIG = {
  delta: 1,
  geomType: 'gridded',
  interval: 'day',
  sublayerCombinationMode: 'none',
  sublayerCount: 1,
  sublayerVisibility: [true],
  quantizeOffset: 15340,
  singleFrame: false,
  tileBBox: [-22.5, -21.943045533438177, 0, 0],
  x: 7,
  y: 8,
  z: 4,
  interactive: true,
}

// aggregation per se
//
//             row,col, cel
//                                     0                5            10               15
// prettier-ignore
const aggTest = [1, 1,  0, 15340,15355,4200,200,100,0,0,1200,0,0,0,0,300,200,100,0,0,12300]

const aggCell = (cell, frame, delta) => {
  const featAggTileRawCellFrame = aggregateCell(
    JSON.stringify(cell.properties.rawValues),
    frame,
    delta,
    BASE_CONFIG.quantizeOffset,
    BASE_CONFIG.sublayerCount,
    'avg',
    1
  )
  return featAggTileRawCellFrame[0]
}
const tile = aggregateTile(aggTest, BASE_CONFIG)
const cell = tile.interactive.features[0]

tap.equal(getAt(aggTest, BASE_CONFIG, {}, 0, 0), 4200)
tap.equal(getAt(aggTest, BASE_CONFIG, { aggregationOperation: 'avg' }, 0, 0), 4200)
tap.equal(aggCell(cell, 0, 1), 4200)
tap.equal(getAt(aggTest, BASE_CONFIG, { aggregationOperation: 'avg' }, 0, 1), 200)
tap.equal(aggCell(cell, 1, 1), 200)
tap.equal(getAt(aggTest, BASE_CONFIG, { aggregationOperation: 'avg', delta: 2 }, 0, 0), 2200)
tap.equal(aggCell(cell, 0, 2), 2200)
tap.equal(getAt(aggTest, BASE_CONFIG, { aggregationOperation: 'avg', delta: 2 }, 0, 1), 150)
tap.equal(aggCell(cell, 1, 2), 150)
tap.equal(getAt(aggTest, BASE_CONFIG, { aggregationOperation: 'avg', delta: 10 }, 0, 0), 570)
tap.equal(aggCell(cell, 0, 10), 570)
tap.equal(getAt(aggTest, BASE_CONFIG, { aggregationOperation: 'avg', delta: 10 }, 0, 10), 2150)
tap.equal(aggCell(cell, 10, 10), 2150)
tap.equal(getAt(aggTest, BASE_CONFIG, { aggregationOperation: 'avg', delta: 1 }, 0, 15), 12300)
tap.equal(aggCell(cell, 15, 1), 12300)
