import { ExtraField, VesselHistoricalChange } from './'

/**
 *
 * @export
 * @interface Vessel
 */
export interface Vessel {
  /**
   * Id of the vessel
   * @type {string}
   * @memberof Vessel
   */
  id: string
  /**
   * Id of the vessel
   * @type {string}
   * @memberof Vessel
   */
  vesselId: string
  /**
   * SSVID of the vessel
   * @type {string}
   * @memberof Vessel
   */
  ssvid: string
  /**
   * Name of the vessel
   * @type {string}
   * @memberof Vessel
   */
  name: string
  /**
   * Initial record date of the vessel transmition
   * @type {string}
   * @memberof Vessel
   */
  firstTransmissionDate: string
  /**
   * Latest record date of the vessel transmition
   * @type {string}
   * @memberof Vessel
   */
  lastTransmissionDate: string
  /**
   * IMO of the vessel
   * @type {string}
   * @memberof Vessel
   */
  imo: string
  /**
   * Historical changes of the vessel flag in ISO 3 format
   * @type {Array<VesselHistoricalChange>}
   * @memberof Vessel
   */
  flags: VesselHistoricalChange[]
  /**
   * Historical changes of the vessel authorizations
   * @type {Array<VesselHistoricalChange>}
   * @memberof Vessel
   */
  authorizations: VesselHistoricalChange[]
  /**
   * Historical changes of the vessel mssis
   * @type {Array<VesselHistoricalChange>}
   * @memberof Vessel
   */
  mmsi: VesselHistoricalChange[]
  /**
   * Historical changes of the vessel - callsigns
   * @type {Array<VesselHistoricalChange>}
   * @memberof Vessel
   */
  callsign: VesselHistoricalChange[]
  /**
   * Type of the vessel
   * @type {string}
   * @memberof Vessel
   */
  type: VesselTypeEnum
  /**
   * List of extra fields
   * @type {Array<ExtraField>}
   * @memberof Vessel
   */
  extra?: ExtraField[]
}

/**
 * @export
 * @string {string}
 */
export type VesselTypeEnum = 'carrier' | 'vessel'
