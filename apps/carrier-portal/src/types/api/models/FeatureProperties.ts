import { FeaturePropertiesCoordinateProperties } from './'

/**
 *
 * @export
 * @interface FeatureProperties
 */
export interface FeatureProperties {
  /**
   * unique identifier of the event segment
   * @type {string}
   * @memberof FeatureProperties
   */
  segId?: string
  /**
   * type of the event that the feature represents
   * @type {string}
   * @memberof FeatureProperties
   */
  type?: FeaturePropertiesTypeEnum
  /**
   *
   * @type {FeaturePropertiesCoordinateProperties}
   * @memberof FeatureProperties
   */
  coordinateProperties?: FeaturePropertiesCoordinateProperties
}

/**
 * @export
 * @string {string}
 */
export type FeaturePropertiesTypeEnum = 'fishing' | 'track'
