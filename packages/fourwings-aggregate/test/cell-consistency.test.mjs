import tap from 'tap'
import { aggregateTile, aggregateCell, getRealValue } from '@globalfishingwatch/fourwings-aggregate'

const BASE_CONFIG = {
  sublayerCombinationMode: 'add',
  delta: 72,
  geomType: 'rectangle',
  interactive: true,
  interval: '10days',
  sublayerCount: 1,
  quantizeOffset: 0,
  singleFrame: false,
  tileBBox: [90, -11.178401873711792, 101.25, 0],
  sublayerVisibility: [true],
  x: 24,
  y: 16,
  z: 5,
}

const NUM_ROWS = 112
const NUM_COLS = 113
const numCells = NUM_ROWS * NUM_COLS

const TEST_FRAME = 1753
const TEST_VALUE = 1000
const TEST_CELL_INDEX = numCells / 2

const testTile = [NUM_ROWS, NUM_COLS]
for (let cell = 0; cell < numCells; cell++) {
  testTile.push(cell)
  testTile.push(1800)
  testTile.push(1800)
  testTile.push(TEST_VALUE)
}
const agg = aggregateTile(testTile, BASE_CONFIG)

const firstFeature = agg.main.features[0]
const lastFeature = agg.main.features[TEST_CELL_INDEX]
const firstFeatureInteractive = agg.interactive.features[0]
const lastFeatureInteractive = agg.interactive.features[TEST_CELL_INDEX]

const firstFeatureInteractiveRawCellFrame = aggregateCell({
  rawValues: JSON.stringify(firstFeatureInteractive.properties.rawValues),
  frame: TEST_FRAME,
  delta: BASE_CONFIG.delta,
  quantizeOffset: BASE_CONFIG.quantizeOffset,
  sublayerCount: BASE_CONFIG.sublayerCount,
})
const lastFeatureInteractiveRawCellFrame = aggregateCell({
  rawValues: JSON.stringify(lastFeatureInteractive.properties.rawValues),
  frame: TEST_FRAME,
  delta: BASE_CONFIG.delta,
  quantizeOffset: BASE_CONFIG.quantizeOffset,
  sublayerCount: BASE_CONFIG.sublayerCount,
})

tap.equals(firstFeature.properties[TEST_FRAME], TEST_VALUE)
tap.equals(firstFeature.properties[TEST_FRAME], lastFeature.properties[TEST_FRAME])
tap.equals(firstFeatureInteractiveRawCellFrame[0], getRealValue(TEST_VALUE))
tap.equals(firstFeatureInteractiveRawCellFrame[0], lastFeatureInteractiveRawCellFrame[0])
