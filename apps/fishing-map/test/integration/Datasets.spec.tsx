import { render } from 'test/appTestUtils'
import { defaultState } from 'test/defaultState'
import { createTestingMiddleware } from 'test/testingStoreMiddeware'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import App from 'features/app/App'
import { makeStore } from 'store'

describe('Datasets', () => {
  it('should add reference data layer', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const { getByTestId, getByText } = await render(<App />, { store })
    const openLayerModalButton = getByTestId('activity-add-layer-button')
    const mapElement = getByTestId('app-main')
    const addLayerButton = getByTestId('add-layer-eez-button')

    expect(store.getState().map.loaded).toBe(true)

    await openLayerModalButton.click()

    await expect.element(getByText('Layer Library')).toBeVisible()

    await addLayerButton.click()

    await new Promise((resolve) => setTimeout(resolve, 2000))

    await userEvent.click(mapElement, { position: { x: 6, y: 400 } })

    const actions = testingMiddleware.getActions()
    const addLayerAction = actions.findLast((action) => action.type === 'HOME')
    expect(addLayerAction?.query).toMatchObject({
      dataviewInstances: [
        {
          id: 'eez__1771416000000',
          category: 'context',
          dataviewId: 'eez',
          config: {
            color: '#069688',
          },
        },
      ],
    })
    await expect
      .element(getByTestId('map-popup-wrapper').getByRole('heading', { name: 'EEZs' }))
      .toBeVisible()
  })

  it('should add environment data layer', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const { getByTestId, getByText } = await render(<App />, { store })
    const openLayerModalButton = getByTestId('activity-add-layer-button')
    const mapElement = getByTestId('app-main')
    const addLayerButton = getByTestId('add-layer-bathymetry-button')

    expect(store.getState().map.loaded).toBe(true)

    await openLayerModalButton.click()

    await expect.element(getByText('Layer Library')).toBeVisible()

    await addLayerButton.click()
    await new Promise((resolve) => setTimeout(resolve, 2000))
    await userEvent.click(mapElement, { position: { x: 200, y: 200 } })

    const actions = testingMiddleware.getActions()
    const addLayerAction = actions.findLast((action) => action.type === 'HOME')
    expect(addLayerAction?.query).toMatchObject({
      dataviewInstances: [
        {
          id: 'bathymetry__1771416000000',
          category: 'environment',
          dataviewId: 'heatmap-static-layer',
          config: {
            color: 'bathymetry',
          },
        },
      ],
    })
    await expect
      .element(getByTestId('map-popup-wrapper').getByRole('heading', { name: 'Bathymetry' }))
      .toBeVisible()
  })

  it('should add events data layer', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const { getByTestId, getByText } = await render(<App />, { store })
    const openLayerModalButton = getByTestId('activity-add-layer-button')
    const mapElement = getByTestId('app-main')
    const addLayerButton = getByTestId('add-layer-port-visits-button')

    expect(store.getState().map.loaded).toBe(true)

    await openLayerModalButton.click()

    await expect.element(getByText('Layer Library')).toBeVisible()

    await addLayerButton.click()

    await new Promise((resolve) => setTimeout(resolve, 2000))

    await userEvent.hover(mapElement, { position: { x: 40, y: 350 } })

    const actions = testingMiddleware.getActions()
    const addLayerAction = actions.findLast((action) => action.type === 'HOME')

    expect(addLayerAction?.query).toMatchObject({
      dataviewInstances: [
        {
          id: 'port-visits__1771416000000',
          category: 'events',
          dataviewId: 'port-visit-cluster-events-v-4',
          config: {
            color: '#9AEEFF',
          },
        },
      ],
    })

    await expect
      .element(getByTestId('map-popup-wrapper').getByText('140,586 Port Visits'))
      .toBeVisible()
  })

  it('should add detections data layer', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const { getByTestId, getByText } = await render(<App />, { store })
    const openLayerModalButton = getByTestId('activity-add-layer-button')
    const mapElement = getByTestId('app-main')
    const removeLayerButton = getByTestId('events-layer-panel-remove-encounters')
    const addLayerButton = getByTestId('add-layer-encounters-button')

    expect(store.getState().map.loaded).toBe(true)

    await userEvent.hover(getByTestId('events-layer-switch-encounters'))
    await new Promise((resolve) => setTimeout(resolve, 300))
    await removeLayerButton.click()
    await openLayerModalButton.click()

    await expect.element(getByText('Layer Library')).toBeVisible()

    await addLayerButton.click()

    await new Promise((resolve) => setTimeout(resolve, 2000))

    await userEvent.hover(mapElement, { position: { x: 5, y: 455 } })

    const actions = testingMiddleware.getActions()
    const addLayerAction = actions.findLast((action) => action.type === 'HOME')

    expect(addLayerAction?.query).toMatchObject({
      dataviewInstances: [
        {
          id: 'encounters__1771416000000',
          category: 'events',
          dataviewId: 'encounter-cluster-events-v-4',
          config: {
            color: '#FAE9A0',
          },
        },
        {
          id: 'encounters',
          deleted: true,
        },
      ],
    })

    await expect
      .element(getByTestId('map-popup-wrapper').getByText('335 Encounter Events'))
      .toBeVisible()
  })

  it('should add activity data layer', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const { getByTestId, getByText } = await render(<App />, { store })
    const mapElement = getByTestId('app-main')
    const openLayerModalButton = getByTestId('activity-add-layer-button')
    const removeLayerButton = getByTestId('activity-layer-panel-remove-presence')
    const addLayerButton = getByTestId('add-layer-presence-button')

    expect(store.getState().map.loaded).toBe(true)

    await userEvent.hover(getByTestId('activity-layer-panel-switch-presence'))
    await new Promise((resolve) => setTimeout(resolve, 300))
    await removeLayerButton.click()
    await openLayerModalButton.click()

    await expect.element(getByText('Layer Library')).toBeVisible()

    await addLayerButton.click()

    await new Promise((resolve) => setTimeout(resolve, 2000))

    await userEvent.click(mapElement, { position: { x: 4, y: 453 } })

    const actions = testingMiddleware.getActions()
    const addLayerAction = actions.findLast((action) => action.type === 'HOME')

    expect(addLayerAction?.query).toMatchObject({
      dataviewInstances: [
        {
          id: 'presence__1771416000000',
          category: 'activity',
          dataviewId: 'presence-activity-v-4',
          config: {
            color: '#FF64CE',
          },
        },
        {
          id: 'presence',
          deleted: true,
        },
      ],
    })

    await expect
      .element(getByTestId('map-popup-wrapper').getByText('Apparent fishing effort (VMS)'))
      .toBeVisible()

    await expect.element(getByTestId('map-popup-wrapper').getByText('139.77 hours')).toBeVisible()
  })

  it('should preserve other layers when removing layer', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const { getByTestId } = await render(<App />, { store })
    const mapElement = getByTestId('app-main')
    const vesselPresenceSwitch = getByTestId('activity-layer-panel-switch-presence')
    const removeAISLayerButton = getByTestId('activity-layer-panel-remove-ais')
    const removeVMSLayerButton = getByTestId('activity-layer-panel-remove-vms')

    expect(store.getState().map.loaded).toBe(true)

    await userEvent.click(vesselPresenceSwitch)
    await userEvent.hover(getByTestId('activity-layer-panel-switch-ais'))
    await removeAISLayerButton.click()
    await userEvent.hover(getByTestId('activity-layer-panel-switch-vms'))
    await removeVMSLayerButton.click()

    await new Promise((resolve) => setTimeout(resolve, 2000))

    await userEvent.click(mapElement, { position: { x: 5, y: 402 } })

    const actions = testingMiddleware.getActions()
    const addLayerAction = actions.findLast((action) => action.type === 'HOME')
    expect(addLayerAction?.query).toMatchObject({
      dataviewInstances: [
        {
          id: 'presence',
          config: {
            visible: true,
          },
        },
        {
          id: 'ais',
          deleted: true,
        },
        {
          id: 'vms',
          deleted: true,
        },
      ],
    })

    await expect
      .element(getByTestId('map-popup-wrapper').getByRole('heading', { name: 'Vessel presence' }))
      .toBeVisible()

    const valueElement = getByTestId('map-popup-wrapper').getByTestId('activity-tooltip-row-value')
    await expect.element(valueElement).toBeVisible()
    await expect.element(valueElement).toHaveTextContent(/[\d,]+\s+hours/)
  })
})
