const fs = require('fs')
const FourwingsTile = require('../decoders/4wings-tile')

const tileRaw = fs.readFileSync('./test/4wings-tile.pbf')

const decoded = FourwingsTile.tile.Tile.decode(tileRaw)
console.log(decoded)
