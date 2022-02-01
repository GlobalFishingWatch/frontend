import { PointCoordinate, RFMOs } from './'

/**
 *
 * @export
 * @interface Port
 */
export interface Port {
  /**
   *
   * @type {string}
   * @memberof Port
   */
  id: string
  /**
   *
   * @type {string}
   * @memberof Port
   */
  label: string
  /**
   * ISO 3 which the port belongs to
   * @type {string}
   * @memberof Port
   */
  iso?: string
  /**
   *
   * @type {RFMOs}
   * @memberof Port
   */
  rfmo?: RFMOs
  /**
   *
   * @type {PointCoordinate}
   * @memberof Port
   */
  coordinates: PointCoordinate
}
