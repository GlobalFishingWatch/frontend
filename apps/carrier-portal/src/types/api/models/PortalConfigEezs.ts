import { RFMOs } from './'

/**
 *
 * @export
 * @interface PortalConfigEezs
 */
export interface PortalConfigEezs {
  /**
   *
   * @type {RFMOs}
   * @memberof PortalConfigEezs
   */
  id: RFMOs
  /**
   *
   * @type {string}
   * @memberof PortalConfigEezs
   */
  iso: string
  /**
   *
   * @type {string}
   * @memberof PortalConfigEezs
   */
  label: string
  /**
   * Aliases to match the rfmo name, as other languages acronyms
   * @type {Array<string>}
   * @memberof PortalConfigEezs
   */
  alias?: string[]
  /**
   * Boundig box of the area xMin, yMin, xMax, yMax
   * @type {Array<number>}
   * @memberof PortalConfigEezs
   */
  bounds?: number[]
}
