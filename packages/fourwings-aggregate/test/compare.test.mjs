import tap from 'tap'
import { aggregateTile } from '@globalfishingwatch/fourwings-aggregate'
import tile from './tiles/compare.mjs'
import { getAt } from './util.mjs'

const FRAME = 1863
const BASE_CONFIG = {
  aggregationOperation: 'sum',
  delta: 1,
  geomType: 'rectangle',
  interactive: true,
  // interval: "10days",
  quantizeOffset: FRAME,
  singleFrame: false,
  sublayerCombinationMode: 'timecompare',
  sublayerCount: 2,
  sublayerVisibility: [true, true],
  x: 68,
  y: 122,
  z: 8,
  tileBBox: [-84.375, 7.013667927566632, -82.96875, 8.407168163601074],
}
const sublayerBreaks = [[-7000, -3000, -1000, -500, -100, 0, 100, 500, 1000, 3000, 7000]]

const agg = aggregateTile(tile, BASE_CONFIG)
// console.log(agg.main.features[0])
// console.log(agg.interactive.features[0])

const FEATURE = 0
const TEST = [1, 1, 0, 1863, 1866, 5000, 0, 0, 1000, 10, 20, 2000, 2000]

tap.equal(getAt(TEST, BASE_CONFIG, {}, FEATURE, 0), -5000)
tap.equal(getAt(TEST, BASE_CONFIG, {}, FEATURE, 1), 1000)
tap.equal(getAt(TEST, BASE_CONFIG, { delta: 3 }, FEATURE, 0), -3990)
tap.equal(getAt(TEST, BASE_CONFIG, { delta: 3 }, FEATURE, 1), 1010)

tap.equal(getAt(TEST, BASE_CONFIG, { sublayerBreaks }, FEATURE, 0), 1)
tap.equal(getAt(TEST, BASE_CONFIG, { sublayerBreaks }, FEATURE, 1), 8)
tap.equal(getAt(TEST, BASE_CONFIG, { sublayerBreaks, delta: 3 }, FEATURE, 0), 1)
tap.equal(getAt(TEST, BASE_CONFIG, { sublayerBreaks }, FEATURE, 4), undefined)

// const TILE = [
//   53, 113, 2322, 18468, 18560, 0, 194, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//   0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//   0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//   0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//   0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//   0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
// ]
// const BASE_CONFIG_2 = {
//   ...BASE_CONFIG,
//   delta: 92,
//   quantizeOffset: 18262,
//   interval: 'day',
//   tileBBox: [0, -85.0511287798066, 180, 0],
//   x: 1,
//   y: 1,
//   z: 1,
//   sublayerBreaks: [[-10000000, -5000000, -800000, 0, 800000, 5000000, 10000000]],
// }
// const agg2 = aggregateTile(TILE, BASE_CONFIG_2)
// // console.log(agg2.main.features[0].properties)
