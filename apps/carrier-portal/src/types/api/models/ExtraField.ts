/**
 * Generic field to store vessel properties with formatting options and order
 * @export
 * @interface ExtraField
 */
export interface ExtraField {
  /**
   * Uniq identifier for the property
   * @type {string}
   * @memberof ExtraField
   */
  id: string
  /**
   * Label to represent the property
   * @type {string}
   * @memberof ExtraField
   */
  label: string
  /**
   * String with the property value with its unit included
   * @type {string}
   * @memberof ExtraField
   */
  value: string
}
