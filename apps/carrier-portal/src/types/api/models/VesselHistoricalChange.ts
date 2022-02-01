/**
 * Historical changes of the vessel properties
 * @export
 * @interface VesselHistoricalChange
 */
export interface VesselHistoricalChange {
  /**
   * timestamp of the beggining
   * @type {number}
   * @memberof VesselHistoricalChange
   */
  start: number
  /**
   * timestamp of the end, optional as we not always have the date or it hasn't happened yet
   * @type {number}
   * @memberof VesselHistoricalChange
   */
  end?: number
  /**
   * Generic attribute for historical changes properties as ISO3 in case of `flags` or un|authorized in case of `authorizations`
   * @type {string}
   * @memberof VesselHistoricalChange
   */
  value: string
}
