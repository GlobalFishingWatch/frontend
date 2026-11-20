import i18n from 'i18next'
import { Settings } from 'luxon'
import { afterEach, beforeAll, vi } from 'vitest'

import type * as ReportsGeoUtilsModule from 'features/_reports/reports-geo.utils'
import type * as ReportsPolygonsUtilsModule from 'features/_reports/reports-polygons.utils'
import { getIsBrowser } from 'utils/dom'

import { defaultHandlers } from '../utils/network/handlers'
import {
  assertNoUnmockedRequests,
  installNetworkStub,
  resetTestHandlers,
  setDefaultHandlers,
} from '../utils/network/mock-network'

import { TEST_END_DATE } from './config'

import '../../routes/styles.css'
import '../test-styles.css'
import '@globalfishingwatch/ui-components/base.css'
import '@globalfishingwatch/timebar/timebar-settings.css'

// The setup file runs before the spec is imported, so this is in place before any app module
// (i18n requests its labels on import) can call fetch.
installNetworkStub()
setDefaultHandlers(...defaultHandlers)

afterEach(() => {
  resetTestHandlers()
  assertNoUnmockedRequests()
})

// Add this function in case tests fail before cleanup of test polygons
// const cleanupExistingTestPolygon = async (store: ReturnType<typeof makeStore>) => {
//   await store.dispatch(fetchAllDatasetsThunk({ fetchUserDatasetsMode: 'user-only' }) as any)
//   const state = store.getState()
//   // Find and delete test polygons from state
//   const datasets = selectUserDatasets(state)
//   for (const dataset of datasets) {
//     if (dataset.id?.includes('polygon-drawing-test') ||dataset.id?.includes('public-iccat-2019-points')) {
//       await store.dispatch(deleteDatasetThunk(dataset.id) as any)
//     }
//   }
// }

// Force English before any spec imports features/i18n/i18n.ts. The client detector reads
// querystring → cookie → navigator (CLIENT_LANGUAGE_DETECTION) and caches to the cookie, which the
// persistent Playwright profile keeps between runs — so a `pt` detected once would stick forever.
// localStorage is only a write cache there, so setting `i18nextLng` has no effect on detection.
if (getIsBrowser()) {
  document.cookie = 'i18next=en; path=/; SameSite=Lax'
}

// The clock starts at TEST_END_DATE (Feb 18th, 2026, 12:00 UTC) and then moves with real time.
// WHY not frozen: `vi.setSystemTime` alone freezes Date.now(), and debounces that measure elapsed
// time with it (use-debounce, used by the vessel search box) then never fire — the search query
// never reached the URL and no search ran. Only `Date` is faked; timers stay real. Requests stay
// deterministic: no request URL is derived from "now", and a run never reaches the next day.
vi.useFakeTimers({ toFake: ['Date'], shouldAdvanceTime: true })
vi.setSystemTime(new Date(TEST_END_DATE))

// Luxon reads its own clock; point it at the (advancing) faked Date
Settings.now = () => Date.now()

const HIGHLIGHT_DATAVIEW_INSTANCE_ID = 'sentinel2'

// Mock Web Workers to prevent blocking in tests
// This is needed for the cells and polygons workers used in reports
vi.mock('features/_reports/reports-geo.utils.workers.hooks', async () => {
  const { filterByPolygon } = await vi.importActual<typeof ReportsGeoUtilsModule>(
    'features/_reports/reports-geo.utils'
  )
  const { filterPolygonsByArea } = await vi.importActual<typeof ReportsPolygonsUtilsModule>(
    'features/_reports/reports-polygons.utils'
  )

  return {
    useFilterCellsByPolygonWorker: () => {
      return async (params: any) => {
        return filterByPolygon(params)
      }
    },
    filterPolygonsByAreaInWorker: async (params: any) => filterPolygonsByArea(params),
    terminateFilterPolygonsWorker: () => undefined,
  }
})

beforeAll(async () => {
  // Ensure i18n is initialized before running tests
  await i18n.changeLanguage('en')

  // Preload lazy modal chunks used in integration tests
  await Promise.all([
    import('features/_map/layer-library/LayerLibrary'),
    import('features/feedback/FeedbackModal'),
  ])

  // Browser mode cannot handle native confirm dialogs without explicit mocking.
  vi.spyOn(window, 'confirm').mockReturnValue(false)

  // Setup localstorage modal shown flag to prevent it from appearing in tests
  if (getIsBrowser()) {
    localStorage.setItem('VesselProfilePopup', '{"visible":false,"showAgain":false}')
    localStorage.setItem('DeepSeaMiningPopup', '{"visible":false,"showAgain":false}')
    localStorage.setItem('OnboardingPanelDismissed', 'true')
    localStorage.setItem('UpdateVideoSeen', 'true')
    localStorage.setItem('HighlightPopup', `"${HIGHLIGHT_DATAVIEW_INSTANCE_ID}"`)
    localStorage.setItem(
      'hints',
      '{"fishingEffortHeatmap":true,"filterActivityLayers":true,"clickingOnAGridCellToShowVessels":true,"changingTheTimeRange":true,"areaSearch":true,"periodComparisonBaseline":true,"reportAreaSearch":true,"userContextLayers":true}'
    )
  }
})

// afterAll(() => {
//  cleanupExistingTestPolygon(store)
//   vi.clearAllMocks()
//   vi.restoreAllMocks()
//   vi.useRealTimers()
// })
