import type { Feature } from 'geojson'

export type AreaType = 'eez' | 'mpa' | 'fao' | 'rfmo'

export type AreaConfig = {
  type: AreaType
  path: string
  bucketFolder: string
  skipDownload?: boolean
  propertiesMapping: {
    area: string
    name: string
  }
  filter?: (area: Feature) => boolean
  limitBy?: (areas: Feature[]) => Feature[]
}
