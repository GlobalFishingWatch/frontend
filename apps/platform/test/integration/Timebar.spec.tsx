import { createStore as createJotaiStore } from 'jotai'
import { render } from 'test/appTestUtils'
import { projectToMap, waitForLayersLoaded } from 'test/utils/map'
import { createTestingMiddleware, defaultState } from 'test/utils/store'
import { getDataDayTimebarX } from 'test/utils/timebar'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

import { makeStore } from 'store'

describe('App Timebar Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('the map should be interactive after timebar interaction', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()])
    const jotaiStore = createJotaiStore()
    const { getByTestId } = await render({
      store,
      jotaiStore,
    })

    const timebarWrapper = getByTestId('timebar-wrapper')

    await waitForLayersLoaded(jotaiStore)

    // Highlight a stretch around the day the synthetic tiles hold data, so the map cell clicked
    // below has a value in the highlighted time
    const dataDayX = await getDataDayTimebarX(getByTestId, jotaiStore)
    await userEvent.dragAndDrop(timebarWrapper, timebarWrapper, {
      sourcePosition: { x: dataDayX - 40, y: 35 },
      targetPosition: { x: dataDayX + 40, y: 35 },
      steps: 5, // This is needed to trigger the drag event, as a single step is not captured
    })

    const timebarAction = testingMiddleware.getLastActionByType('timebar/setHighlightedTime')
    expect(timebarAction).toBeDefined()
    expect(timebarAction?.payload?.start).toBeDefined()
    expect(timebarAction?.payload?.end).toBeDefined()

    // The highlighted time reloads the activity tiles
    await waitForLayersLoaded(jotaiStore)

    const position = await projectToMap(jotaiStore, -15, 28)
    await userEvent.click(getByTestId('app-main'), { position })

    await expect.element(getByTestId('map-popup-wrapper')).toBeVisible()
  })

  it('events should be visible on timebar', async () => {
    const store = makeStore(defaultState)
    const { getByTestId, getByText, jotaiStore } = await render({
      store,
    })

    await getByTestId('events-layer-switch-encounters').click()
    await waitForLayersLoaded(jotaiStore)

    const timebarWrapper = getByTestId('timebar-wrapper')

    // Hover where there is data: a fixed pixel lands on a day with none
    const x = await getDataDayTimebarX(getByTestId, jotaiStore)
    await userEvent.hover(timebarWrapper, { position: { x, y: 35 } })

    await expect.element(getByText(/\d+\.?\d* events on screen/)).toBeVisible()
  })

  it('detections should be visible on timebar', async () => {
    const store = makeStore(defaultState)
    const { getByTestId, getByText, jotaiStore } = await render({
      store,
    })

    await getByTestId('activity-layer-panel-switch-ais').click()
    await getByTestId('activity-layer-panel-switch-vms').click()

    await getByTestId('activity-layer-panel-switch-sentinel2').click()
    await waitForLayersLoaded(jotaiStore)

    const timebarWrapper = getByTestId('timebar-wrapper')

    const x = await getDataDayTimebarX(getByTestId, jotaiStore)
    await userEvent.hover(timebarWrapper, { position: { x, y: 35 } })

    await expect.element(getByText(/\d+\.?\d* detections on screen/)).toBeVisible()
  })
})
