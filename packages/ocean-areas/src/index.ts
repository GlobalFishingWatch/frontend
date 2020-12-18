import { BBox, Feature, Geometry } from 'geojson'
import oceanAreas from './ocean-areas-data'

export interface OceanAreaProperties {
  type: string
  name: string
  bounds?: BBox
}

export type OceanArea = Feature<Geometry, OceanAreaProperties>

export * from './ocean-areas'
export default oceanAreas
