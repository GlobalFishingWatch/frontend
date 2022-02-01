import { Vessel } from './'

/**
 *
 * @export
 * @interface PaginatedVesselSearch
 */
export interface PaginatedVesselSearch {
  /**
   *
   * @type {Array<Vessel>}
   * @memberof PaginatedVesselSearch
   */
  entries: Vessel[]
  /**
   *
   * @type {Array<Vessel>}
   * @memberof PaginatedVesselSearch
   */
  suggestions?: Vessel[]
  /**
   *
   * @type {number}
   * @memberof PaginatedVesselSearch
   */
  limit: number
  /**
   *
   * @type {number}
   * @memberof PaginatedVesselSearch
   */
  nextOffset: number
  /**
   *
   * @type {number}
   * @memberof PaginatedVesselSearch
   */
  offset: number
  /**
   *
   * @type {number}
   * @memberof PaginatedVesselSearch
   */
  total: number
  /**
   *
   * @type {Array<string>}
   * @memberof PaginatedVesselSearch
   */
  searchTerms: PaginatedVesselSearchSearchTermsEnum[]
  /**
   *
   * @type {string}
   * @memberof PaginatedVesselSearch
   */
  query: string
}

/**
 * @export
 * @string {string}
 */
export type PaginatedVesselSearchSearchTermsEnum = 'name' | 'ssvid' | 'mmsi'
