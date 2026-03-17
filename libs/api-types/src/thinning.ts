export type ThinningConfig = {
  /**
   * Maximum distance between fishing points (in km)
   */
  'distance-fishing'?: number
  /**
   * Maximum distance between points in transit (in km)
   */
  'distance-transit'?: number
  /**
   * Accumulated bearing change between consecutive fishing points (in degrees)
   */
  'bearing-val-fishing'?: number
  /**
   * Accumulated bearing change between consecutive points in transit (in degrees)
   */
  'bearing-val-transit'?: number
  /**
   * Accumulated speed change between consecutive fishing points (in percentage)
   */
  'change-speed-fishing'?: number
  /**
   * Accumulated speed change between consecutive pointsin transit (in percentage)
   */
  'change-speed-transit'?: number
  /**
   * Maximum number of fishing points that could be skipped when no other
   * thinning criterias are met (in quantity)
   *
   * This is to ensure we always include a point if X previous fishing points
   * were not included
   */
  'min-accuracy-fishing'?: number
  /**
   * Maximum number of points in transit that could be skipped when no other
   * thinning criterias are met (in quantity)
   *
   * This is to ensure we always include a point if X previous points in transit
   * were not included
   */
  'min-accuracy-transit'?: number
}
