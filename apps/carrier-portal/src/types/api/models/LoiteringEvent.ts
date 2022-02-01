/**
 *
 * @export
 * @interface LoiteringEvent
 */
export interface LoiteringEvent {
  /**
   * Median speed of the vessels across the loitering, in knots
   * @type {number}
   * @memberof LoiteringEvent
   */
  medianSpeedKnots: number
  /**
   * Total event time, in knots
   * @type {number}
   * @memberof LoiteringEvent
   */
  totalTimeHours: number
  /**
   * Total distance to the other vessel across the encounter, in kilometers
   * @type {number}
   * @memberof LoiteringEvent
   */
  totalDistanceKilometers: number
}
