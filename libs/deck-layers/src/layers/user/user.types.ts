import { PickingInfo } from '@deck.gl/core'
import { Feature, Geometry } from 'geojson'
import { Tile2DHeader } from '@deck.gl/geo-layers/dist/tileset-2d'
import { DataviewCategory, DataviewType } from '@globalfishingwatch/api-types'
import { ContextLayerConfig } from '../context'
import { BaseLayerProps } from '../../types'

export type UserContextLayerProps = BaseLayerProps & {
  id: string
  layers: ContextLayerConfig<string>[]
  color: string
  idProperty?: string
  valueProperties?: string[]
  highlightedFeatures?: UserContextPickingObject[]
  // TODO:deck implement logic for all of these properties
  /**
   * Disable interaction (needed when user uploaded a non-polygon layer)
   * legacy known as disableInteraction
   */
  interactive?: boolean
  /**
   * SQL filter to apply to the dataset
   */
  filter?: string
  /**
   * Custom color ramp for filled layers
   */
  steps?: number[]
  /**
   * Property to get value to display the ramp
   * legacy known as pickValueAt
   */
  stepsPickValue?: string
  /**
   * Feature property to drive timestamps filtering
   */
  startTimeFilterProperty?: string
  /**
   * Feature property to drive timestamps filtering
   */
  endTimeFilterProperty?: string
}

export type UserContextFeatureProperties = {
  id: string
  title: string
  color: string
  value: string | number
  datasetId: string
  category: DataviewCategory
  type: DataviewType
  link?: string
}

export type UserContextFeature = Feature<Geometry, Record<string, any>>

export type UserContextPickingObject = UserContextFeature & UserContextFeatureProperties

export type UserContextPickingInfo = PickingInfo<UserContextPickingObject, { tile?: Tile2DHeader }>
