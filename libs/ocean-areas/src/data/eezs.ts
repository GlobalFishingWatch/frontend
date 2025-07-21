import type { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson'

import type { OceanAreaProperties } from '../ocean-areas'

import eezsData from './source/eezs.json'

const eezsAreas: FeatureCollection<any, OceanAreaProperties> = {
  type: 'FeatureCollection',
  features: eezsData as Feature<Polygon | MultiPolygon, OceanAreaProperties>[],
}
export default eezsAreas
