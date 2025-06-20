import type { FeatureCollection, Geometry } from 'geojson'

import type { OceanAreaProperties } from '../ocean-areas'

import eezs from './eezs'
import fao from './fao'
import mpas from './mpas'
import ports from './ports'
import rfmos from './rfmos'

const geometries: FeatureCollection<Geometry, OceanAreaProperties> = {
  type: 'FeatureCollection',
  features: [
    ...eezs.features,
    ...mpas.features,
    ...fao.features,
    ...rfmos.features,
    ...ports.features,
  ],
}

export default geometries
