import { Feature, LineString } from 'geojson'
import { BaseLayerProps } from '../../types'

export type GraticulesLayerProps = BaseLayerProps & {
  color: string
}

export type GraticulesLayerState = {
  zoom: number
  data: Feature<LineString>[]
}

export type GraticulesFeature = Feature<LineString>
