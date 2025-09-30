import type { Feature } from 'geojson'

export type AreaType = 'eez' | 'mpa' | 'fao' | 'rfmo' | 'port'

export type AreaGeometryMode = 'bbox' | 'simplify' | 'point'
export type AreaConfig = {
  type: AreaType
  path: string
  bucketFolder: string
  skipDownload?: boolean
  propertiesMapping: {
    area: string
    name: string
  }
  geometryMode?: AreaGeometryMode
  filter?: (area: Feature) => boolean
  limitBy?: (areas: Feature[]) => Feature[]
}
