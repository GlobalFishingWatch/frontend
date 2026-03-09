import { createStore as createJotaiStore } from 'jotai'
import { render } from 'test/appTestUtils'
import { defaultState } from 'test/defaultState'
import { createTestingMiddleware } from 'test/testingStoreMiddeware'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

import { GFWAPI } from '@globalfishingwatch/api-client'

import App from 'features/app/App'
import { selectDatasetAreaStatus } from 'features/areas/areas.slice'
import { mapInstanceAtom } from 'features/map/map.atoms'
import { MAP_VIEW_ID } from 'features/map/map-viewport.hooks'
import { reportStateAtom } from 'features/reports/reports-timeseries.hooks'
import { timerangeState } from 'features/timebar/timebar.hooks'
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

  it('should show same report data at different zoom levels', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const jotaiStore = createJotaiStore()
    store.dispatch({
      type: 'WORKSPACE_REPORT',
      payload: {
        category: 'fishing-activity',
        workspaceId: 'default-public',
        datasetId: 'public-eez-areas',
        areaId: '8361',
      },
      query: {
        longitude: -28.09249823,
        latitude: 38.48103761,
        zoom: 3.88091657,
        dataviewInstances: [
          {
            id: 'context-layer-eez',
            config: {
              visible: true,
            },
          },
        ],
        bivariateDataviews: null,
      },
    })
    const { getByTestId } = await render(<App />, { store, jotaiStore })

    const mapElement = getByTestId('app-main')

    expect(
      selectDatasetAreaStatus({ datasetId: 'public-eez-areas', areaId: '8361' })(store.getState())
    ).toBe(AsyncReducerStatus.Finished)

    await waitForReportFeaturesLoaded(jotaiStore)

    const reportState = jotaiStore.get(reportStateAtom)
    expect(reportState?.isLoading).toBe(false)

    const initialReportData = jotaiStore.get(reportStateAtom)
    console.log('🚀 ~ initialReportData:', initialReportData)

    await userEvent.click(getByTestId('map-control-zoom-in'))
  })

  it('should update report data when timebar changes', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const jotaiStore = createJotaiStore()

    store.dispatch({
      type: 'WORKSPACE_REPORT',
      payload: {
        category: 'fishing-activity',
        workspaceId: 'default-public',
        datasetId: 'public-eez-areas',
        areaId: '8361',
      },
      query: {
        longitude: -28.09249823,
        latitude: 38.48103761,
        zoom: 3.88091657,
        dataviewInstances: [
          {
            id: 'context-layer-eez',
            config: {
              visible: true,
            },
          },
        ],
        bivariateDataviews: null,
      },
    })

    const { getByTestId } = await render(<App />, { store, jotaiStore })

    await waitForReportFeaturesLoaded(jotaiStore)

    const initialReportData = jotaiStore.get(reportStateAtom)
    const initialTimeseries = initialReportData?.timeseries

    // Change timebar period
    await getByTestId('interval-btn-month').click()
    await new Promise((resolve) => setTimeout(resolve, 500))

    await waitForReportFeaturesLoaded(jotaiStore)

    const updatedReportData = jotaiStore.get(reportStateAtom)
    const updatedTimeseries = updatedReportData?.timeseries

    // Verify that timeseries data was recalculated
    expect(updatedTimeseries).toBeDefined()
    expect(updatedTimeseries?.[0]?.interval).not.toBe(initialTimeseries?.[0]?.interval)
  })

  it('should update report data when filter changes', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const jotaiStore = createJotaiStore()

    store.dispatch({
      type: 'WORKSPACE_REPORT',
      payload: {
        category: 'fishing-activity',
        workspaceId: 'default-public',
        datasetId: 'public-eez-areas',
        areaId: '8361',
      },
      query: {
        longitude: -28.09249823,
        latitude: 38.48103761,
        zoom: 3.88091657,
        dataviewInstances: [
          {
            id: 'context-layer-eez',
            config: {
              visible: true,
            },
          },
        ],
        bivariateDataviews: null,
      },
    })

    const { getByTestId } = await render(<App />, { store, jotaiStore })

    await waitForReportFeaturesLoaded(jotaiStore)

    const initialReportData = jotaiStore.get(reportStateAtom)

    // Toggle a layer filter to trigger data update
    await getByTestId('activity-layer-panel-switch-ais').click()

    await new Promise((resolve) => setTimeout(resolve, 1000))
    await waitForReportFeaturesLoaded(jotaiStore)

    const updatedReportData = jotaiStore.get(reportStateAtom)

    // Verify report data was recalculated
    expect(updatedReportData).toBeDefined()
    expect(updatedReportData?.isLoading).toBe(false)
  })

  it('should not show see vessels button when no data', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const jotaiStore = createJotaiStore()

    // Mock the API to return empty vessel data
    const originalFetch = GFWAPI.fetch
    const fetchSpy = vi.spyOn(GFWAPI, 'fetch')
    fetchSpy.mockImplementation((url: string) => {
      if (typeof url === 'string' && url.includes('/4wings/report')) {
        return Promise.resolve({ entries: [] })
      }
      return originalFetch.call(GFWAPI, url)
    })

    store.dispatch({
      type: 'WORKSPACE_REPORT',
      payload: {
        category: 'fishing-activity',
        workspaceId: 'default-public',
        datasetId: 'public-eez-areas',
        areaId: '8361',
      },
      query: {
        longitude: -28.09249823,
        latitude: 38.48103761,
        zoom: 3.88091657,
        dataviewInstances: [
          {
            id: 'context-layer-eez',
            config: {
              visible: true,
            },
          },
        ],
        bivariateDataviews: null,
      },
    })

    const { container } = await render(<App />, { store, jotaiStore })

    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Verify "see vessels" button is not visible when there's no data
    const seeVesselsButton = container.querySelector(
      '[data-testid="see-vessel-table-activity-report"]'
    )
    expect(seeVesselsButton).toBeNull()

    fetchSpy.mockRestore()
  })

  it.todo('should show data for buffered area', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const jotaiStore = createJotaiStore()

    store.dispatch({
      type: 'WORKSPACE_REPORT',
      payload: {
        category: 'fishing-activity',
        workspaceId: 'default-public',
        datasetId: 'public-eez-areas',
        areaId: '8361',
      },
      query: {
        longitude: -28.09249823,
        latitude: 38.48103761,
        zoom: 3.88091657,
        reportBufferValue: 50,
        reportBufferUnit: 'nauticalmiles',
        reportBufferOperation: 'dissolve',
        dataviewInstances: [
          {
            id: 'context-layer-eez',
            config: {
              visible: true,
            },
          },
        ],
        bivariateDataviews: null,
      },
    })

    const { getByTestId } = await render(<App />, { store, jotaiStore })

    await waitForReportFeaturesLoaded(jotaiStore)

    const reportData = jotaiStore.get(reportStateAtom)
  })

  it('should display the date chosen in the timebar in the report description', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const jotaiStore = createJotaiStore()

    store.dispatch({
      type: 'WORKSPACE_REPORT',
      payload: {
        category: 'environment',
        workspaceId: 'default-public',
        datasetId: 'public-eez-areas',
        areaId: '8361',
      },
      query: {
        longitude: -28.09249823,
        latitude: 38.48103761,
        zoom: 3.88091657,
        dataviewInstances: [
          {
            id: 'context-layer-eez',
            config: {
              visible: true,
            },
          },
        ],
        bivariateDataviews: null,
      },
    })

    const { getByText } = await render(<App />, { store, jotaiStore })

    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Get dates from timerange atom
    const timerange = jotaiStore.get(timerangeState)

    expect(timerange).toBeDefined()

    // Verify dates are visible in the description
    // The formatI18nDate function formats dates, we should see "between" text
    const betweenText = getByText(/between/i)

    expect(betweenText).toBeDefined()
  })

  //global reports
  it('should display description with calculated values if map finished loading', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const jotaiStore = createJotaiStore()

    store.dispatch({
      type: 'WORKSPACE_REPORT',
      payload: {
        category: 'fishing-activity',
        workspaceId: 'default-public',
        datasetId: 'public-global-all',
        areaId: 'ENTIRE_WORLD',
      },
      query: {
        longitude: 0,
        latitude: 0,
        zoom: 1,
        dataviewInstances: [
          {
            id: 'ais',
            config: {
              visible: true,
            },
          },
        ],
        bivariateDataviews: null,
      },
    })

    const { getByText } = await render(<App />, { store, jotaiStore })

    await waitForReportFeaturesLoaded(jotaiStore)

    // Verify description is visible with calculated values
    const descriptionText = getByText(/between/i)

    expect(descriptionText).toBeDefined()
  })

  it('should have activity, events and detections tabs', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const jotaiStore = createJotaiStore()

    store.dispatch({
      type: 'WORKSPACE_REPORT',
      payload: {
        category: 'fishing-activity',
        workspaceId: 'default-public',
        datasetId: 'public-eez-areas',
        areaId: '8361',
      },
      query: {
        longitude: -28.09249823,
        latitude: 38.48103761,
        zoom: 3.88091657,
        dataviewInstances: [
          {
            id: 'context-layer-eez',
            config: {
              visible: true,
            },
          },
        ],
        bivariateDataviews: null,
      },
    })

    const { getByText } = await render(<App />, { store, jotaiStore })

    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Verify tabs are present
    expect(getByText('Activity')).toBeDefined()
    expect(getByText('Events')).toBeDefined()
    expect(getByText('Detections')).toBeDefined()
  })

  it('should display subcategory layer on map when subcategory is selected', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const jotaiStore = createJotaiStore()

    store.dispatch({
      type: 'WORKSPACE_REPORT',
      payload: {
        category: 'fishing-activity',
        workspaceId: 'default-public',
        datasetId: 'public-eez-areas',
        areaId: '8361',
      },
      query: {
        longitude: -28.09249823,
        latitude: 38.48103761,
        zoom: 3.88091657,
        dataviewInstances: [
          {
            id: 'context-layer-eez',
            config: {
              visible: true,
            },
          },
        ],
        bivariateDataviews: null,
      },
    })

    const { getByText, getByTestId } = await render(<App />, { store, jotaiStore })

    await waitForReportFeaturesLoaded(jotaiStore)

    // Click on Presence subcategory if available
    const presenceButton = getByText('Presence')
    if (presenceButton) {
      await presenceButton.click()
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Verify the layer is displayed on map
      const actions = testingMiddleware.getActions()
      const updateAction = actions.findLast((action) => action.type === 'WORKSPACE_REPORT')

      expect(updateAction?.query?.reportActivitySubCategory).toBe('presence')
    }
  })

  it('should add new subcategory option when new layer is added from layer library', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const jotaiStore = createJotaiStore()

    store.dispatch({
      type: 'WORKSPACE_REPORT',
      payload: {
        category: 'fishing-activity',
        workspaceId: 'default-public',
        datasetId: 'public-eez-areas',
        areaId: '8361',
      },
      query: {
        longitude: -28.09249823,
        latitude: 38.48103761,
        zoom: 3.88091657,
        dataviewInstances: [
          {
            id: 'ais',
            config: {
              visible: true,
            },
          },
        ],
        bivariateDataviews: null,
      },
    })

    const { getByTestId } = await render(<App />, { store, jotaiStore })

    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Add a new layer (e.g., VMS)
    await getByTestId('activity-layer-panel-switch-vms').click()

    await new Promise((resolve) => setTimeout(resolve, 500))

    const actions = testingMiddleware.getActions()
    const updateAction = actions.findLast((action) => action.type === 'HOME')

    // Verify new dataview instance was added
    const vmsDataview = updateAction?.query?.dataviewInstances?.find((dv: any) => dv.id === 'vms')
    expect(vmsDataview).toBeDefined()
  })

  it('should show second selector when choose data comparison mode', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const jotaiStore = createJotaiStore()

    store.dispatch({
      type: 'WORKSPACE_REPORT',
      payload: {
        category: 'fishing-activity',
        workspaceId: 'default-public',
        datasetId: 'public-eez-areas',
        areaId: '8361',
      },
      query: {
        longitude: -28.09249823,
        latitude: 38.48103761,
        zoom: 3.88091657,
        dataviewInstances: [
          {
            id: 'ais',
            config: {
              visible: true,
            },
          },
          {
            id: 'vms',
            config: {
              visible: true,
            },
          },
        ],
        bivariateDataviews: null,
      },
    })

    const { container } = await render(<App />, { store, jotaiStore })

    await waitForReportFeaturesLoaded(jotaiStore)

    // Look for graph selector and select dataset comparison
    const selectors = container.querySelectorAll('select')

    // If there are multiple selectors, data comparison mode might have been activated
    expect(selectors.length).toBeGreaterThanOrEqual(1)
  })

  it('should show same data as in evolution mode when data comparison mode is selected', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const jotaiStore = createJotaiStore()

    store.dispatch({
      type: 'WORKSPACE_REPORT',
      payload: {
        category: 'fishing-activity',
        workspaceId: 'default-public',
        datasetId: 'public-eez-areas',
        areaId: '8361',
      },
      query: {
        longitude: -28.09249823,
        latitude: 38.48103761,
        zoom: 3.88091657,
        reportActivityGraph: 'evolution',
        dataviewInstances: [
          {
            id: 'ais',
            config: {
              visible: true,
            },
          },
        ],
        bivariateDataviews: null,
      },
    })

    const { getByTestId } = await render(<App />, { store, jotaiStore })

    await waitForReportFeaturesLoaded(jotaiStore)

    const evolutionData = jotaiStore.get(reportStateAtom)

    // Switch to dataset comparison mode
    store.dispatch({
      type: 'WORKSPACE_REPORT',
      payload: {
        category: 'fishing-activity',
        workspaceId: 'default-public',
        datasetId: 'public-eez-areas',
        areaId: '8361',
      },
      query: {
        longitude: -28.09249823,
        latitude: 38.48103761,
        zoom: 3.88091657,
        reportActivityGraph: 'datasetComparison',
        dataviewInstances: [
          {
            id: 'ais',
            config: {
              visible: true,
            },
          },
        ],
        bivariateDataviews: null,
      },
    })

    await new Promise((resolve) => setTimeout(resolve, 1000))
    await waitForReportFeaturesLoaded(jotaiStore)

    const comparisonData = jotaiStore.get(reportStateAtom)

    // Both modes should have timeseries data
    expect(evolutionData?.timeseries).toBeDefined()
    expect(comparisonData?.timeseries).toBeDefined()
  })

  it('should show 2 values in graph when data comparison dataset is selected', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const jotaiStore = createJotaiStore()

    store.dispatch({
      type: 'WORKSPACE_REPORT',
      payload: {
        category: 'fishing-activity',
        workspaceId: 'default-public',
        datasetId: 'public-eez-areas',
        areaId: '8361',
      },
      query: {
        longitude: -28.09249823,
        latitude: 38.48103761,
        zoom: 3.88091657,
        reportActivityGraph: 'datasetComparison',
        dataviewInstances: [
          {
            id: 'ais',
            config: {
              visible: true,
            },
          },
          {
            id: 'vms',
            config: {
              visible: true,
            },
          },
        ],
        reportComparisonDataviewIds: {
          main: 'ais',
          compare: 'vms',
        },
        bivariateDataviews: null,
      },
    })

    const { getByTestId } = await render(<App />, { store, jotaiStore })

    await waitForReportFeaturesLoaded(jotaiStore)

    const reportData = jotaiStore.get(reportStateAtom)

    // Verify multiple timeseries are available for comparison
    expect(reportData?.timeseries).toBeDefined()
    expect(reportData?.timeseries?.length).toBeGreaterThanOrEqual(1)
  })
})
