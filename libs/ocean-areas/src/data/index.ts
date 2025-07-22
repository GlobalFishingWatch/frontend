import type { Feature, FeatureCollection, Geometry, MultiPolygon, Polygon } from 'geojson'

import type { OceanAreaProperties } from '../ocean-areas'

import eezs from './eezs.json'
import fao from './fao.json'
import mpas from './mpas.json'
import ports from './ports.json'
import rfmos from './rfmos.json'

const data: FeatureCollection<Geometry, OceanAreaProperties> = {
  type: 'FeatureCollection',
  features: [...eezs, ...mpas, ...fao, ...rfmos, ...ports] as Feature<
    Polygon | MultiPolygon,
    OceanAreaProperties
  >[],
}

export default data
