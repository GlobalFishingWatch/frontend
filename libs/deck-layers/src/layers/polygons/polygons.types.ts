import { FeatureCollection } from 'geojson'
import { BaseLayerProps } from '../../types'
import { LayerGroup } from '../../utils'

export type PolygonsLayerProps = BaseLayerProps & {
  id: string
  color: string
  data: string | FeatureCollection
  group?: LayerGroup
}
