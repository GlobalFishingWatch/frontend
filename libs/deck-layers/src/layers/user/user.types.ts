import type { Accessor, LayerExtension, PickingInfo } from '@deck.gl/core'
import type { DataFilterExtensionProps } from '@deck.gl/extensions'
import type { Tile2DHeader } from '@deck.gl/geo-layers/dist/tileset-2d'
import type { Feature, Geometry } from 'geojson'

import type { TimeFilterType } from '@globalfishingwatch/api-types'

import type { DeckLayerProps, DeckPickingObject } from '../../types'
import type { ContextLayerConfig } from '../context'

export type FilterExtensionProps = {
  extensions: LayerExtension<unknown>[]
  filterRange: DataFilterExtensionProps['filterRange']
  getFilterValue: DataFilterExtensionProps['getFilterValue']
}

export type BaseUserLayerProps = {
  id: string
  layers: ContextLayerConfig<string>[]
  highlightedFeatures?: UserLayerPickingObject[]
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

export type UserPolygonsLayerProps = DeckLayerProps<
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
>

export type UserPointsLayerProps = DeckLayerProps<
  BaseUserLayerProps & {
    /**
     * Fixed point radius for all points, used in drawn layers
     */
    staticPointRadius?: number
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
>

export type UserTrackLayerProps = DeckLayerProps<
  BaseUserLayerProps & {
    highlightStartTime?: number
    highlightEndTime?: number
    getTimestamp?: Accessor<any, number>
    singleTrack?: boolean
  }
>

export type AnyUserLayerProps = UserPolygonsLayerProps | UserPointsLayerProps | UserTrackLayerProps

export type UserLayerFeatureProperties = {
  id: string
  layerId: string
  title: string
  color: string
  value: string | number
  datasetId: string
}

export type UserLayerFeature = Feature<Geometry, Record<string, any>>

export type UserLayerPickingObject = DeckPickingObject<
  UserLayerFeature & UserLayerFeatureProperties
>

export type UserLayerPickingInfo = PickingInfo<UserLayerPickingObject, { tile?: Tile2DHeader }>
