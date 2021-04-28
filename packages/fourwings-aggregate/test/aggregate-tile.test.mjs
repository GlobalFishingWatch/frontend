import { performance } from 'perf_hooks'
import tap from 'tap'
import { aggregateTile, generateUniqueId } from '../dist/index.js'
import bigtile from './tiles/bigtile.mjs'
import { getAt } from './util.mjs'

const BASE_CONFIG = {
  delta: 1,
  geomType: 'gridded',
  interval: 'day',
  sublayerCombinationMode: 'add',
  sublayerBreaks: [[0, 100, 500, 1000, 1500, 3000]],
  sublayerCount: 1,
  quantizeOffset: 15340,
  sublayerVisibility: [true, true, true],
  singleFrame: false,
  tileBBox: [-22.5, -21.943045533438177, 0, 0],
  x: 7,
  y: 8,
  z: 4,
}

// aggregation per se
//
//             row,col, cel
//                                     0                5            10               15
// prettier-ignore
const aggTest = [1, 1,  0, 15340,15355,4200,200,100,0,0,1200,0,0,0,0,300,200,100,0,0,12300,0]

tap.equal(getAt(aggTest, BASE_CONFIG, { sublayerBreaks: undefined, delta: 1 }, 0, 0), 4200)
tap.equal(getAt(aggTest, BASE_CONFIG, { sublayerBreaks: undefined, delta: 5 }, 0, 0), 4500)
tap.equal(getAt(aggTest, BASE_CONFIG, { sublayerBreaks: undefined, delta: 5 }, 0, 1), 1500)
tap.equal(getAt(aggTest, BASE_CONFIG, { sublayerBreaks: undefined, delta: 5 }, 0, 10), 600)
tap.equal(getAt(aggTest, BASE_CONFIG, { sublayerBreaks: undefined, delta: 6 }, 0, 10), 12900)
// tap.equal(getAt(aggTest, { sublayerBreaks: undefined, delta: 7 }, 0, 10), 12900)
//                                     0              5            9

// Test 'trailing values'
const aggTest2 = [1, 1, 0, 15350, 15359, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
tap.equal(getAt(aggTest2, BASE_CONFIG, { sublayerBreaks: undefined, delta: 5 }, 0, 10), 15) // frame 10 --> q 15350
tap.equal(getAt(aggTest2, BASE_CONFIG, { sublayerBreaks: undefined, delta: 5 }, 0, 11), 20)

const aggTest3 = [1, 1, 0, 15350, 15350, 42]
tap.equal(getAt(aggTest3, BASE_CONFIG, { sublayerBreaks: undefined, delta: 5 }, 0, 6), 42)
tap.equal(getAt(aggTest3, BASE_CONFIG, { sublayerBreaks: undefined, delta: 5 }, 0, 7), 42)
tap.equal(getAt(aggTest3, BASE_CONFIG, { sublayerBreaks: undefined, delta: 5 }, 0, 10), 42)
tap.equal(getAt(aggTest3, BASE_CONFIG, { sublayerBreaks: undefined, delta: 5 }, 0, 11), undefined)

const aggTest4 = [1, 1, 0, 15350, 15351, 42, 42]
tap.equal(getAt(aggTest4, BASE_CONFIG, { sublayerBreaks: undefined, delta: 5 }, 0, 6), 42)
tap.equal(getAt(aggTest4, BASE_CONFIG, { sublayerBreaks: undefined, delta: 5 }, 0, 7), 84)
tap.equal(getAt(aggTest4, BASE_CONFIG, { sublayerBreaks: undefined, delta: 5 }, 0, 11), 42)
tap.equal(getAt(aggTest3, BASE_CONFIG, { sublayerBreaks: undefined, delta: 5 }, 0, 12), undefined)

// bucket stuff
tap.equal(getAt([1, 1, 0, 15340, 15341, 42, 0], BASE_CONFIG, {}, 0, 0), 1)
tap.equal(getAt([1, 1, 0, 15340, 15341, 142, 0], BASE_CONFIG, {}, 0, 0), 2)
tap.equal(getAt([1, 1, 0, 15340, 15341, 2999, 0], BASE_CONFIG, {}, 0, 0), 5)
tap.equal(getAt([1, 1, 0, 15340, 15341, 3001, 0], BASE_CONFIG, {}, 0, 0), 6)
tap.equal(getAt([1, 1, 0, 15340, 15341, 999999, 0], BASE_CONFIG, {}, 0, 0), 6)
tap.equal(getAt([1, 1, 0, 15340, 15341, 0, 0], BASE_CONFIG, {}, 0, 0), undefined)
tap.equal(
  getAt([1, 1, 0, 15340, 15341, 42, 0], BASE_CONFIG, { sublayerBreaks: undefined }, 0, 0),
  42
)

tap.equal(
  getAt(
    [1, 1, 0, 15340, 15341, 42, 43, 0, 0],
    BASE_CONFIG,
    { sublayerCount: 2, sublayerBreaks: undefined },
    0,
    0
  ),
  85
)

tap.equal(
  getAt(
    [1, 1, 0, 15340, 15341, 42, 43, 0, 0, 1, 15340, 15341, 52, 53, 0, 0],
    BASE_CONFIG,
    { sublayerCount: 2, sublayerBreaks: undefined },
    1,
    0
  ),
  105
) // test with 2 features
tap.equal(
  getAt(
    [1, 1, 0, 15340, 15341, 42, 43, 0, 0],
    BASE_CONFIG,
    { sublayerCount: 2, sublayerCombinationMode: 'max', sublayerBreaks: undefined },
    0,
    0
  ),
  '1;43'
)
tap.equal(getAt([1, 1, 0, 15340, 15341, 52, 53, 0, 0], BASE_CONFIG, { sublayerCount: 2 }, 0, 0), 2)
tap.equal(
  getAt(
    [1, 1, 0, 15340, 15341, 253, 52, 0, 0],
    BASE_CONFIG,
    {
      sublayerCount: 2,
      sublayerCombinationMode: 'max',
      sublayerBreaks: [
        [0, 100, 200, 1000, 1500, 3000],
        [0, 100, 200, 1000, 1500, 3000],
      ],
    },
    0,
    0
  ),
  3
)
tap.equal(
  getAt(
    [1, 1, 0, 15340, 15341, 52, 253, 0, 0],
    BASE_CONFIG,
    {
      sublayerCount: 2,
      sublayerCombinationMode: 'max',
      sublayerBreaks: [
        [0, 100, 200, 1000, 1500, 3000],
        [0, 100, 200, 1000, 1500, 3000],
      ],
    },
    0,
    0
  ),
  10 + 3
)

//bivariate
//  y: datasetB
//
//   |    0 | 0
//   |   --(u)--+---+---+---+
//   |    0 | 1 | 2 | 3 | 4 |
//   |      +---+---+---+---+
//   v      | 5 | 6 | 7 | 8 |
//          +---+---+---+---+
//          | 9 | 10| 11| 12|
//          +---+---+---+---+
//          | 13| 14| 15| 16|
//          +---+---+---+---+
//          --------------> x: datasetA
//
const bivBreaks = [
  [0, 100, 500, 1000],
  [0, 100, 500, 1000],
]
tap.equal(
  getAt(
    [1, 1, 0, 15340, 15341, 42, 987, 0, 0],
    BASE_CONFIG,
    { sublayerCount: 2, sublayerCombinationMode: 'bivariate', sublayerBreaks: undefined },
    0,
    0
  ),
  '42;987'
)
tap.equal(
  getAt(
    [1, 1, 0, 15340, 15341, 0, 0, 0, 0],
    BASE_CONFIG,
    { sublayerCount: 2, sublayerCombinationMode: 'bivariate', sublayerBreaks: bivBreaks },
    0,
    0
  ),
  undefined
)
tap.equal(
  getAt(
    [1, 1, 0, 15340, 15341, 99, 1001, 0, 0],
    BASE_CONFIG,
    { sublayerCount: 2, sublayerCombinationMode: 'bivariate', sublayerBreaks: bivBreaks },
    0,
    0
  ),
  13
)
tap.equal(
  getAt(
    [1, 1, 0, 15340, 15341, 101, 1001, 0, 0],
    BASE_CONFIG,
    { sublayerCount: 2, sublayerCombinationMode: 'bivariate', sublayerBreaks: bivBreaks },
    0,
    0
  ),
  14
)
tap.equal(
  getAt(
    [1, 1, 0, 15340, 15341, 1001, 0, 0, 0],
    BASE_CONFIG,
    { sublayerCount: 2, sublayerCombinationMode: 'bivariate', sublayerBreaks: bivBreaks },
    0,
    0
  ),
  4
)
tap.equal(
  getAt(
    [1, 1, 0, 15340, 15341, 9999, 9999, 0, 0],
    BASE_CONFIG,
    { sublayerCount: 2, sublayerCombinationMode: 'bivariate', sublayerBreaks: bivBreaks },
    0,
    0
  ),
  16
)
tap.equal(
  getAt(
    [1, 1, 0, 15340, 15341, 99, 99, 0, 0],
    BASE_CONFIG,
    { sublayerCount: 2, sublayerCombinationMode: 'bivariate', sublayerBreaks: bivBreaks },
    0,
    0
  ),
  1
)

// cumulative                                                                                                       AAAAAABBBBBBCCCCCC
tap.equal(
  getAt(
    [1, 1, 0, 15340, 15341, 100, 200, 300, 0, 0, 0],
    BASE_CONFIG,
    { sublayerCount: 3, sublayerCombinationMode: 'cumulative' },
    0,
    0
  ),
  '000100000300000600'
)
//                                                                                                                                  AAAAAABBBBBBCCCCCC
tap.equal(
  getAt(
    [1, 1, 0, 15340, 15341, 100, 200, 300, 400, 500, 600],
    BASE_CONFIG,
    { sublayerCount: 3, sublayerCombinationMode: 'cumulative', delta: 2 },
    0,
    0
  ),
  '000500001200002100'
)

//  Visibility
const visibilityConfig = {
  sublayerCount: 2,
  sublayerBreaks: undefined,
  sublayerVisibility: [false, true],
}
tap.equal(
  getAt([1, 1, 0, 15340, 15341, 4300, 4200, 0, 0], BASE_CONFIG, visibilityConfig, 0, 0),
  4200
)
tap.equal(
  getAt(
    [1, 1, 0, 15340, 15341, 4300, 4200, 0, 0],
    BASE_CONFIG,
    { ...visibilityConfig, sublayerCombinationMode: 'max' },
    0,
    0
  ),
  '1;4200'
)
tap.equal(
  getAt(
    [1, 1, 0, 15340, 15341, 4300, 4200, 0, 0],
    BASE_CONFIG,
    { ...visibilityConfig, sublayerCombinationMode: 'bivariate' },
    0,
    0
  ),
  '0;4200'
)
tap.equal(
  getAt(
    [1, 1, 0, 15340, 15342, 4300, 4200, 4300, 4200, 0, 0],
    BASE_CONFIG,
    { ...visibilityConfig, sublayerCombinationMode: 'max', delta: 2 },
    0,
    0
  ),
  '1;8400'
)

// test unique id for highlightedFeature
tap.equal(generateUniqueId(0, 0, 1234), 111234)

// perf test

let sum = 0
for (var i = 0; i < 20; i++) {
  const t = performance.now()
  const geojson = aggregateTile(bigtile, {
    x: 7,
    y: 5,
    z: 4,
    singleFrame: false,
    quantizeOffset: 15340,
    geomType: 'rectangle',
    delta: 31,
    sublayerCount: 2,
    interval: 'day',
    sublayerBreaks: [
      [0, 31, 186, 310, 930],
      [0, 31, 186, 310, 930],
    ],
    // "sublayerBreaks":[[0,31,186],[0,31,186]],
    // "sublayerBreaks":[[0,31,186,310,930]],
    // "sublayerCombinationMode":"compare",
    sublayerCombinationMode: 'max',
    tileBBox: [-22.5, 40.97989806962013, 0, 55.77657301866769],
    interactive: true,
    sublayerVisibility: [true, true, true],
  })
  const delta = performance.now() - t
  // console.log(delta)
  sum += delta
}
console.log('avg:', sum / 20)
