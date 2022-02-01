import { RFMOs } from './'

/**
 *
 * @export
 * @interface PortalConfigRfmos
 */
export interface PortalConfigRfmos {
  /**
   *
   * @type {RFMOs}
   * @memberof PortalConfigRfmos
   */
  id: RFMOs
  /**
   *
   * @type {string}
   * @memberof PortalConfigRfmos
   */
  label: string
  /**
   *
   * @type {string}
   * @memberof PortalConfigRfmos
   */
  description: string
  /**
   * Aliases to match the rfmo name, as other languages acronyms
   * @type {Array<string>}
   * @memberof PortalConfigRfmos
   */
  alias?: string[]
  /**
   * Boundig box of the area xMin, yMin, xMax, yMax
   * @type {Array<number>}
   * @memberof PortalConfigRfmos
   */
  bounds?: number[]
}
