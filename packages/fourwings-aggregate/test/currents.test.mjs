import tap from 'tap'
import { aggregateTile, aggregateCell, getRealValue } from '@globalfishingwatch/fourwings-aggregate'
import tile from './tiles/current-um-vm.mjs'

const BASE_CONFIG = {
  delta: 1,
  geomType: 'gridded',
  interval: '10days',
  sublayerCombinationMode: 'currents',
  // sublayerBreaks: [[0, 100, 500, 1000, 1500, 3000]],
  sublayerCount: 2,
  // quantizeOffset: 15340,
  sublayerVisibility: [true, true],
  singleFrame: false,
  tileBBox: [-90, 0, 0, 66.51326044311186],
  x: 2,
  y: 1,
  z: 1,
}

const agg = aggregateTile(tile, BASE_CONFIG)
console.log(agg.main.features[0])
console.log(agg.main.features[1])
