import { performance } from 'perf_hooks'
import tap from 'tap'
import { aggregateTile, getTimeSeries } from '@globalfishingwatch/fourwings-aggregate'
import bigtile from './tiles/bigtile.mjs'

const feature1 = { properties: { rawValues: '[0,15340,15342,1,2,3]' } }
const feature2 = { properties: { rawValues: '[0,15340,15342,1,2,3]' } }
const feature3 = { properties: { rawValues: '[0,15341,15343,1,2,3]' } }
const feature4 = { properties: { rawValues: '[0,15340,15342,1,10,2,11,3,12]' } }
const feature5 = { properties: { rawValues: '[0,15341,15343,1,10,2,11,3,12]' } }

tap.strictSame(getTimeSeries([feature1], 1), [
  { frame: 15340, 0: 1 },
  { frame: 15341, 0: 2 },
  { frame: 15342, 0: 3 },
])
tap.strictSame(getTimeSeries([feature1, feature2], 1), [
  { frame: 15340, 0: 2 },
  { frame: 15341, 0: 4 },
  { frame: 15342, 0: 6 },
])
tap.strictSame(getTimeSeries([feature1, feature2, feature3], 1), [
  { frame: 15340, 0: 2 },
  { frame: 15341, 0: 5 },
  { frame: 15342, 0: 8 },
  { frame: 15343, 0: 3 },
])
tap.strictSame(getTimeSeries([feature4], 2), [
  { frame: 15340, 0: 1, 1: 10 },
  { frame: 15341, 0: 2, 1: 11 },
  { frame: 15342, 0: 3, 1: 12 },
])
tap.strictSame(getTimeSeries([feature4, feature5], 2), [
  { frame: 15340, 0: 1, 1: 10 },
  { frame: 15341, 0: 3, 1: 21 },
  { frame: 15342, 0: 5, 1: 23 },
  { frame: 15343, 0: 3, 1: 12 },
])

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
  breaks: [
    [0, 31, 186, 310, 930],
    [0, 31, 186, 310, 930],
  ],
  // "breaks":[[0,31,186],[0,31,186]],
  // "breaks":[[0,31,186,310,930]],
  // "sublayerCombinationMode":"max",
  sublayerCombinationMode: 'max',
  tileBBox: [-22.5, 40.97989806962013, 0, 55.77657301866769],
  interactive: true,
  sublayerVisibility: [true, true, true],
})

let sum = 0
for (var i = 0; i < 20; i++) {
  const t = performance.now()
  const timeseries = getTimeSeries(geojson.interactive.features, 2, 15340)
  const delta = performance.now() - t
  // console.log(delta)
  sum += delta
}

console.log('avg:', sum / 20)
