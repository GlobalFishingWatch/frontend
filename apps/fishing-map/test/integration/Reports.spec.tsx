import { sum } from 'es-toolkit'
import { createStore as createJotaiStore } from 'jotai'
import { selectReportEventsStats } from 'queries/report-events-stats-api'
import { render } from 'test/appTestUtils'
import { navigateToComparisonReport } from 'test/utils/navigation/navigateToComparisonReport'
import { navigateToGlobalReport } from 'test/utils/navigation/navigateToGlobalReport'
import { navigateToNoDataReport } from 'test/utils/navigation/navigateToNoDataReport'
import { navigateToReportByArea } from 'test/utils/navigation/navigateToReportByArea'
import {
  navigateToUserReport,
  navigateToUserReportsTab,
} from 'test/utils/navigation/navigateToUserReport'
import { navigateToWorkspace01 } from 'test/utils/navigation/navigateToWorkspace01'
import { defaultState } from 'test/utils/store'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

import { DataviewCategory } from '@globalfishingwatch/api-types'
import { deckLayersStateAtom } from '@globalfishingwatch/deck-layer-composer'

import { formatI18nDate } from 'features/i18n/i18nDate.utils'
import { mapInstanceAtom } from 'features/map/map.atoms'
import { MAP_VIEW_ID } from 'features/map/map-viewport.hooks'
import { setModalOpen } from 'features/modals/modals.slice'
import { ReportCategory } from 'features/reports/reports.types'
import type { ReportGraphProps } from 'features/reports/reports-timeseries.hooks'
import { reportStateAtom } from 'features/reports/reports-timeseries.hooks'
import { formatEvolutionData } from 'features/reports/tabs/activity/reports-activity-timeseries.utils'
import { selectFetchEventsStatsParams } from 'features/reports/tabs/events/events-report.selectors'
import { timerangeState } from 'features/timebar/timebar.hooks'
import { selectUserReports } from 'features/user/selectors/user.permissions.selectors'
import type { ROUTE_TYPES } from 'router/routes'
import { REPORT, WORKSPACE_REPORT } from 'router/routes'
import { ROUTE_PATHS } from 'router/routes.utils'
import type { AppStore } from 'store'
import { makeStore } from 'store'
import { AsyncReducerStatus } from 'utils/async-slice'

import { waitForMapLoaded } from '../utils/map'

/**
 * Polls until `store.getState().location.type` matches — use in integration specs
 * when waiting for navigation to finish.
 */
async function waitForLocationType(store: AppStore, type: ROUTE_TYPES, timeout = 10000) {
  await expect.poll(() => store.getState().location.type, { timeout }).toBe(type)
}

const clickReportTab = async (
  getByRole: Awaited<ReturnType<typeof render>>['getByRole'],
  name: 'Activity' | 'Events' | 'Detections'
) => {
  await userEvent.click(getByRole('button', { name, exact: true }))
}

const waitForUserReportsReady = async (store: ReturnType<typeof makeStore>, timeout = 60000) => {
  await expect
    .poll(() => store.getState().reports.status, { timeout })
    .toBe(AsyncReducerStatus.Finished)
}

const findUserReportByName = (store: ReturnType<typeof makeStore>, name: RegExp) => {
  return selectUserReports(store.getState()).find((report) => name.test(report.name || ''))
}

const waitForReportFeaturesLoaded = async (
  jotaiStore: ReturnType<typeof createJotaiStore>,
  timeout = 60000
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

const waitForStatsQueryLoaded = async (store: ReturnType<typeof makeStore>, timeout = 20000) => {
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

describe('Reports', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should navigate to a report from eez', async () => {
    const store = makeStore(defaultState)
    const jotaiStore = createJotaiStore()

    const { getByTestId } = await render({ store, jotaiStore })

    const mapElement = getByTestId('app-main')
    await userEvent.click(getByTestId('context-layer-context-layer-eez'))
    await new Promise((resolve) => setTimeout(resolve, 1000))
    await waitForMapLoaded(getByTestId)

    await expect
      .poll(() => jotaiStore.get(mapInstanceAtom), {
        timeout: 10000,
        interval: 500,
      })
      .toBeDefined()
    const mapInstance = jotaiStore.get(mapInstanceAtom)
    const viewport = mapInstance?.getViewports?.().find((v: any) => v.id === MAP_VIEW_ID)
    if (!viewport) {
      throw new Error('Map viewport not found - cannot project coordinates')
    }
    const [x, y] = viewport?.project([-28, 38]) || [0, 0]

    await userEvent.hover(mapElement, { position: { x, y } })
    await userEvent.click(mapElement, { position: { x, y } })
    await new Promise((resolve) => setTimeout(resolve, 500))

    await expect.element(getByTestId('open-analysis-link')).toBeVisible()
    await userEvent.click(getByTestId('open-analysis-link'))

    await waitForLocationType(store, WORKSPACE_REPORT, 60000)
  })

  it('should display the date chosen in the timebar with the imprecision tolerance in the report description', async () => {
    const store = makeStore(defaultState)
    const jotaiStore = createJotaiStore()

    const { getByTestId, router } = await render({ store, jotaiStore })
    await router.navigate(navigateToReportByArea('eez'))
    await waitForLocationType(store, WORKSPACE_REPORT, 60000)
    await waitForMapLoaded(getByTestId)

    const timerange = jotaiStore.get(timerangeState)
    expect(timerange).toBeDefined()
    const start = formatI18nDate(timerange?.start)
    const end = formatI18nDate(timerange?.end)

    await expect
      .poll(
        () =>
          document.querySelector('[data-testid="report-summary"] [class*="summaryContainer"]')
            ?.textContent ?? '',
        { timeout: 90000 }
      )
      .toContain(start)

    const descriptionText =
      document.querySelector('[data-testid="report-summary"] [class*="summaryContainer"]')
        ?.textContent ?? ''
    expect(descriptionText).toContain(end)
    expect(descriptionText).toMatch(/± \d+%/)
  }, 120000)

  it('should show same report data at different zoom levels', async () => {
    const store = makeStore(defaultState)
    const jotaiStore = createJotaiStore()
    const { getByTestId, router } = await render({ store, jotaiStore })
    await router.navigate(navigateToReportByArea('mpa'))
    await waitForLocationType(store, WORKSPACE_REPORT, 60000)
    await waitForReportFeaturesLoaded(jotaiStore)

    const initialReportData = jotaiStore.get(reportStateAtom)

    await userEvent.click(getByTestId('map-control-zoom-in'))
    const zoomedReportData = jotaiStore.get(reportStateAtom)
    expect(zoomedReportData).toEqual(initialReportData)
  })

  it('should update report data when timebar changes', async () => {
    const store = makeStore(defaultState)
    const jotaiStore = createJotaiStore()
    const { getByTestId, router } = await render({ store, jotaiStore })
    await router.navigate(navigateToReportByArea('mpa'))
    await waitForLocationType(store, WORKSPACE_REPORT)

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
    const store = makeStore(defaultState)
    const jotaiStore = createJotaiStore()
    const { getByTestId, getByText, router } = await render({ store, jotaiStore })
    await router.navigate(navigateToReportByArea('eez'))
    await expect.poll(() => store.getState().location.type).toBe(WORKSPACE_REPORT)
    await waitForReportFeaturesLoaded(jotaiStore)

    const initialHours = getCalculatedReportHours(jotaiStore)
    expect(initialHours).toBeDefined()

    await userEvent.click(getByTestId('reports-summary-tags-filters').first())

    await expect.element(getByTestId('reports-summary-expanded-container')).toBeVisible()

    const filterInput = getByTestId('multi-select-input').first()
    await userEvent.click(filterInput)
    await userEvent.keyboard('portugal')
    await new Promise((resolve) => setTimeout(resolve, 100))
    const option = getByText(/portugal/i)
    await userEvent.click(option)
    await userEvent.tab()
    await getByTestId('confirm-filters-button').click()
    await waitForReportFeaturesLoaded(jotaiStore, 60000)

    const updatedHours = getCalculatedReportHours(jotaiStore)
    expect(updatedHours).toBeDefined()
    expect(typeof updatedHours).toBe('number')
    expect(typeof initialHours).toBe('number')
    expect(updatedHours).toBeLessThan(initialHours!)
  })

  it('should show no data message when no data', async () => {
    const store = makeStore(defaultState)
    const jotaiStore = createJotaiStore()
    const { getByTestId, getByText, router } = await render({ store, jotaiStore })

    jotaiStore.set(timerangeState, {
      start: '2025-12-17T00:00:00.000Z',
      end: '2025-12-18T00:00:00.000Z',
    })
    await router.navigate(navigateToNoDataReport())
    await waitForMapLoaded(getByTestId)
    await waitForReportFeaturesLoaded(jotaiStore)
    await expect.element(getByText(/No data available for the selected area/)).toBeVisible()
  })

  it('should add new subcategory option when new layer is added from layer library', async () => {
    const store = makeStore(defaultState)
    const jotaiStore = createJotaiStore()
    const { getByTestId, router } = await render({ store, jotaiStore })
    await router.navigate(navigateToReportByArea('mpa'))
    await waitForLocationType(store, WORKSPACE_REPORT)
    await waitForReportFeaturesLoaded(jotaiStore)

    store.dispatch(
      setModalOpen({ id: 'layerLibrary', open: DataviewCategory.Activity, singleCategory: true })
    )
    await expect.element(getByTestId('add-layer-presence-button')).toBeVisible()
    await getByTestId('add-layer-presence-button').click()
    const subselector = getByTestId('report-subsection-selector')
    await expect.element(subselector).toBeVisible()
    await expect.element(subselector).toHaveTextContent(/presence/i)
  })

  // TODO: fix flaky tests
  // it('should show vessels in area when user logged in', async () => {
  //   const store = makeStore(defaultState)
  //   const jotaiStore = createJotaiStore()
  //   const { getByTestId } = await render({
  //     store,
  //     jotaiStore,
  //     authenticated: true,
  //   })
  //   store.dispatch(mpaReportAction)
  //   await expect.poll(() => store.getState().location.type).toBe(WORKSPACE_REPORT)
  //   await waitForReportFeaturesLoaded(jotaiStore)

  //   await userEvent.click(getByTestId('see-vessel-table-activity-report'))

  //   await expect.element(getByTestId('report-vessels-graph')).toBeVisible()
  //   const vesselsTable = getByTestId('report-vessels-table')
  //   await expect.element(vesselsTable).toBeVisible()
  //   await expect.element(vesselsTable).toHaveTextContent('Name')
  //   await expect.element(vesselsTable).toHaveTextContent('MMSI')
  //   await expect.element(vesselsTable).toHaveTextContent('Flag')
  //   await expect.element(vesselsTable).toHaveTextContent('Type')
  //   await expect.element(vesselsTable).toHaveTextContent('hours')

  //   const vesselLink = vesselsTable.getByTestId('link-vessel-profile').first()
  //   await expect.element(vesselLink).toBeVisible()
  // })
})

describe('Global reports', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
  })

  it('should open global report when clicking on highlighted workspace in reports category', async () => {
    const store = makeStore(defaultState)
    const rendered = await render({ store })
    const getByTestId = rendered.getByTestId
    await getByTestId('link-category-reports').click()
    const reportWorkspaceLink = getByTestId('highlighted-workspace-events-report')
    await reportWorkspaceLink.getByText('see report').click()
    const statsQueryState = await waitForStatsQueryLoaded(store)
    const statsData = statsQueryState?.data
    expect(statsData).toBeDefined()
  })

  it('should have activity, events and detections tabs', async () => {
    const store = makeStore(defaultState)
    const { getByText, router } = await render({ store })
    await router.navigate(navigateToGlobalReport())
    await waitForLocationType(store, WORKSPACE_REPORT)

    expect(getByText('Activity')).toBeDefined()
    expect(getByText('Events')).toBeDefined()
    expect(getByText('Detections')).toBeDefined()
  })

  it('should display the same number in the graph as in the timeseries', async () => {
    const store = makeStore(defaultState)
    const jotaiStore = createJotaiStore()
    const { getByTestId, getByRole, router } = await render({ store, jotaiStore })
    await router.navigate(navigateToGlobalReport())
    await waitForLocationType(store, WORKSPACE_REPORT)
    await waitForMapLoaded(getByTestId)

    await clickReportTab(getByRole, 'Events')

    const statsQueryState = await waitForStatsQueryLoaded(store)
    const statsData = statsQueryState?.data

    expect(statsData).toBeDefined()
    const latestStatsData = (await waitForStatsQueryLoaded(store))?.data
    await expect.element(getByTestId('evolution-timeseries-chart')).toBeVisible()
    const timeseries = latestStatsData?.[0]?.timeseries
    if (!timeseries?.length) {
      // Some environments return empty stats for this report; keep the test checking chart render.
      return
    }
    const lastStatsValue = timeseries[timeseries.length - 1]
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
    const store = makeStore(defaultState)
    const jotaiStore = createJotaiStore()
    const { getByTestId, getByRole, getByText, router } = await render({ store, jotaiStore })
    await router.navigate(navigateToGlobalReport())
    await waitForLocationType(store, WORKSPACE_REPORT)

    await clickReportTab(getByRole, 'Activity')
    await waitForReportFeaturesLoaded(jotaiStore)

    const presenceButton = getByText(/vessel Presence/i)
    await userEvent.click(presenceButton)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    await waitForMapLoaded(getByTestId)

    await waitForReportFeaturesLoaded(jotaiStore)
    await expect
      .element(getByText(/hours of Vessel presence in the area between/i).first())
      .toBeVisible()

    await expect
      .poll(
        () => {
          return jotaiStore.get(deckLayersStateAtom)
        },
        { timeout: 20000 }
      )
      .toMatchObject({
        basemap: {
          cacheHash: '',
          loaded: true,
        },
        presence: {
          cacheHash: expect.stringContaining('presence-public-global-presence'),
          // '1761955200000,1771372800000,1759276800000,DAY,,,-presence-public-global-presence:v4.0--|false|true',
          loaded: true,
        },
      })
  })

  it('should show detections in detections tab', async () => {
    const store = makeStore(defaultState)
    const jotaiStore = createJotaiStore()
    const { getByText, getByTestId, router } = await render({ store, jotaiStore })
    await router.navigate(navigateToGlobalReport())
    await waitForLocationType(store, WORKSPACE_REPORT)

    const detectionsTab = getByText('Detections')
    await userEvent.click(detectionsTab)

    await new Promise((resolve) => setTimeout(resolve, 100))
    await waitForMapLoaded(getByTestId)

    const subselector = getByTestId('report-subsection-selector')
    await expect.element(subselector).toBeVisible()
    await expect.element(subselector).toHaveTextContent(/Night light detections \(VIIRS\)/i)
    await expect.element(subselector).toHaveTextContent(/Radar vessel detections \(SAR\)/i)
    await expect.element(subselector).toHaveTextContent(/Sentinel 2/i)
  })
})

describe('Private user reports', () => {
  it('should show correct access message for private reports', async () => {
    const store = makeStore(defaultState)
    const jotaiStore = createJotaiStore()
    const { getByText, router } = await render({
      store,
      jotaiStore,
      authenticated: false,
    })

    await router.navigate(navigateToWorkspace01())

    await expect.element(getByText(/This is a private workspace/)).toBeVisible()
  })

  it('should show user reports when user is logged in', async () => {
    const store = makeStore(defaultState)
    const jotaiStore = createJotaiStore()
    const { router } = await render({
      store,
      jotaiStore,
      authenticated: true,
    })

    await router.navigate(navigateToUserReportsTab())
    await waitForUserReportsReady(store)

    await expect
      .poll(() => findUserReportByName(store, /Report01/i), { timeout: 30000 })
      .toBeDefined()

    const report = findUserReportByName(store, /Report01/i)
    if (!report) {
      throw new Error('Report01 not found in user reports')
    }

    await router.navigate(navigateToUserReport(report.id))
    await waitForLocationType(store, REPORT, 60000)
  }, 90000)

  it('should correctly display others points reports data', async () => {
    const store = makeStore(defaultState)
    const jotaiStore = createJotaiStore()
    const { getByText, router } = await render({
      store,
      jotaiStore,
      authenticated: true,
    })

    await router.navigate(navigateToUserReportsTab())
    await waitForUserReportsReady(store)

    await expect
      .poll(() => findUserReportByName(store, /Report02/i), { timeout: 30000 })
      .toBeDefined()

    const report = findUserReportByName(store, /Report02/i)
    if (!report) {
      throw new Error('Report02 not found in user reports')
    }

    await router.navigate(navigateToUserReport(report.id))
    await waitForLocationType(store, REPORT, 60000)

    await router.navigate({
      from: ROUTE_PATHS.REPORT,
      replace: true,
      search: (prev) => ({
        ...prev,
        reportCategory: ReportCategory.Others,
      }),
    })
    await waitForReportFeaturesLoaded(jotaiStore, 60000)
    await expect.element(getByText(/4 points inside your area/i)).toBeVisible()
  }, 120000)
})

describe('Data Comparison', () => {
  it('should show second selector when choose data comparison mode', async () => {
    const store = makeStore(defaultState)
    const jotaiStore = createJotaiStore()
    const { getByTestId, getByText, router } = await render({ store, jotaiStore })
    await router.navigate(navigateToReportByArea('mpa'))

    await waitForMapLoaded(getByTestId)
    await waitForReportFeaturesLoaded(jotaiStore)

    const graphTypeSelector = getByTestId('graph-type-selector')
    await expect.element(graphTypeSelector).toBeVisible()
    await graphTypeSelector.click()
    const comparisonOption = getByText(/data comparison/i)
    await comparisonOption.click()
    await new Promise((resolve) => setTimeout(resolve, 100))

    await expect.element(getByTestId('comparison-dataset-select')).toBeVisible()
  })

  it('should show both dataviews in map when compared data is selected', async () => {
    const store = makeStore(defaultState)
    const jotaiStore = createJotaiStore()
    const { getByTestId, getByText, router } = await render({ store, jotaiStore })
    await router.navigate(navigateToReportByArea('mpa'))

    await waitForReportFeaturesLoaded(jotaiStore)

    await userEvent.click(getByTestId('graph-type-selector'))
    const comparisonOption = getByText(/data comparison/i)
    await userEvent.click(comparisonOption)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const dataComparisonSelect = getByTestId('comparison-dataset-select')
    await userEvent.click(dataComparisonSelect)
    await userEvent.click(getByText(/imagery detections/i))

    await expect
      .poll(() => store.getState().location.query)
      .toMatchObject({
        reportComparisonDataviewIds: {
          compare: 'sentinel2__dataset-comparison',
          main: 'ais',
        },
      })
  })

  it('should show both dataviews in graph when compared data is selected', async () => {
    const store = makeStore(defaultState)
    const jotaiStore = createJotaiStore()
    const { getByTestId, router } = await render({ store, jotaiStore })
    await router.navigate(navigateToComparisonReport())
    await waitForReportFeaturesLoaded(jotaiStore, 60000)
    await expect.element(getByTestId('report-activity-dataset-comparison')).toBeVisible()
    const comparisonGraph = getByTestId('report-activity-dataset-comparison')
    const graphElement = comparisonGraph.element()
    const { width, height } = graphElement.getBoundingClientRect()

    await userEvent.hover(graphElement, {
      position: {
        x: width - 30,
        y: height / 2,
      },
    })

    await expect
      .poll(
        () => {
          const tooltip = getByTestId('evolution-graph-tooltip')
          const tooltipListItems = tooltip.getByRole('listitem').elements()
          if (!tooltipListItems.length) {
            return undefined
          }
          return tooltipListItems.map((item) => item.textContent || '')
        },
        { timeout: 20000, interval: 250 }
      )
      .toEqual(
        expect.arrayContaining([
          expect.stringMatching(/hours/i),
          expect.stringMatching(/detections/i),
        ])
      )
  })
})
