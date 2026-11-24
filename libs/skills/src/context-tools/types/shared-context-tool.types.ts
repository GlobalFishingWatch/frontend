/** Shapes shared by the tools of several pages */

/** What every tool returns when the page has nothing to answer with */
export type AssistantContextToolUnavailable = { available: false; reason?: string }

/** ISO dates */
export type AssistantTimeRange = { start: string; end: string }

/** [west, south, east, north], rounded to 2 decimals */
export type AssistantBbox = number[]

/** [longitude, latitude], rounded to 2 decimals */
export type AssistantLonLat = number[]

export type AssistantDatedValue = { date: string | number; value: number }

export type AssistantVesselRef = { id?: string; name?: string; flag?: string }

/** Not loaded yet by the page (tab never opened, or another time range), or failed */
export type AssistantLoadStatus = 'loading' | 'error'
