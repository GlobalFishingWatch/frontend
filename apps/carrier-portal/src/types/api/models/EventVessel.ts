import { EventNextPort } from './'

/**
 *
 * @export
 * @interface EventVessel
 */
export interface EventVessel {
  /**
   * Id of the vessel
   * @type {string}
   * @memberof EventVessel
   */
  id: string
  /**
   * SSVID of the vessel
   * @type {string}
   * @memberof EventVessel
   */
  ssvid: string
  /**
   * Name of the vessel
   * @type {string}
   * @memberof EventVessel
   */
  name: string
  /**
   * Vessel Flag at the event moment
   * @type {string}
   * @memberof EventVessel
   */
  flag: string
  /**
   * Type of vessel at the encounter
   * @type {string}
   * @memberof EventVessel
   */
  type: EventVesselTypeEnum
  /**
   *
   * @type {EventNextPort}
   * @memberof EventVessel
   */
  nextPort?: EventNextPort
}

/**
 * @export
 * @string {string}
 */
export type EventVesselTypeEnum = 'carrier' | 'fishing'
