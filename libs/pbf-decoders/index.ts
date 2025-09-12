import type { tile as TileType } from './decoders/4wings-tile'
import { tile as tileDecoder } from './decoders/4wings-tile.js'
import type { vessels as VesselType } from './decoders/vessels'
import { vessels as vesselsDecoder } from './decoders/vessels.js'

export const tile = tileDecoder as typeof TileType
export const vessels = vesselsDecoder as typeof VesselType
