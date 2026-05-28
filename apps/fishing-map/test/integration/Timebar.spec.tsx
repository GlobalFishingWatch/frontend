import React from 'react'
import { createStore as createJotaiStore } from 'jotai'
import { render } from 'test/appTestUtils'
import { WAIT } from 'test/setup/config'
import { createTestingMiddleware, defaultState } from 'test/utils/store'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

import { mapInstanceAtom } from 'features/map/map.atoms'
import { MAP_VIEW_ID } from 'features/map/map-viewport.hooks'
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
    const mapElement = getByTestId('app-main')
    expect(mapElement).toBeDefined()

    await new Promise((resolve) => setTimeout(resolve, WAIT.MAP_INIT))

    await userEvent.dragAndDrop(timebarWrapper, timebarWrapper, {
      sourcePosition: { x: 400, y: 35 },
      targetPosition: { x: 700, y: 35 },
      steps: 5, // This is needed to trigger the drag event, as a single step is not captured
    })

    const timebarAction = testingMiddleware.getLastActionByType('timebar/setHighlightedTime')
    expect(timebarAction).toBeDefined()
    expect(timebarAction?.payload?.start).toBeDefined()
    expect(timebarAction?.payload?.end).toBeDefined()

    await new Promise((resolve) => setTimeout(resolve, 1000))

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
    const [x, y] = viewport?.project([-15, 28]) || [0, 0]

    await userEvent.click(mapElement, { position: { x, y } })

    await expect.element(getByTestId('map-popup-wrapper')).toBeVisible()
  })

  it('events should be visible on timebar', async () => {
    const store = makeStore(defaultState)
    const { getByTestId, getByText } = await render({
      store,
    })

    await getByTestId('events-layer-switch-encounters').click()

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const timebarWrapper = getByTestId('timebar-wrapper')

    await userEvent.hover(timebarWrapper, { position: { x: 300, y: 35 } })

    await new Promise((resolve) => setTimeout(resolve, 1000))

    await expect.element(getByText(/\d+\.?\d* events on screen/)).toBeVisible()
  })

  it('detections should be visible on timebar', async () => {
    const store = makeStore(defaultState)
    const { getByTestId, getByText } = await render({
      store,
    })

    await getByTestId('activity-layer-panel-switch-ais').click()
    await getByTestId('activity-layer-panel-switch-vms').click()

    await getByTestId('activity-layer-panel-switch-sentinel2').click()

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const timebarWrapper = getByTestId('timebar-wrapper')

    await userEvent.hover(timebarWrapper, { position: { x: 300, y: 35 } })

    await new Promise((resolve) => setTimeout(resolve, 1000))

    await expect.element(getByText(/\d+\.?\d* detections on screen/)).toBeVisible()
  })
})
