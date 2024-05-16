import { Feature, LineString } from 'geojson'
import { BaseLayerProps } from '../../types'

export type GraticuleLineGroup = 1 | 5 | 10 | 30 | 90

export type GraticulesLayerProps = BaseLayerProps & {
  color: string
}

export type ViewportSize = {
  width: number
  height: number
}

export type GraticulesLayerState = {
  viewportHash: string
  data: Feature<LineString>[]
}

export type GraticulesProperties = {
  scaleRank: GraticuleLineGroup
  label: string
  type: 'lat' | 'lon'
}

export type GraticulesFeature = Feature<LineString, GraticulesProperties>
