import { createStore as createJotaiStore } from 'jotai'
import { render } from 'test/appTestUtils'
import { defaultState } from 'test/defaultState'
import { createTestingMiddleware } from 'test/testingStoreMiddeware'
import { openGlobalReportAction } from 'test/utils/actions/openGlobalReportAction'
import { openReportAction } from 'test/utils/actions/openReportAction'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

import { GFWAPI } from '@globalfishingwatch/api-client'

import App from 'features/app/App'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { mapInstanceAtom } from 'features/map/map.atoms'
import { MAP_VIEW_ID } from 'features/map/map-viewport.hooks'
import { reportStateAtom } from 'features/reports/reports-timeseries.hooks'
import * as reportsActivityUtils from 'features/reports/tabs/activity/reports-activity-timeseries.utils'
import { timerangeState } from 'features/timebar/timebar.hooks'
import { WORKSPACE_REPORT } from 'routes/routes'
import { makeStore } from 'store'

const waitForReportFeaturesLoaded = async (
  jotaiStore: ReturnType<typeof createJotaiStore>,
  timeout = 10000
) => {
  const startTime = Date.now()
  while (Date.now() - startTime < timeout) {
    const reportState = jotaiStore.get(reportStateAtom)
    if (
      reportState &&
      reportState.featuresFiltered !== undefined &&
      reportState.stats !== undefined
    ) {
      if (!reportState.isLoading) return
    }
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  throw new Error(`Report features did not finish loading within ${timeout}ms`)
}

const getCalculatedReportHours = (getByText: any): number | null => {
  const description = getByText(/hours of activity in the area between/i)
  const text = description.element().textContent || ''
  const hoursMatch = text.match(/([\d,]+)\s+hours/)
  return hoursMatch ? parseFloat(hoursMatch[1].replace(/,/g, '')) : null
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

  it('should display the date chosen in the timebar in the report description', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const jotaiStore = createJotaiStore()
    store.dispatch(openReportAction)
    const { getByText } = await render(<App />, { store, jotaiStore })

    await waitForReportFeaturesLoaded(jotaiStore)

    const timerange = jotaiStore.get(timerangeState)

    expect(timerange).toBeDefined()
    const start = formatI18nDate(timerange?.start)
    const end = formatI18nDate(timerange?.end)
    const description = getByText(/hours of activity in the area between/i)
    const text = description.element().textContent || ''
    expect(text).toContain(start)
    expect(text).toContain(end)
  })

  it('should show same report data at different zoom levels', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const jotaiStore = createJotaiStore()
    store.dispatch(openReportAction)
    const { getByTestId } = await render(<App />, { store, jotaiStore })

    await waitForReportFeaturesLoaded(jotaiStore)

    const initialReportData = jotaiStore.get(reportStateAtom)

    await userEvent.click(getByTestId('map-control-zoom-in'))
    const zoomedReportData = jotaiStore.get(reportStateAtom)
    expect(zoomedReportData).toEqual(initialReportData)
  })

  it('should update report data when timebar changes', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const jotaiStore = createJotaiStore()
    store.dispatch(openReportAction)
    const { getByTestId, getByText } = await render(<App />, { store, jotaiStore })

    await waitForReportFeaturesLoaded(jotaiStore)

    const initialReportData = jotaiStore.get(reportStateAtom)
    const initialTimeseries = initialReportData?.timeseries

    const initialHours = getCalculatedReportHours(getByText)
    expect(initialHours).toBeDefined()

    await getByTestId('interval-btn-month').click()
    await new Promise((resolve) => setTimeout(resolve, 500))
    await waitForReportFeaturesLoaded(jotaiStore)

    const updatedReportData = jotaiStore.get(reportStateAtom)
    const updatedTimeseries = updatedReportData?.timeseries

    expect(updatedTimeseries).toBeDefined()
    expect(updatedTimeseries?.[0]?.interval).not.toBe(initialTimeseries?.[0]?.interval)

    const updatedDescription = getByText(/hours of activity in the area between/i)
    const updatedText = updatedDescription.element().textContent || ''

    expect(updatedText).toContain('Jan 1, 2025')
    expect(updatedText).toContain('Jan 1, 2026')

    const updatedHours = getCalculatedReportHours(getByText)
    expect(updatedHours).toBeDefined()
    expect(typeof updatedHours).toBe('number')
    expect(typeof initialHours).toBe('number')
    expect(updatedHours).toBeGreaterThan(initialHours!)
  })

  it('should update report data when filter changes', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const jotaiStore = createJotaiStore()
    store.dispatch(openReportAction)
    const { getByTestId, getByText } = await render(<App />, { store, jotaiStore })
    await waitForReportFeaturesLoaded(jotaiStore)

    const initialHours = getCalculatedReportHours(getByText)
    expect(initialHours).toBeDefined()

    await getByTestId('reports-summary-tags-filters').first().click()

    await expect.element(getByTestId('reports-summary-expanded-container')).toBeVisible()

    const filterInput = getByTestId('reports-summary-expanded-container')
      .element()
      .querySelector('input')
    if (filterInput) {
      await userEvent.click(filterInput)
      await userEvent.keyboard('portugal')
      await new Promise((resolve) => setTimeout(resolve, 100))
      const option = getByText(/portugal/i)
      await option.click()
      filterInput.blur()
    }
    await getByTestId('confirm-filters-button').click()
    await new Promise((resolve) => setTimeout(resolve, 1000))
    await waitForReportFeaturesLoaded(jotaiStore)

    const updatedHours = getCalculatedReportHours(getByText)
    expect(updatedHours).toBeDefined()
    expect(typeof updatedHours).toBe('number')
    expect(typeof initialHours).toBe('number')
    expect(updatedHours).toBeLessThan(initialHours!)
  })

  it('should show no data message when no data', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const jotaiStore = createJotaiStore()
    const { getByText } = await render(<App />, { store, jotaiStore })
    jotaiStore.set(timerangeState, {
      start: '2025-12-17T00:00:00.000Z',
      end: '2025-12-18T00:00:00.000Z',
    })

    store.dispatch({
      type: 'WORKSPACE_REPORT',
      payload: {
        category: 'fishing-activity',
        workspaceId: 'default-public',
        datasetId: 'public-eez-areas',
        areaId: 8402,
      },
      query: {
        longitude: -64.8109861,
        latitude: 32.42313903,
        zoom: 5.44564202,
        dataviewInstances: [
          {
            id: 'context-layer-eez',
            config: {
              visible: true,
            },
          },
          {
            id: 'vms',
            deleted: true,
          },
        ],
        activityVisualizationMode: 'heatmap-low-res',
        bivariateDataviews: null,
      },
    })
    await waitForReportFeaturesLoaded(jotaiStore)
    await expect.element(getByText(/No data available for the selected area/)).toBeVisible()
  })

  // //global reports

  it.todo('should have activity, events and detections tabs', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const jotaiStore = createJotaiStore()
    store.dispatch(openGlobalReportAction)
    const { getByText } = await render(<App />, { store, jotaiStore })

    await waitForReportFeaturesLoaded(jotaiStore)

    // Verify tabs are present
    expect(getByText('Activity')).toBeDefined()
    expect(getByText('Events')).toBeDefined()
    expect(getByText('Detections')).toBeDefined()
  })

  it.todo('should display subcategory layer on map when subcategory is selected', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const jotaiStore = createJotaiStore()
    store.dispatch(openGlobalReportAction)
    const { getByTestId, getByText } = await render(<App />, { store, jotaiStore })

    await waitForReportFeaturesLoaded(jotaiStore)
    const presenceButton = getByText('Presence')
    if (presenceButton) {
      await presenceButton.click()
      await new Promise((resolve) => setTimeout(resolve, 500))

      const actions = testingMiddleware.getActions()
      const updateAction = actions.findLast((action) => action.type === 'WORKSPACE_REPORT')

      expect(updateAction?.query?.reportActivitySubCategory).toBe('presence')
    }
  })

  it.todo(
    'should add new subcategory option when new layer is added from layer library',
    async () => {
      const testingMiddleware = createTestingMiddleware()
      const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
      const jotaiStore = createJotaiStore()
      store.dispatch(openGlobalReportAction)
      const { getByTestId, getByText } = await render(<App />, { store, jotaiStore })

      await waitForReportFeaturesLoaded(jotaiStore)
      await getByTestId('activity-layer-panel-switch-vms').click()

      await new Promise((resolve) => setTimeout(resolve, 500))

      const actions = testingMiddleware.getActions()
      const updateAction = actions.findLast((action) => action.type === 'HOME')

      // Verify new dataview instance was added
      const vmsDataview = updateAction?.query?.dataviewInstances?.find((dv: any) => dv.id === 'vms')
      expect(vmsDataview).toBeDefined()
    }
  )

  it.todo('should show second selector when choose data comparison mode', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const jotaiStore = createJotaiStore()
    store.dispatch(openGlobalReportAction)
    const { getByTestId, getByText } = await render(<App />, { store, jotaiStore })

    await waitForReportFeaturesLoaded(jotaiStore)
  })
})

// Other verification ideas:

// expect(
//   selectDatasetAreaStatus({ datasetId: 'public-eez-areas', areaId: '8361' })(store.getState())
// ).toBe(AsyncReducerStatus.Finished)
