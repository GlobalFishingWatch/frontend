import { RFMOs } from './'

/**
 *
 * @export
 * @interface EncounterEventAuthorizations
 */
export interface EncounterEventAuthorizations {
  /**
   *
   * @type {RFMOs}
   * @memberof EncounterEventAuthorizations
   */
  rfmo: RFMOs
  /**
   * If true, the vessel has authorization to operate by the management organization for this RFMO. If false, we don't have authorization information for this vessel in this RFMO.
   * @type {boolean}
   * @memberof EncounterEventAuthorizations
   */
  authorized: boolean
}
