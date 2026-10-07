import type { Feature } from 'geojson'

export type AreaType = 'eez' | 'mpa' | 'fao' | 'rfmo' | 'port'

export type AreaGeometryMode = 'bbox' | 'simplify' | 'point'
export type AreaConfig = {
  type: AreaType
  path: string
  fileName?: string
  bucketFolder: string
  skipDownload?: boolean
  propertiesMapping: {
    area: string
    name: string
    flag?: string
  }
  geometryMode?: AreaGeometryMode
  /** Computed `flag`, for when it is not a plain property copy (wins over `propertiesMapping.flag`) */
  getFlag?: (area: Feature) => string | undefined
  /** Surface in m² from the source data; defaults to turf's area of the full-resolution geometry */
  getAreaSize?: (area: Feature) => number | undefined
  filter?: (area: Feature) => boolean
  limitBy?: (areas: Feature[]) => Feature[]
}
