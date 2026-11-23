import { render } from 'test/appTestUtils'
import { clickLayerAction } from 'test/utils/layers'
import {
  findLayerObjectPosition,
  GABU_REEFER_VIEWER_COORDS,
  openMapPopupAt,
  waitForLayersLoaded,
} from 'test/utils/map'
import { createTestingMiddleware, defaultState } from 'test/utils/store'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import {
  CLUSTER_PORT_VISIT_EVENTS_DATAVIEW_SLUG,
  PRESENCE_DATAVIEW_SLUG,
} from '@platform/config/map/dataviews'

import { makeStore } from 'store'

// Off the Canary Islands: inside an EEZ and on the ocean, where every activity layer has data.
// A lon/lat, not a pixel: the camera can settle at a different latitude than defaultState's, so
// a fixed pixel lands on a different place (and a different, unrecorded 4wings cell) per run.
const [OCEAN_LONGITUDE, OCEAN_LATITUDE] = GABU_REEFER_VIEWER_COORDS
const openOceanPopup = (
  jotaiStore: Parameters<typeof openMapPopupAt>[0]['jotaiStore'],
  router: Parameters<typeof openMapPopupAt>[0]['router']
) =>
  openMapPopupAt({
    jotaiStore,
    router,
    longitude: OCEAN_LONGITUDE,
    latitude: OCEAN_LATITUDE,
  })

type ExpectedInstance = { id: unknown; config?: Record<string, unknown>; [key: string]: unknown }

/**
 * A layer added from the library gets `${slug}__${Date.now()}`. The test clock moves (vitest.setup.ts),
 * so match the shape, not one timestamp.
 */
const generatedId = (slug: string) => expect.stringMatching(new RegExp(`^${slug}__\\d+$`))

/**
 * The URL holds every dataview instance, including ones the spec does not touch (basemap-labels
 * from defaultState). Assert only the instances the test changed, and only the fields it set.
 */
const withInstances = (...instances: ExpectedInstance[]) => ({
  dataviewInstances: expect.arrayContaining(
    instances.map(({ config, ...rest }) =>
      expect.objectContaining({
        ...rest,
        ...(config && { config: expect.objectContaining(config) }),
      })
    )
  ),
})

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
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()])
    const { getByTestId, getByText, jotaiStore, router } = await render({ store })
    const openLayerModalButton = getByTestId('activity-add-layer-button')
    const addLayerButton = getByTestId('add-layer-eez-button')

    await openLayerModalButton.click()

    await expect.element(getByText('Layer Library')).toBeVisible()

    await addLayerButton.click()

    await waitForLayersLoaded(jotaiStore)

    await openOceanPopup(jotaiStore, router)

    expect(store.getState().location.query).toMatchObject(
      withInstances({
        id: generatedId('eez'),
        category: 'context',
        dataviewId: 'eez',
        config: { color: '#069688' },
      })
    )
    await expect
      .element(getByTestId('map-popup-wrapper').getByRole('heading', { name: 'EEZs' }))
      .toBeVisible()
  })

  it('should add environment data layer', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()])
    const { getByTestId, getByText, jotaiStore, router } = await render({ store })
    const openLayerModalButton = getByTestId('activity-add-layer-button')
    const addLayerButton = getByTestId('add-layer-bathymetry-button')

    await openLayerModalButton.click()

    await expect.element(getByText('Layer Library')).toBeVisible()

    await addLayerButton.click()
    await waitForLayersLoaded(jotaiStore)
    await openOceanPopup(jotaiStore, router)

    expect(store.getState().location.query).toMatchObject(
      withInstances({
        id: generatedId('bathymetry'),
        category: 'environment',
        dataviewId: 'heatmap-static-layer',
        config: { color: 'bathymetry' },
      })
    )
    await expect
      .element(getByTestId('map-popup-wrapper').getByRole('heading', { name: 'Bathymetry' }))
      .toBeVisible()
  })

  it('should add events data layer', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()])
    const { getByTestId, getByText, jotaiStore } = await render({ store })
    const openLayerModalButton = getByTestId('activity-add-layer-button')
    const mapElement = getByTestId('app-main')
    const addLayerButton = getByTestId('add-layer-port-visits-button')

    await openLayerModalButton.click()

    await expect.element(getByText('Layer Library')).toBeVisible()

    await addLayerButton.click()

    await waitForLayersLoaded(jotaiStore)

    // Clusters are drawn where the events are; a fixed pixel lands between them
    const clusterPosition = await findLayerObjectPosition(jotaiStore, (id) =>
      id.startsWith('port-visits')
    )
    await userEvent.hover(mapElement, { position: clusterPosition })

    expect(store.getState().location.query).toMatchObject(
      withInstances({
        id: generatedId('port-visits'),
        category: 'events',
        dataviewId: CLUSTER_PORT_VISIT_EVENTS_DATAVIEW_SLUG,
        config: { color: '#9AEEFF' },
      })
    )

    await expect
      .element(getByTestId('map-popup-wrapper').getByText(/[\d,]+\s+Port visits/))
      .toBeVisible()
  })

  // TODO fix this, don't know why if randomly fails
  // it('should add detections data layer', async () => {
  //   const store = makeStore(defaultState)
  //   const jotaiStore = createJotaiStore()
  //   const { getByTestId, getByText } = await render({ store, jotaiStore })

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

  //   expect(store.getState().location.query).toMatchObject({
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
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()])
    const { getByTestId, getByText, jotaiStore, router } = await render({ store })
    const openLayerModalButton = getByTestId('activity-add-layer-button')
    const addLayerButton = getByTestId('add-layer-presence-button')

    await clickLayerAction(getByTestId, {
      row: 'activity-layer-panel-switch-presence',
      action: 'activity-layer-panel-remove-presence',
    })
    await openLayerModalButton.click()

    await expect.element(getByText('Layer Library')).toBeVisible()

    await addLayerButton.click()

    await waitForLayersLoaded(jotaiStore)

    await openOceanPopup(jotaiStore, router)

    expect(store.getState().location.query).toMatchObject({
      ...withInstances(
        {
          id: generatedId('presence'),
          category: 'activity',
          dataviewId: PRESENCE_DATAVIEW_SLUG,
          config: { color: '#FF64CE' },
        },
        { id: 'presence', deleted: true }
      ),
      zoom: 1.49,
    })

    await expect
      .element(getByTestId('map-popup-wrapper').getByText('Vessel presence'))
      .toBeVisible()

    await expect
      .element(
        getByTestId('map-popup-wrapper')
          .getByText(/[\d.,]+\s+hours?/)
          .first()
      )
      .toBeVisible()
  })

  it('should preserve other layers when removing layer', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()])
    const { getByTestId, jotaiStore, router } = await render({ store })
    const vesselPresenceSwitch = getByTestId('activity-layer-panel-switch-presence')

    await userEvent.click(vesselPresenceSwitch)
    await clickLayerAction(getByTestId, {
      row: 'activity-layer-panel-switch-ais',
      action: 'activity-layer-panel-remove-ais',
    })
    await clickLayerAction(getByTestId, {
      row: 'activity-layer-panel-switch-vms',
      action: 'activity-layer-panel-remove-vms',
    })

    await waitForLayersLoaded(jotaiStore)

    await openOceanPopup(jotaiStore, router)

    expect(store.getState().location.query).toMatchObject(
      withInstances(
        { id: 'presence', config: { visible: true } },
        { id: 'ais', deleted: true },
        { id: 'vms', deleted: true }
      )
    )

    await expect
      .element(getByTestId('map-popup-wrapper').getByRole('heading', { name: 'Vessel presence' }))
      .toBeVisible()

    const valueElement = getByTestId('map-popup-wrapper').getByTestId('activity-tooltip-row-value')
    await expect.element(valueElement).toBeVisible()
    await expect.element(valueElement).toMatchTextContent(/[\d.,]+\s+hours?/)
  })
})
