import { PickingInfo } from '@deck.gl/core'
import { Feature, Geometry } from 'geojson'
import { Tile2DHeader } from '@deck.gl/geo-layers/dist/tileset-2d'
import { DataviewCategory, DataviewType, TimeFilterType } from '@globalfishingwatch/api-types'
import { ContextLayerConfig } from '../context'
import { BaseLayerProps } from '../../types'

export type BaseUserLayerProps = {
  id: string
  layers: ContextLayerConfig<string>[]
  color: string
  idProperty?: string
  valueProperties?: string[]
  highlightedFeatures?: UserContextPickingObject[]
  /**
   * Disable interaction (needed when user uploaded a non-polygon layer)
   * legacy known as disableInteraction
   */
  pickable?: boolean
  /**
   * SQL filter to apply to the dataset
   */
  filter?: string
  /**
   * Filters object without parse
   */
  filters?: Record<string, any>
  /**
   * Global timerange config filter timestamps
   */
  startTime?: number
  endTime?: number
  /**
   * Feature property to drive timestamps filtering
   */
  startTimeProperty?: string
  endTimeProperty?: string
  timeFilterType?: TimeFilterType
}

export type UserContextLayerProps = BaseLayerProps &
  BaseUserLayerProps & {
    /**
     * Custom color ramp for filled layers
     */
    steps?: number[]
    /**
     * Property to get value to display the ramp
     * legacy known as pickValueAt
     */
    stepsPickValue?: string
  }

export type UserPointsLayerProps = BaseLayerProps &
  BaseUserLayerProps & {
    /**
     * Feature property to drive circle radius
     */
    circleRadiusProperty?: string
    /**
     * min max values of the circleRadiusProperty
     * circle radius linear interpolation will be based on this range
     */
    circleRadiusRange?: number[]
    /**
     * min point size of the values range lower end
     */
    minPointSize?: number
    /**
     * man point size of the values range higher end
     */
    maxPointSize?: number
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
