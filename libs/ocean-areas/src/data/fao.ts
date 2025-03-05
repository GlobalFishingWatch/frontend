import type { Feature, FeatureCollection, Geometry, MultiPolygon, Polygon } from 'geojson'

import type { OceanAreaProperties } from '../ocean-areas'

import faoData from './source/fao.json'

const fao: FeatureCollection<Geometry, OceanAreaProperties> = {
  type: 'FeatureCollection',
  features: faoData as Feature<Polygon | MultiPolygon, OceanAreaProperties>[],
}

export default fao
