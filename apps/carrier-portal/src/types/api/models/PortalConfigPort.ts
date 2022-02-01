/**
 *
 * @export
 * @interface Port
 */
export interface PortalConfigPort {
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
   * @type {number}
   * @memberof PortalConfigPort
   */
  lat: number
  /**
   *
   * @type {number}
   * @memberof PortalConfigPort
   */
  lon: number
}
