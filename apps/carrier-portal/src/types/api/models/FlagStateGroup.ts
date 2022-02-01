/**
 *
 * @export
 * @interface FlagStateGroup
 */
export interface FlagStateGroup {
  /**
   * Unique identifier for the group
   * @type {string}
   * @memberof FlagStateGroup
   */
  id: string
  /**
   * Name for the group
   * @type {string}
   * @memberof FlagStateGroup
   */
  name: string
  /**
   * Brief description of why the countries are grouped in each group
   * @type {string}
   * @memberof FlagStateGroup
   */
  descripcion?: string
  /**
   * List of ISOs 3 which belongs to the group
   * @type {Array<string>}
   * @memberof FlagStateGroup
   */
  isos: string[]
}
