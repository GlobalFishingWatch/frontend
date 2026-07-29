/**
 * RTK Query reducer paths as plain strings.
 *
 * Exists so `store.ts`'s devtools sanitizer can name the API slices without importing the `queries`
 * barrel, which pulls @strapi/client and @globalfishingwatch/deck-loaders into whatever imports it.
 *
 * Drift is caught at typecheck: queries/index.ts asserts this list matches the actual reducer keys.
 */
export const QUERY_REDUCER_PATHS = [
  'chatApi',
  'dataviewStatsApi',
  'reportEventsStatsApi',
  'userGuideApi',
  'dataTerminologyApi',
  'vesselEventsApi',
  'vesselInsightApi',
  'vesselSearchApi',
] as const
