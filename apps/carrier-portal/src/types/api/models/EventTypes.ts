/**
 * Specific event type. Depending on the concrete model, this might be `fishing` for `FishingEvent`, `encounter` for `EncounterEvent` and so on.
 * @export
 * @string {string}
 */
export type EventTypes = 'encounter' | 'fishing' | 'gap' | 'port' | 'loitering'
