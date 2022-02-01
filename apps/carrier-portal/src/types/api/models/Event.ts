import {
  EncounterEvent,
  PortEvent,
  EventNextPort,
  EventTypes,
  EventVessel,
  GapEvent,
  LoiteringEvent,
  PointCoordinate,
} from './'

/**
 *
 * @export
 * @interface Event
 */
export interface Event {
  /**
   * Unique identifier for this event
   * @type {string}
   * @memberof Event
   */
  id: string
  /**
   *
   * @type {EventTypes}
   * @memberof Event
   */
  type: EventTypes
  /**
   *
   * @type {EventVessel}
   * @memberof Event
   */
  vessel: EventVessel
  /**
   * Timestamp that represents the starting time for the event
   * @type {number}
   * @memberof Event
   */
  start: number
  /**
   * Timestamp that represents the ending time for the event
   * @type {number}
   * @memberof Event
   */
  end: number
  /**
   * List of rfmo id regions where the event happened
   * @type {Array<string>}
   * @memberof Event
   */
  rfmos: string[]
  /**
   * List of eezs id regions where the event happened
   * @type {Array<string>}
   * @memberof Event
   */
  eezs: string[]
  /**
   *
   * @type {EventNextPort}
   * @memberof Event
   */
  nextPort?: EventNextPort
  /**
   *
   * @type {PointCoordinate}
   * @memberof Event
   */
  position: PointCoordinate
  /**
   *
   * @type {LoiteringEvent}
   * @memberof Event
   */
  loitering?: LoiteringEvent
  /**
   *
   * @type {EncounterEvent}
   * @memberof Event
   */
  encounter?: EncounterEvent
  /**
   *
   * @type {GapEvent}
   * @memberof Event
   */
  gap?: GapEvent
  /**
   *
   * @type {PortEvent}
   * @memberof PortEvent
   */
  port?: PortEvent
}
