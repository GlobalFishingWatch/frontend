import { performance } from 'perf_hooks'
import { aggregate, BBox, GeomType, SublayerCombinationMode } from '../src/'
import bigtile from './tiles/bigtile.js'

const BASE_CONFIG = {
  delta: 1,
  geomType: GeomType.rectangle,
  interval: 'day',
  interactive: true,
  sublayerCombinationMode: SublayerCombinationMode.Add,
  // sublayerBreaks: [[0, 100, 500, 1000, 1500, 3000]],
  sublayerCount: 1,
  quantizeOffset: 15340,
  sublayerVisibility: [true, true, true],
  singleFrame: false,
  tileBBox: [-22.5, -21.943045533438177, 0, 0] as BBox,
  x: 7,
  y: 8,
  z: 4,
}

describe('Aggregate tile', () => {
  test('basic aggregation', () => {
    //             row,col, cel
    //                                     0                5            10               15
    // prettier-ignore
    const MOCK = [1, 1,  0, 15340,15355,4200,200,100,0,0,1200,0,0,0,0,300,200,100,0,0,12300,0]
    expect(aggregate(MOCK, { ...BASE_CONFIG, delta: 1 }).main.features[0].properties).toMatchObject(
      {
        '0': 4200,
      }
    )
    expect(aggregate(MOCK, { ...BASE_CONFIG, delta: 5 }).main.features[0].properties).toMatchObject(
      {
        '0': 4500,
        '1': 1500,
        '10': 600,
      }
    )
    expect(aggregate(MOCK, { ...BASE_CONFIG, delta: 6 }).main.features[0].properties).toMatchObject(
      {
        '10': 12900,
      }
    )
  })

  test('trailing values', () => {
    const MOCK = [1, 1, 0, 15350, 15359, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    expect(aggregate(MOCK, { ...BASE_CONFIG, delta: 5 }).main.features[0].properties).toMatchObject(
      {
        '10': 15, // frame 10 --> q 15350
        '11': 20,
      }
    )
  })

  // Reminder: quantizeOffset is set at 15340 in BASE_CONFIG, so no values from 0 to 5
  test('single frame', () => {
    const MOCK = [1, 1, 0, 15350, 15350, 42]
    expect(aggregate(MOCK, { ...BASE_CONFIG, delta: 5 }).main.features[0].properties).toStrictEqual(
      {
        '6': 42,
        '7': 42,
        '8': 42,
        '9': 42,
        '10': 42,
        // below, not relevant in the test but we want to toStrictEqual check to be sure that '11' === undefined
        _col: 0,
        _row: 0, //
      }
    )
  })
  test('two frames', () => {
    const MOCK = [1, 1, 0, 15350, 15351, 42, 42]
    expect(aggregate(MOCK, { ...BASE_CONFIG, delta: 5 }).main.features[0].properties).toStrictEqual(
      {
        '6': 42,
        '7': 84,
        '8': 84,
        '9': 84,
        '10': 84,
        '11': 42,
        // below, not relevant in the test but we want to toStrictEqual check to be sure that '11' === undefined
        _col: 0,
        _row: 0, //
      }
    )
  })

  test('buckets resolution', () => {
    const CONFIG_WITH_BUCKETS = {
      ...BASE_CONFIG,
      sublayerBreaks: [[0, 100, 500, 1000, 1500, 3000]],
    }
    expect(
      aggregate([1, 1, 0, 15340, 15341, 42, 0], CONFIG_WITH_BUCKETS).main.features[0].properties[0]
    ).toBe(1)
    expect(
      aggregate([1, 1, 0, 15340, 15341, 142, 0], CONFIG_WITH_BUCKETS).main.features[0].properties[0]
    ).toBe(2)
    expect(
      aggregate([1, 1, 0, 15340, 15341, 2999, 0], CONFIG_WITH_BUCKETS).main.features[0]
        .properties[0]
    ).toBe(5)
    expect(
      aggregate([1, 1, 0, 15340, 15341, 3001, 0], CONFIG_WITH_BUCKETS).main.features[0]
        .properties[0]
    ).toBe(6)
    expect(
      aggregate([1, 1, 0, 15340, 15341, 0, 0], CONFIG_WITH_BUCKETS).main.features[0].properties[0]
    ).toBeUndefined()
  })

  test('using sublayers, combined with Add', () => {
    const CONFIG = {
      ...BASE_CONFIG,
      sublayerCount: 2,
    }
    expect(
      aggregate([1, 1, 0, 15340, 15341, 42, 43, 0, 0], CONFIG).main.features[0].properties[0]
    ).toBe(85)
    expect(
      aggregate([1, 1, 0, 15340, 15341, 42, 43, 0, 0, 1, 15340, 15341, 52, 53, 0, 0], CONFIG).main
        .features[1].properties[0]
    ).toBe(105)
  })
  test('using sublayers, combined with Max', () => {
    const CONFIG = {
      ...BASE_CONFIG,
      sublayerCount: 2,
      sublayerCombinationMode: SublayerCombinationMode.Max,
    }
    // TODO FIXME AND DECIDE WHAT TO DO WITH MAX + NO BUCKETS
    // expect(
    //   aggregate([1, 1, 0, 15340, 15341, 42, 43, 0, 0], CONFIG).main.features[0].properties[0]
    // ).toBe('1;83')

    const CONFIG_WITH_BUCKETS = {
      ...CONFIG,
      sublayerBreaks: [
        [0, 100, 200, 1000, 1500, 3000],
        [0, 100, 200, 1000, 1500, 3000],
      ],
    }

    expect(
      aggregate([1, 1, 0, 15340, 15341, 253, 52, 0, 0], CONFIG_WITH_BUCKETS).main.features[0]
        .properties[0]
    ).toBe(3)
    expect(
      aggregate([1, 1, 0, 15340, 15341, 52, 253, 0, 0], CONFIG_WITH_BUCKETS).main.features[0]
        .properties[0]
    ).toBe(10 + 3)
  })

  test('using sublayers, combined with Bivariate', () => {})
})

/*



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
  sum += delta
}
console.info('avg:', sum / 20)

*/
