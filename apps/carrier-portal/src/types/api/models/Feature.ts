import { FeatureProperties, GeometryCollection } from './'

/**
 * Geojson Feature
 * @export
 * @interface Feature
 */
export interface Feature {
  /**
   *
   * @type {string}
   * @memberof Feature
   */
  type: FeatureTypeEnum
  /**
   *
   * @type {string}
   * @memberof Feature
   */
  id?: string
  /**
   *
   * @type {GeometryCollection}
   * @memberof Feature
   */
  geometry: GeometryCollection
  /**
   *
   * @type {FeatureProperties}
   * @memberof Feature
   */
  properties: FeatureProperties
}

/**
 * @export
 * @string {string}
 */
export type FeatureTypeEnum = 'Feature'
