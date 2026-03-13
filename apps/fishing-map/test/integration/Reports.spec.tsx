import { sum } from 'es-toolkit'
import { createStore as createJotaiStore } from 'jotai'
import { selectReportEventsStats } from 'queries/report-events-stats-api'
import { render } from 'test/appTestUtils'
import { defaultState } from 'test/defaultState'
import { createTestingMiddleware } from 'test/testingStoreMiddeware'
import { openGlobalReportAction } from 'test/utils/actions/openGlobalReportAction'
import { getOpenReportActionByArea } from 'test/utils/actions/openReportAction'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

import App from 'features/app/App'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { mapInstanceAtom } from 'features/map/map.atoms'
import { MAP_VIEW_ID } from 'features/map/map-viewport.hooks'
import type { ReportGraphProps } from 'features/reports/reports-timeseries.hooks'
import { reportStateAtom } from 'features/reports/reports-timeseries.hooks'
import { formatEvolutionData } from 'features/reports/tabs/activity/reports-activity-timeseries.utils'
import { selectFetchEventsStatsParams } from 'features/reports/tabs/events/events-report.selectors'
import { timerangeState } from 'features/timebar/timebar.hooks'
import { WORKSPACE_REPORT } from 'routes/routes'
import { makeStore } from 'store'

const waitForReportFeaturesLoaded = async (
  jotaiStore: ReturnType<typeof createJotaiStore>,
  timeout = 10000
) => {
  await vi.waitFor(
    () => {
      const reportState = jotaiStore.get(reportStateAtom)
      if (
        !reportState ||
        reportState.featuresFiltered === undefined ||
        reportState.timeseries === undefined ||
        reportState.stats === undefined ||
        reportState.isLoading
      ) {
        throw new Error('Report features not loaded yet')
      }
    },
    { timeout }
  )
}

const getCalculatedReportHours = (jotaiStore: ReturnType<typeof createJotaiStore>): number => {
  const reportState = jotaiStore.get(reportStateAtom)
  const timerange = jotaiStore.get(timerangeState)

  if (!reportState?.timeseries?.length) return 0

  const firstTimeseries = reportState.timeseries[0] as ReportGraphProps
  const formattedTimeseries = formatEvolutionData(firstTimeseries, {
    start: timerange?.start,
    end: timerange?.end,
    timeseriesInterval: firstTimeseries?.interval,
  })

  return sum(formattedTimeseries?.map((t) => sum(t.avg || [0])) || [])
}

const waitForStatsQueryLoaded = async (store: ReturnType<typeof makeStore>, timeout = 5000) => {
  return await vi.waitFor(
    () => {
      const state = store.getState()
      const params = selectFetchEventsStatsParams(state)

      if (!params) {
        throw new Error('Params not available yet')
      }

      const statsQueryState = selectReportEventsStats(params)(state)

      if (statsQueryState?.status !== 'fulfilled' && statsQueryState?.status !== 'rejected') {
        throw new Error('Stats query not loaded yet')
      }

      return statsQueryState
    },
    { timeout }
  )
}

const eezReportAction = getOpenReportActionByArea('eez')

describe('Reports', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should navigate to a report from eez', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const jotaiStore = createJotaiStore()

    const { getByTestId } = await render(<App />, { store, jotaiStore })

    const mapElement = getByTestId('app-main')
    await getByTestId('context-layer-context-layer-eez').click()

    await new Promise((resolve) => setTimeout(resolve, 500))

    const mapInstance = jotaiStore.get(mapInstanceAtom)
    const viewport = mapInstance?.getViewports?.().find((v: any) => v.id === MAP_VIEW_ID)
    const [x, y] = viewport?.project([-25, 38]) || [0, 0]

    await userEvent.click(mapElement, { position: { x, y } })
    await new Promise((resolve) => setTimeout(resolve, 500))

    await getByTestId('open-analysis-link').click()

    await testingMiddleware.waitForAction(WORKSPACE_REPORT)
    expect(store.getState().location.type).toBe(WORKSPACE_REPORT)
  })

  it('should display the date chosen in the timebar in the report description', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const jotaiStore = createJotaiStore()

    store.dispatch(eezReportAction)
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
    store.dispatch(eezReportAction)
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
    const { getByTestId } = await render(<App />, { store, jotaiStore })
    store.dispatch(eezReportAction)
    await testingMiddleware.waitForAction(WORKSPACE_REPORT)

    await waitForReportFeaturesLoaded(jotaiStore)

    const initialReportData = jotaiStore.get(reportStateAtom)
    const initialTimeseries = initialReportData?.timeseries

    const initialHours = getCalculatedReportHours(jotaiStore)
    expect(initialHours).toBeDefined()

    await getByTestId('interval-btn-month').click()
    await new Promise((resolve) => setTimeout(resolve, 500))
    await waitForReportFeaturesLoaded(jotaiStore)

    const updatedReportData = jotaiStore.get(reportStateAtom)
    const updatedTimeseries = updatedReportData?.timeseries

    expect(updatedTimeseries).not.toEqual(initialTimeseries)
    expect(updatedTimeseries).toBeDefined()
    expect(updatedTimeseries?.[0]?.interval).not.toBe(initialTimeseries?.[0]?.interval)

    const updatedHours = getCalculatedReportHours(jotaiStore)
    expect(updatedHours).toBeDefined()
    expect(typeof updatedHours).toBe('number')
    expect(typeof initialHours).toBe('number')
    expect(updatedHours).toBeGreaterThan(initialHours!)
  })

  it('should update report data when filter changes', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const jotaiStore = createJotaiStore()
    const { getByTestId, getByText } = await render(<App />, { store, jotaiStore })
    store.dispatch(eezReportAction)
    await testingMiddleware.waitForAction(WORKSPACE_REPORT)
    await waitForReportFeaturesLoaded(jotaiStore)

    const initialHours = getCalculatedReportHours(jotaiStore)
    expect(initialHours).toBeDefined()

    await getByTestId('reports-summary-tags-filters').first().click()

    await expect.element(getByTestId('reports-summary-expanded-container')).toBeVisible()

    const filterInput = getByTestId('layer-schema-filter-flag-input')
    await userEvent.click(filterInput)
    await userEvent.keyboard('portugal')
    await new Promise((resolve) => setTimeout(resolve, 100))
    const option = getByText(/portugal/i)
    await option.click()
    filterInput.element().blur()
    await getByTestId('confirm-filters-button').click()
    await new Promise((resolve) => setTimeout(resolve, 1000))
    await waitForReportFeaturesLoaded(jotaiStore)

    const updatedHours = getCalculatedReportHours(jotaiStore)
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

  it('should add new subcategory option when new layer is added from layer library', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const jotaiStore = createJotaiStore()
    const { getByTestId } = await render(<App />, { store, jotaiStore })
    store.dispatch(eezReportAction)
    await testingMiddleware.waitForAction(WORKSPACE_REPORT)

    await getByTestId('report-summary-add-layer-button').click()
    await getByTestId('add-layer-presence-button').click()
    const subselector = getByTestId('report-subsection-selector')
    await expect.element(subselector).toBeVisible()
    await expect.element(subselector).toHaveTextContent(/presence/i)
  })

  it('should show vessels in area when user logged in', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const jotaiStore = createJotaiStore()
    const { getByTestId } = await render(<App />, {
      store,
      jotaiStore,
      authenticated: true,
    })
    store.dispatch(eezReportAction)
    await testingMiddleware.waitForAction(WORKSPACE_REPORT)
    await waitForReportFeaturesLoaded(jotaiStore)

    await userEvent.click(getByTestId('see-vessel-table-activity-report'))

    expect(getByTestId('report-vessels-graph')).toBeVisible()
    const vesselsTable = getByTestId('report-vessels-table')
    await expect.element(vesselsTable).toBeVisible()
    expect(vesselsTable).toHaveTextContent('Name')
    expect(vesselsTable).toHaveTextContent('MMSI')
    expect(vesselsTable).toHaveTextContent('Flag')
    expect(vesselsTable).toHaveTextContent('Type')
    expect(vesselsTable).toHaveTextContent('hours')

    const vesselLink = vesselsTable.getByTestId('link-vessel-profile').first()
    expect(vesselLink).toBeVisible()
  })
})

describe('Global reports', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
  })

  it('should open global report when clicking on highlighted workspace in reports category', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const rendered = await render(<App />, { store })
    const getByTestId = rendered.getByTestId
    await getByTestId('category-tab-reports').click()
    const reportWorkspaceLink = getByTestId('highlighted-workspace-events-report')
    await reportWorkspaceLink.getByText('see report').click()
    const statsQueryState = await waitForStatsQueryLoaded(store)
    const statsData = statsQueryState?.data
    expect(statsData).toBeDefined()
  })

  it('should have activity, events and detections tabs', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const jotaiStore = createJotaiStore()
    const { getByText } = await render(<App />, { store, jotaiStore })
    store.dispatch(openGlobalReportAction)
    await testingMiddleware.waitForAction(WORKSPACE_REPORT)

    expect(getByText('Activity')).toBeDefined()
    expect(getByText('Events')).toBeDefined()
    expect(getByText('Detections')).toBeDefined()
  })

  it('should display the same number in the graph as in the timeseries', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const jotaiStore = createJotaiStore()
    const { getByTestId } = await render(<App />, { store, jotaiStore })
    store.dispatch(openGlobalReportAction)
    await testingMiddleware.waitForAction(WORKSPACE_REPORT)

    const statsQueryState = await waitForStatsQueryLoaded(store)
    const statsData = statsQueryState?.data

    expect(statsData).toBeDefined()
    const lastStatsValue = statsData?.[0].timeseries?.[statsData[0].timeseries.length - 1]
    expect(lastStatsValue).toBeDefined()

    const eventsGraph = getByTestId('evolution-timeseries-chart')
    const graphElement = eventsGraph.element()
    const { width, height } = graphElement.getBoundingClientRect()

    // Hover at the rightmost position to get value from graph
    await userEvent.hover(graphElement, {
      position: {
        x: width - 1,
        y: height / 2, // middle vertically
      },
    })

    await new Promise((resolve) => setTimeout(resolve, 100))
    const tooltip = getByTestId('aggregated-graph-tooltip')
    const tooltipValues = tooltip.getByRole('listitem').element().textContent
    expect(tooltipValues).toContain(lastStatsValue!.value.toString())
  })

  it('should change dataviews when changing tabs', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const jotaiStore = createJotaiStore()
    const { getByText } = await render(<App />, { store, jotaiStore })
    store.dispatch(openGlobalReportAction)
    await testingMiddleware.waitForAction(WORKSPACE_REPORT)

    const presenceButton = getByText('Presence')
    if (presenceButton) {
      await presenceButton.click()
      await new Promise((resolve) => setTimeout(resolve, 500))

      const actions = testingMiddleware.getActions()
      const updateAction = actions.findLast((action) => action.type === 'WORKSPACE_REPORT')

      expect(updateAction?.query?.reportActivitySubCategory).toBe('presence')
    }
  })

  it.todo('should show detections in detections tab', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const jotaiStore = createJotaiStore()
    const { getByText, getByTestId } = await render(<App />, { store, jotaiStore })
    store.dispatch(openGlobalReportAction)
    await testingMiddleware.waitForAction(WORKSPACE_REPORT)

    const presenceButton = getByText('Detections')
    if (presenceButton) {
      await presenceButton.click()
      await new Promise((resolve) => setTimeout(resolve, 500))

      const subselector = getByTestId('report-subsection-selector')
      await expect.element(subselector).toBeVisible()
      await expect.element(subselector).toHaveTextContent(/detections/i)
    }
  })
})

describe.todo('Private user reports', () => {
  it('should show user reports when user is logged in', async () => {})

  it('should show correct access message for private reports', async () => {})
})

describe.only('Data Comparison', () => {
  it('should show second selector when choose data comparison mode', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const jotaiStore = createJotaiStore()
    store.dispatch(eezReportAction)
    const { getByTestId, getByText } = await render(<App />, { store, jotaiStore })

    await waitForReportFeaturesLoaded(jotaiStore)

    await userEvent.click(getByTestId('graph-type-selector'))
    const comparisonOption = getByText(/data comparison/i)
    await comparisonOption.click()

    await expect.element(getByTestId('comparison-dataset-select')).toBeVisible()
  })

  it('should show both dataviews in map when compared data is selected', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const jotaiStore = createJotaiStore()
    store.dispatch(eezReportAction)
    const { getByTestId, getByText } = await render(<App />, { store, jotaiStore })

    await waitForReportFeaturesLoaded(jotaiStore)

    await userEvent.click(getByTestId('graph-type-selector'))
    const comparisonOption = getByText(/data comparison/i)
    await comparisonOption.click()

    const dataComparisonSelect = getByTestId('comparison-dataset-select')
    await dataComparisonSelect.click()
    await getByText(/imagery detections/i).click()

    const actions = testingMiddleware.getActions()
    const addLayerAction = actions.findLast((action) => action.type === 'WORKSPACE_REPORT')

    expect(addLayerAction?.query).toEqual(
      expect.objectContaining({
        reportComparisonDataviewIds: {
          compare: 'sentinel2__dataset-comparison',
          main: 'ais',
        },
      })
    )
  })

  it('should show both dataviews in graph when compared data is selected', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const jotaiStore = createJotaiStore()
    store.dispatch(eezReportAction)
    const { getByTestId, getByText } = await render(<App />, { store, jotaiStore })

    await waitForReportFeaturesLoaded(jotaiStore)

    await userEvent.click(getByTestId('graph-type-selector'))
    const comparisonOption = getByText(/data comparison/i)
    await comparisonOption.click()

    const dataComparisonSelect = getByTestId('comparison-dataset-select')
    await dataComparisonSelect.click()
    await getByText(/imagery detections/i).click()

    await new Promise((resolve) => setTimeout(resolve, 100))

    const comparisonGraph = getByTestId('report-activity-dataset-comparison')
    const graphElement = comparisonGraph.element()
    const { width, height } = graphElement.getBoundingClientRect()

    await userEvent.hover(graphElement, {
      position: {
        x: width - 30,
        y: height / 2,
      },
    })

    await new Promise((resolve) => setTimeout(resolve, 100))
    const tooltip = getByTestId('evolution-graph-tooltip')
    const tooltipListItems = tooltip.getByRole('listitem').elements()
    expect(tooltipListItems).toHaveLength(2)
    expect(tooltipListItems[0].textContent).toContain('hours')
    expect(tooltipListItems[1].textContent).toContain('detections')
  })
})
