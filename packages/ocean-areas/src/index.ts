import { BBox, Feature, Geometry } from 'geojson'

export interface OceanAreaProperties {
  type: string
  name: string
  area: number
  mrgid?: string
  bounds?: BBox
}

export type OceanArea = Feature<Geometry, OceanAreaProperties>

export * from './ocean-areas'
