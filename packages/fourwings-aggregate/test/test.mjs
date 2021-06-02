// import { aggregateCell, aggregateTile } from '@globalfishingwatch/fourwings-aggregate'
// import tile from './tiles/inconsistency.mjs'

// const BASE_CONFIG = {
//   aggregationOperation: "sum",
//   delta: 73,
//   geomType: "rectangle",
//   interactive: true,
//   interval: "10days",
//   quantizeOffset: 0,
//   singleFrame: false,
//   sublayerBreaks: [[0, 100, 200, 300, 400, 500, 600, 800, 900]],
//   sublayerCombinationMode: "max",
//   sublayerCount: 1,
//   sublayerVisibility: [true],
//   x: 68,
//   y: 122,
//   z: 8,
//   tileBBox: [-84.375, 7.013667927566632, -82.96875, 8.407168163601074]
// }

// const FRAME = 1815

// const agg = aggregateTile(tile, BASE_CONFIG)
// const featAggTileCell = agg.main.features.find(
//   (f) => f.id === 933534
// )

// const featAggTileRawCell = agg.interactive.features.find(
//   (f) => f.id === 933534
// )
// const featAggTileRawCellFrame = aggregateCell({
//   rawValues: JSON.stringify(featAggTileRawCell.properties.rawValues),
//   frame: FRAME,
//   delta: BASE_CONFIG.delta,
//   quantizeOffset: BASE_CONFIG.quantizeOffset,
//   sublayerCount: BASE_CONFIG.sublayerCount,
// })


// console.log(featAggTileCell)
// console.log(JSON.stringify(featAggTileRawCell.properties.rawValues))