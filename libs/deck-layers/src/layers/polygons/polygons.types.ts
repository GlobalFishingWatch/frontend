import { BaseLayerProps } from '../../types'

export type PolygonsLayerProps = BaseLayerProps & {
  id: string
  color: string
  dataUrl: string
}
