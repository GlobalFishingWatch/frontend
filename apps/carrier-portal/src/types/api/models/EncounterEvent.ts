import { AuthorizationOptions, EncounterEventAuthorizations, EventVessel } from './'

/**
 *
 * @export
 * @interface EncounterEvent
 */
export interface EncounterEvent {
  /**
   * Median distance to the other vessel across the encounter, in kilometers
   * @type {number}
   * @memberof EncounterEvent
   */
  medianDistanceKilometers: number
  /**
   * Median speed of the vessels across the encounter, in knots
   * @type {number}
   * @memberof EncounterEvent
   */
  medianSpeedKnots: number
  /**
   *
   * @type {EventVessel}
   * @memberof EncounterEvent
   */
  vessel: EventVessel
  /**
   * If authorization information is available, indicates wether the main vessel of the encounter had authorization to do so by all the management organizations for the regions in which the encounter happened (if true) or if we don't have enough information to determine it was (if false).
   * @type {boolean}
   * @memberof EncounterEvent
   */
  authorized: boolean
  /**
   *
   * @type {AuthorizationOptions}
   * @memberof EncounterEvent
   */
  authorizationStatus: AuthorizationOptions
  /**
   * List of authorizations by RFMO
   * @type {Array<EncounterEventAuthorizations>}
   * @memberof EncounterEvent
   */
  regionAuthorizations: Array<EncounterEventAuthorizations>
  /**
   * List of authorizations by Vessel
   * @type {Array<EncounterEventAuthorizations>}
   * @memberof EncounterEvent
   */
  vesselAuthorizations: Array<{ id: string; authorizations: EncounterEventAuthorizations[] }>
}
