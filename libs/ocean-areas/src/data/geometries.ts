import type { FeatureCollection, Geometry } from 'geojson'
import type { OceanAreaProperties } from '../ocean-areas'
import oceans from './oceans'
import eezs from './eezs'
import mpas from './mpas'

const geometries: FeatureCollection<Geometry, OceanAreaProperties> = {
  type: 'FeatureCollection',
  features: [...oceans.features, ...eezs.features, ...mpas.features],
}

export default geometries
