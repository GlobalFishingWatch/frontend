import tap from 'tap'
import { aggregateTile, aggregateCell, getRealValue } from '@globalfishingwatch/fourwings-aggregate'
import tile from './tiles/test323.mjs'

const FRAME = 5
const BASE_CONFIG = {
  breaks: [
    [0, 13672, 54688, 82031, 136719, 273438, 410156.00000000006, 683594],
    [0, 13672, 54688, 82031, 136719, 273438, 410156.00000000006, 683594],
    [0, 13672, 54688, 82031, 136719, 273438, 410156.00000000006, 683594],
  ],
  delta: 35,
  geomType: 'gridded',
  interval: 'day',
  sublayerCombinationMode: 'literal',
  sublayerCount: 3,
  quantizeOffset: 17897,
  singleFrame: false,
  tileBBox: [-22.5, -21.943045533438177, 0, 0],
  x: 3,
  y: 2,
  z: 3,
  sublayerVisibility: [true, true, true],
  interactive: true,
  datasets:
    'datasets[0]=fishing_v4&datasets[1]=chile-fishing:v20200331&datasets[2]=indonesia-fishing:v20200320',
  'date-range': '2019-01-01T00:00:00.000Z,2020-04-10T00:00:00.000Z',
}

const agg = aggregateTile(tile, BASE_CONFIG)
const featAggTileCell = agg.main.features.find(
  (f) => f.properties._col === 48 && f.properties._row === 70
)
const featAggTileCellFrame = JSON.parse(featAggTileCell.properties[FRAME])

const featAggTileRawCell = agg.interactive.features.find(
  (f) => f.properties._col === 48 && f.properties._row === 70
)
const featAggTileRawCellFrame = aggregateCell({
  rawValues: JSON.stringify(featAggTileRawCell.properties.rawValues),
  frame: FRAME,
  delta: BASE_CONFIG.delta,
  quantizeOffset: BASE_CONFIG.quantizeOffset,
  sublayerCount: BASE_CONFIG.sublayerCount,
})

const datasetIndex = 0
tap.equal(getRealValue(featAggTileCellFrame[datasetIndex]), featAggTileRawCellFrame[datasetIndex])
