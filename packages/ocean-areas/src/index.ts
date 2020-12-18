import { BBox, Feature, Geometry } from 'geojson'

export interface OceanAreaProperties {
  type: string
  name: string
  bounds?: BBox
}

export type OceanArea = Feature<Geometry, OceanAreaProperties>

export * from './ocean-areas'
