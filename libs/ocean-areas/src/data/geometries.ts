import type { FeatureCollection, Geometry } from 'geojson'

import type { OceanAreaProperties } from '../ocean-areas'

import eezs from './eezs'
import mpas from './mpas'
import oceans from './oceans'

const geometries: FeatureCollection<Geometry, OceanAreaProperties> = {
  type: 'FeatureCollection',
  features: [...oceans.features, ...eezs.features, ...mpas.features],
}

export default geometries
