const fs = require('fs')
const FourwingsTile = require('../decoders/4wings-tile')

const tileRaw = fs.readFileSync('./test/cache-yearly.pbf')

const decoded = FourwingsTile.tile.Tile.decode(tileRaw)
console.info(decoded)
