import type { ApiEvent, EventTypes } from '@globalfishingwatch/api-types'

export const EVENTS_COLORS: Record<`${EventTypes}` | 'partially' | 'unmatched' | 'port', string> = {
  partially: '#F59E84',
  unmatched: '#CE2C54',
  port: '#99EEFF',
  encounter: '#FAE9A0',
  loitering: '#cfa9f9',
  port_visit: '#99EEFF',
  fishing: '#ffffff',
  gap: '#f95e5e',
  gaps: '#f95e5e',
}

export type LonglineCategory = 'entirelyDay' | 'mostlyDay' | 'mostlyNight' | 'entirelyNight'

export const LONGLINE_CATEGORY_COLORS: Record<LonglineCategory, string> = {
  entirelyDay: '#ffbd52',
  mostlyDay: '#da8902',
  mostlyNight: '#0673b3',
  entirelyNight: '#39394a',
}

export const isLonglineSetEvent = (event?: Partial<ApiEvent>) => !!event?.fishing?.dayNightCategory

export const getLonglineCategory = (event: Partial<ApiEvent>): LonglineCategory => {
  const category = event.fishing?.dayNightCategory
  if (category === 'day') return 'entirelyDay'
  if (category === 'night') return 'entirelyNight'
  return (event.fishing?.fractionAtNight ?? 0) < 0.5 ? 'mostlyDay' : 'mostlyNight'
}

export type VesselTrackGraphExtent = [number, number]

export type VesselTrackData = {
  // Number of geometries
  length: number
  // Indices into positions where each path starts
  startIndices: number[]
  // getTimestamp values are relative to timestampBase as raw epoch ms doesn't fit a Float32Array
  // use toAbsoluteTimestamp and toRelativeTimestamp helpers in parse-tracks.ts
  timestampBase: number
  // Flat coordinates array
  attributes: {
    // Populated automatically by deck.gl
    positions?: { value: Float32Array; size: number }
    getPath: { value: Float32Array; size: number }
    // Relative to timestampBase - see the note on timestampBase above.
    getTimestamp: { value: Float32Array; size: number }
    getSpeed: { value: Float32Array; size: number; extent: VesselTrackGraphExtent }
    getElevation: { value: Float32Array; size: number; extent: VesselTrackGraphExtent }
    // Time gap (in hours) between each point and the next one in the same path; 0 at path
    // boundaries. Only present when the gap-segment feature is enabled (computeGaps).
    getGap?: { value: Float32Array; size: number }
  }
}

export type VesselDeckLayersEventData = Partial<ApiEvent> & {
  type: EventTypes
  coordinates: [number, number]
  start: number
  end: number
  props?: {
    color: string
  }
}
