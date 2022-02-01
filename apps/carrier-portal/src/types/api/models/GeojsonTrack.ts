import { Feature } from './'

/**
 * Geojson Feature collection
 * @export
 * @interface GeojsonTrack
 */
export interface GeojsonTrack {
  /**
   *
   * @type {string}
   * @memberof GeojsonTrack
   */
  type: GeojsonTrackTypeEnum
  /**
   *
   * @type {Array<Feature>}
   * @memberof GeojsonTrack
   */
  features: Feature[]
}

/**
 * @export
 * @string {string}
 */
export type GeojsonTrackTypeEnum = 'FeatureCollection'
