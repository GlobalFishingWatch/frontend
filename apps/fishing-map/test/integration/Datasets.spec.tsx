import { createStore as createJotaiStore } from 'jotai'
import { render } from 'test/appTestUtils'
import { createTestingMiddleware } from 'test/testingStoreMiddeware'
import { defaultState } from 'test/utils/store/redux-store-test'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import App from 'features/app/App'
import { mapInstanceAtom } from 'features/map/map.atoms'
import { MAP_VIEW_ID } from 'features/map/map-viewport.hooks'
import { makeStore } from 'store'

// async function getViewport(jotaiStore: ReturnType<typeof createJotaiStore>) {
//   await expect
//     .poll(() => jotaiStore.get(mapInstanceAtom), { timeout: 10000, interval: 500 })
//     .toBeDefined()
//   const mapInstance = jotaiStore.get(mapInstanceAtom)
//   const viewport = mapInstance?.getViewports?.().find((v: any) => v.id === MAP_VIEW_ID)
//   if (!viewport) throw new Error('Map viewport not found')
//   return viewport
// }

describe('Datasets', () => {
  it('should add reference data layer', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const { getByTestId, getByText } = await render(<App />, { store })
    const openLayerModalButton = getByTestId('activity-add-layer-button')
    const mapElement = getByTestId('app-main')
    const addLayerButton = getByTestId('add-layer-eez-button')

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
      .element(getByTestId('map-popup-wrapper').getByText(/[\d,]+\s+Port visits/))
      .toBeVisible()
  })

  // TODO fix this, don't know why if randomly fails
  // it('should add detections data layer', async () => {
  //   const testingMiddleware = createTestingMiddleware()
  //   const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
  //   const jotaiStore = createJotaiStore()
  //   const { getByTestId, getByText } = await render(<App />, { store, jotaiStore })

  //   const DISABLED_LAYERS = ['ais', 'vms']
  //   for (const layer of DISABLED_LAYERS) {
  //     await userEvent.click(getByTestId(`activity-layer-panel-switch-${layer}`))
  //   }
  //   const LAYER_ID = 'sentinel2'
  //   await userEvent.hover(getByTestId(`activity-layer-panel-switch-${LAYER_ID}`))
  //   const removeLayerButton = getByTestId(`activity-layer-panel-remove-${LAYER_ID}`)
  //   await removeLayerButton.click()

  //   const openLayerModalButton = getByTestId('detections-add-layer-button')
  //   await openLayerModalButton.click()
  //   await expect.element(getByText('Layer Library')).toBeVisible()
  //   const addLayerButton = getByTestId(`add-layer-${LAYER_ID}-button`)
  //   await addLayerButton.click()

  //   const actions = testingMiddleware.getActions()
  //   const addLayerAction = actions.findLast((action) => action.type === 'HOME')
  //   expect(addLayerAction?.query).toMatchObject({
  //     dataviewInstances: [
  //       {
  //         id: `${LAYER_ID}__1771416000000`,
  //         category: 'detections',
  //         dataviewId: 'sentinel-2-v-4',
  //         config: {
  //           color: '#00EEFF',
  //           colorRamp: 'sky',
  //         },
  //         datasetsConfig: undefined,
  //       },
  //       {
  //         config: {
  //           visible: false,
  //         },
  //         id: 'vms',
  //       },
  //       {
  //         config: {
  //           visible: false,
  //         },
  //         id: 'ais',
  //       },
  //       {
  //         deleted: true,
  //         id: 'sentinel2',
  //       },
  //     ],
  //     latitude: 19,
  //     longitude: 26,
  //     zoom: 1.49,
  //   })

  // const viewport = await getViewport(jotaiStore)
  // const [x, y] = viewport.project([-10.3, 40.6]) || [0, 0]
  // const mapElement = await getByTestId('app-main')
  // await userEvent.hover(mapElement, { position: { x, y } })
  // await userEvent.click(mapElement, { position: { x, y } })
  // await expect.element(getByTestId('map-popup-wrapper').getByText('Detections')).toBeVisible()
  // })

  it('should add activity data layer', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const { getByTestId, getByText } = await render(<App />, { store })
    const mapElement = getByTestId('app-main')
    const openLayerModalButton = getByTestId('activity-add-layer-button')
    const removeLayerButton = getByTestId('activity-layer-panel-remove-presence')
    const addLayerButton = getByTestId('add-layer-presence-button')

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
      latitude: 19,
      longitude: 26,
      zoom: 1.49,
    })

    await expect
      .element(getByTestId('map-popup-wrapper').getByText('Vessel presence'))
      .toBeVisible()

    await expect
      .element(
        getByTestId('map-popup-wrapper')
          .getByText(/[\d.]+\s+hours/)
          .first()
      )
      .toBeVisible()
  })

  it('should preserve other layers when removing layer', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const { getByTestId } = await render(<App />, { store })
    const mapElement = getByTestId('app-main')
    const vesselPresenceSwitch = getByTestId('activity-layer-panel-switch-presence')
    const removeAISLayerButton = getByTestId('activity-layer-panel-remove-ais')
    const removeVMSLayerButton = getByTestId('activity-layer-panel-remove-vms')

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
