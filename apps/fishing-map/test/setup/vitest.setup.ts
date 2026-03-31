import i18n from 'i18next'
import { Settings } from 'luxon'
import { beforeAll, vi } from 'vitest'

import { fetchAllDatasetsThunk } from 'features/datasets/datasets.slice'
import type * as ReportsGeoUtilsModule from 'features/reports/reports-geo.utils'
import { HIGHLIGHT_DATAVIEW_INSTANCE_ID } from 'features/workspace/highlight-panel/highlight-panel.content'

import { TEST_END_DATE } from '../test.config'

import '../../pages/styles.css'
import '../test-styles.css'
import '@globalfishingwatch/ui-components/base.css'
import '@globalfishingwatch/timebar/timebar-settings.css'

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

// Set the system time to February 18th, 2026 at 12:00 PM UTC
const mockDate = new Date(TEST_END_DATE)
vi.setSystemTime(mockDate)

// Mock Luxon's now() function globally
Settings.now = () => mockDate.valueOf()

// Mock Web Workers to prevent blocking in tests
// This is needed for filterCellsByPolygonWorker used in reports
vi.mock('features/reports/reports-geo.utils.workers.hooks', async () => {
  const { filterByPolygon } = await vi.importActual<typeof ReportsGeoUtilsModule>(
    'features/reports/reports-geo.utils'
  )

  return {
    useFilterCellsByPolygonWorker: () => {
      return async (params: any) => {
        return filterByPolygon(params)
      }
    },
  }
})

beforeAll(async () => {
  // Ensure i18n is initialized before running tests
  await i18n.changeLanguage('en')

  // Browser mode cannot handle native confirm dialogs without explicit mocking.
  vi.spyOn(window, 'confirm').mockReturnValue(false)

  // Setup localstorage modal shown flag to prevent it from appearing in tests
  if (typeof window !== 'undefined') {
    localStorage.setItem('MarineManagerPopup', '{"visible":false,"showAgain":false}')
    localStorage.setItem('VesselProfilePopup', '{"visible":false,"showAgain":false}')
    localStorage.setItem('WelcomePopup', '{"visible":false,"showAgain":false}')
    localStorage.setItem('DeepSeaMiningPopup', '{"visible":false,"showAgain":false}')
    localStorage.setItem('HighlightPopup', `"${HIGHLIGHT_DATAVIEW_INSTANCE_ID}"`)
    localStorage.setItem('i18nextLng', '"en"')
    localStorage.setItem(
      'hints',
      '{"fishingEffortHeatmap":true,"filterActivityLayers":true,"clickingOnAGridCellToShowVessels":true,"changingTheTimeRange":true,"areaSearch":true,"periodComparisonBaseline":true,"userContextLayers":true}'
    )
  }
})

// afterAll(() => {
//  cleanupExistingTestPolygon(store)
//   vi.clearAllMocks()
//   vi.restoreAllMocks()
//   vi.useRealTimers()
// })
