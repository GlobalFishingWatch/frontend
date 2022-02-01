/**
 * Id, label and iso of the port visited after the event | null when the event doesn't have a nextPort yet.
 * @export
 * @interface EventNextPort
 */
export interface EventNextPort {
  /**
   * Unique identifier joining iso3 and label
   * @type {string}
   * @memberof EventNextPort
   */
  id: string
  /**
   * Country code 3 of the port
   * @type {string}
   * @memberof EventNextPort
   */
  iso: string
  /**
   * Name of the port
   * @type {string}
   * @memberof EventNextPort
   */
  label: string
  /**
   * unique identifier of the anchorages which compose the port
   * @type {string}
   * @memberof EventNextPort
   */
  anchorageId?: string
}
