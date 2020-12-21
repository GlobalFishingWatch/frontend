import { BBox, Feature, Geometry } from 'geojson'

export interface OceanAreaProperties {
  type: string
  name: string
  mrgid?: string
  bounds?: BBox
}

export type OceanArea = Feature<Geometry, OceanAreaProperties>

export * from './ocean-areas'
