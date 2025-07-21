import type { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson'

import type { OceanAreaProperties } from '../ocean-areas'

import mpas from './source/mpas.json'

const mpasAreas: FeatureCollection<any, OceanAreaProperties> = {
  type: 'FeatureCollection',
  features: mpas as Feature<Polygon | MultiPolygon, OceanAreaProperties>[],
}
export default mpasAreas
