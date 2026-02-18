import React from 'react'
import { render } from 'test/appTestUtils'
import { defaultState } from 'test/defaultState'
import { createTestingMiddleware } from 'test/testingStoreMiddeware'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

import App from 'features/app/App'
import { makeStore } from 'store'

describe('App Timebar Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('the map should be interactive after timebar interaction', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const { getByTestId } = await render(<App />, {
      store,
    })

    expect(store.getState().map.loaded).toBe(true)

    const timebarWrapper = getByTestId('timebar-wrapper')
    const mapElement = getByTestId('app-main')
    expect(mapElement).toBeDefined()

    await userEvent.dragAndDrop(timebarWrapper, timebarWrapper, {
      sourcePosition: { x: 400, y: 35 },
      targetPosition: { x: 700, y: 35 },
      steps: 5, // This is needed to trigger the drag event, as a single step is not captured
    })

    const actions = testingMiddleware.getActions()

    const timebarAction = actions.findLast((action) => action.type === 'timebar/setHighlightedTime')
    expect(timebarAction).toBeDefined()

    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Click on map
    await userEvent.click(mapElement, { position: { x: 5, y: 400 } })

    await expect.element(getByTestId('map-popup-wrapper')).toBeVisible()
  })

  it('events should be visible on timebar', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const { getByTestId, getByText } = await render(<App />, {
      store,
    })

    expect(store.getState().map.loaded).toBe(true)

    await getByTestId('events-layer-switch-encounters').click()

    const timebarWrapper = getByTestId('timebar-wrapper')

    await userEvent.hover(timebarWrapper, { position: { x: 300, y: 35 } })

    await expect.element(getByText(/\d+\.?\d* events on screen/)).toBeVisible()
  })

  it('detections should be visible on timebar', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const { getByTestId, getByText } = await render(<App />, {
      store,
    })

    expect(store.getState().map.loaded).toBe(true)

    await getByTestId('activity-layer-panel-switch-ais').click()
    await getByTestId('activity-layer-panel-switch-vms').click()

    await getByTestId('activity-layer-panel-switch-sentinel2').click()

    const timebarWrapper = getByTestId('timebar-wrapper')

    await userEvent.hover(timebarWrapper, { position: { x: 300, y: 35 } })

    await expect.element(getByText(/\d+\.?\d* detections on screen/)).toBeVisible()
  })
})
