import type { tile as TileType } from './decoders/4wings-tile'
import type { vessels as VesselType } from './decoders/vessels'
const tileDecoder = require('./decoders/4wings-tile')
const vesselsDecoder = require('./decoders/vessels')

const tile = tileDecoder.tile as typeof TileType
const vessels = vesselsDecoder.vessels as typeof VesselType
export { vessels, tile }
