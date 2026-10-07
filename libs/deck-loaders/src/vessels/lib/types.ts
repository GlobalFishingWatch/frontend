import type {
  ApiEvent,
  EventTypes,
  FishingEventDayNightSummary,
} from '@globalfishingwatch/api-types'

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

// dayAndNight groups every set that overlaps nautical dawn or dusk
export type LonglineCategory = 'entirelyDay' | 'dayAndNight' | 'entirelyNight'

export const LONGLINE_CATEGORY_COLORS: Record<LonglineCategory, string> = {
  entirelyDay: '#da8902',
  dayAndNight: '#0673b3',
  entirelyNight: '#39394a',
}

const LONGLINE_CATEGORY_BY_SUMMARY: Record<FishingEventDayNightSummary, LonglineCategory> = {
  entirely_day: 'entirelyDay',
  mostly_day: 'dayAndNight',
  day_and_night: 'dayAndNight',
  mostly_night: 'dayAndNight',
  entirely_night: 'entirelyNight',
}

export const isLonglineSetEvent = (event?: Partial<ApiEvent>) => !!event?.fishing?.dayNightSummary

// ponytail: an unknown summary from the API falls back to dayAndNight instead of crashing the grouping
export const getLonglineCategory = (event: Partial<ApiEvent>): LonglineCategory => {
  const summary = event.fishing?.dayNightSummary
  return (summary && LONGLINE_CATEGORY_BY_SUMMARY[summary]) || 'dayAndNight'
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
