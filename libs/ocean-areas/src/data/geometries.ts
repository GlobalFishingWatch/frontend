import { FeatureCollection, Geometry } from 'geojson'
import { OceanAreaProperties } from '../ocean-areas'
import areas from './areas'
import mpas from './mpas'

const geometries: FeatureCollection<Geometry, OceanAreaProperties> = {
  type: 'FeatureCollection',
  features: [...areas.features, ...mpas.features],
}

export default geometries
