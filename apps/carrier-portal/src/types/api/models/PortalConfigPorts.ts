import { PortalConfigPort } from './'

/**
 *
 * @export
 * @interface PortalConfigPorts
 */
export interface PortalConfigPorts {
  /**
   *
   * @type {Array<Port>}
   * @memberof PortalConfigPorts
   */
  encounter: Array<PortalConfigPort>
  /**
   *
   * @type {Array<Port>}
   * @memberof PortalConfigPorts
   */
  loitering: Array<PortalConfigPort>
}
