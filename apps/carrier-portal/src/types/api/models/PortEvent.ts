import { PointCoordinate } from './'

/**
 *
 * @export
 * @interface PortEvent
 */
export interface PortEvent {
  /**
   * Unique identifier for this port
   * @type {string}
   * @memberof PortEvent
   */
  id: string
  /**
   * Readable name
   * @type {string}
   * @memberof PortEvent
   */
  name: string
  /**
   * @type {string}
   * @memberof PortEvent
   */
  topDestination: string
  /**
   * ISO3 country flag which port belogns to
   * @type {string}
   * @memberof PortEvent
   */
  flag: string
  /**
   * lat lon coordinates
   * @type {PointCoordinate}
   * @memberof Port
   */
  position: PointCoordinate
}
