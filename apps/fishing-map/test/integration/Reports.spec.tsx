import { createStore as createJotaiStore } from 'jotai'
import { render } from 'test/appTestUtils'
import { defaultState } from 'test/defaultState'
import { createTestingMiddleware } from 'test/testingStoreMiddeware'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

import App from 'features/app/App'
import { selectDatasetAreaStatus } from 'features/areas/areas.slice'
import { mapInstanceAtom } from 'features/map/map.atoms'
import { MAP_VIEW_ID } from 'features/map/map-viewport.hooks'
import { reportStateAtom } from 'features/reports/reports-timeseries.hooks'
import { WORKSPACE_REPORT } from 'routes/routes'
import { makeStore } from 'store'
import { AsyncReducerStatus } from 'utils/async-slice'

const waitForReportFeaturesLoaded = async (
  jotaiStore: ReturnType<typeof createJotaiStore>,
  timeout = 10000
) => {
  const startTime = Date.now()
  while (Date.now() - startTime < timeout) {
    const reportState = jotaiStore.get(reportStateAtom)
    if (reportState && !reportState.isLoading) {
      return
    }
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  throw new Error(`Report features did not finish loading within ${timeout}ms`)
}

describe('Reports', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should generate report from eez', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const jotaiStore = createJotaiStore()

    const { getByTestId } = await render(<App />, { store, jotaiStore })

    const mapElement = getByTestId('app-main')
    await getByTestId('context-layer-context-layer-eez').click()

    await new Promise((resolve) => setTimeout(resolve, 3000))

    const mapInstance = jotaiStore.get(mapInstanceAtom)
    const viewport = mapInstance?.getViewports?.().find((v: any) => v.id === MAP_VIEW_ID)
    const [x, y] = viewport?.project([-25, 38]) || [0, 0]

    await userEvent.click(mapElement, { position: { x, y } })
    await new Promise((resolve) => setTimeout(resolve, 1000))

    await getByTestId('open-analysis-link').click()

    await testingMiddleware.waitForAction(WORKSPACE_REPORT)
    expect(store.getState().location.type).toBe(WORKSPACE_REPORT)
  })

  it.skip('should show same report data at different zoom levels', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const jotaiStore = createJotaiStore()

    const { getByTestId } = await render(<App />, { store, jotaiStore })

    const mapElement = getByTestId('app-main')
    await getByTestId('context-layer-context-layer-eez').click()

    await new Promise((resolve) => setTimeout(resolve, 3000))

    const mapInstance = jotaiStore.get(mapInstanceAtom)
    const viewport = mapInstance?.getViewports?.().find((v: any) => v.id === MAP_VIEW_ID)
    const [x, y] = viewport?.project([-25, 38]) || [0, 0]

    await userEvent.click(mapElement, { position: { x, y } })

    await getByTestId('open-analysis-link').click()

    expect(
      selectDatasetAreaStatus({ datasetId: 'public-eez-areas', areaId: '8361' })(store.getState())
    ).toBe(AsyncReducerStatus.Finished)

    await waitForReportFeaturesLoaded(jotaiStore)

    const reportState = jotaiStore.get(reportStateAtom)
    expect(reportState?.isLoading).toBe(false)

    const initialReportData = jotaiStore.get(reportStateAtom)
    console.log('🚀 ~ initialReportData:', initialReportData)

    // await userEvent.click(getByTestId('map-control-zoom-in'))
  })
  // it('should update report data when timebar changes', () => {})
  // it('should update report data when filter changes', () => {})
  // it('should not show see vessels button when no data', () => {})
  // it('should show data for buffered area', () => {})
  // it('should display the date chosen in the timebar in the report description', () => {})

  // it('should change the data if filter changes', () => {})

  // //global reports
  // it('should display description with calculated values if map finished loading', () => {})

  // it('should have activity, events and detections tabs', () => {})

  // it('should display subcategory layer on map when subcategory is selected', () => {})
  // it('should add new subcategory option when new layer is added from layer library', () => {})
  // it('should show second selector when choose data comparison mode', () => {})
  // it('should show same data as in evolution mode when data comparison mode is selected', () => {})
  // it('should show 2 values in graph when data comparison dataset is selected', () => {})
})
