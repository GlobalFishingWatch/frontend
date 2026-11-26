import flagsLabels from '../../../fixtures/api/i18n-labels/en/flags.json'
import timebarLabels from '../../../fixtures/api/i18n-labels/en/timebar.json'
import { get, json } from '../mock-network'
import { heatmapTile } from '../tiles'

// i18n-labels is fetched from jsDelivr at `@latest`, so its text changes without a deploy. Pinned
// here because flag names and timebar labels show up in assertions.
const I18N_LABELS_PATH = '/npm/@globalfishingwatch/i18n-labels@latest/en'

/**
 * Handlers every spec gets: the requests the app makes on its own when the default map boots.
 * Feature-specific responses belong in the spec, via `mockApi.use()`.
 */
export const defaultHandlers = [
  heatmapTile(),
  get(`${I18N_LABELS_PATH}/flags.json`, json(flagsLabels)),
  get(`${I18N_LABELS_PATH}/timebar.json`, json(timebarLabels)),
]
