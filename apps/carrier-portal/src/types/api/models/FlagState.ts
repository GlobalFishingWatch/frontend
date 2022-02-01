/**
 * Coastal countries to include in the search options
 * @export
 * @interface FlagState
 */
export interface FlagState {
  /**
   * ISO 3 code
   * @type {string}
   * @memberof FlagState
   */
  id: string
  /**
   * Name for the country
   * @type {string}
   * @memberof FlagState
   */
  label: string
  /**
   * Aliases to match the rfmo name, as other languages acronyms
   * @type {Array<string>}
   * @memberof FlagState
   */
  alias?: string[]
}
