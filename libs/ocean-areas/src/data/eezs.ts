import type { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson'

import type { OceanAreaProperties } from '../ocean-areas'

import eezsData from './eezs.json'

const eezs: FeatureCollection<any, OceanAreaProperties> = {
  type: 'FeatureCollection',
  features: eezsData as Feature<Polygon | MultiPolygon, OceanAreaProperties>[],
}

export default eezs
