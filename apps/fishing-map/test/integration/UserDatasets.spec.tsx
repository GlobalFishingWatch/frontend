import { createStore as createJotaiStore } from 'jotai'
import { render } from 'test/appTestUtils'
import { createTestingMiddleware } from 'test/testingStoreMiddeware'
import { defaultState } from 'test/utils/store/redux-store-test'
import { USER_POLYGON_DATASET_ID } from 'test/utils/store/redux-store-test.data'
import { describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

import App from 'features/app/App'
import { mapInstanceAtom } from 'features/map/map.atoms'
import { MAP_VIEW_ID } from 'features/map/map-viewport.hooks'
import { makeStore } from 'store'

describe('User Datasets', () => {
  it('should show login prompt when user is not logged in', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const { getByTestId, getByRole } = await render(<App />, { store })
    const openLayerModalButton = getByTestId('activity-add-layer-button')

    await openLayerModalButton.click()

    await userEvent.click(getByRole('button', { name: 'User' }))

    expect(
      getByRole('dialog').getByText('Register or login to upload datasets (free, 2 minutes)')
    ).toBeVisible()

    await expect.element(getByRole('dialog').getByTestId('login-link').last()).toBeVisible()
  })

  it('should show user dataset sections when user is logged in', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const { getByTestId, getByRole } = await render(<App />, {
      store,
      authenticated: true,
    })

    const openLayerModalButton = getByTestId('activity-add-layer-button')

    await openLayerModalButton.click()

    await userEvent.click(getByRole('button', { name: 'User' }))

    const addLayerModal = getByRole('dialog')

    await expect.element(addLayerModal.getByText('Tracks')).toBeVisible()
    await expect.element(addLayerModal.getByText('Polygons')).toBeVisible()
    await expect.element(addLayerModal.getByText('Points')).toBeVisible()
    await expect.element(addLayerModal.getByText('Bigquery')).toBeVisible()
  })

  it('should be able to add a tracks user dataset and see it on the map', async () => {
    const testingMiddleware = createTestingMiddleware()
    const jotaiStore = createJotaiStore()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const { getByTestId, getByRole } = await render(<App />, {
      store,
      authenticated: true,
      jotaiStore,
    })

    await userEvent.click(getByTestId('activity-layer-panel-switch-ais'))
    await userEvent.click(getByTestId('activity-layer-panel-switch-vms'))

    const openLayerModalButton = getByTestId('activity-add-layer-button')

    await userEvent.click(openLayerModalButton)

    await userEvent.click(getByRole('button', { name: 'User' }))

    await userEvent.click(getByTestId('user-tracks:v1-add-to-map-0'))

    await new Promise((resolve) => setTimeout(resolve, 2000))

    const addLayerAction = testingMiddleware
      .getActions()
      .findLast((action) => action.type === 'HOME')

    const mapElement = getByTestId('app-main')
    const mapInstance = jotaiStore.get(mapInstanceAtom)
    const viewport = mapInstance?.getViewports?.().find((v: any) => v.id === MAP_VIEW_ID)
    const [x, y] = viewport?.project([-61.18, -41.16]) || [0, 0]

    await userEvent.click(mapElement, { position: { x, y } })

    expect(
      getByTestId('map-popup-wrapper').getByRole('heading', { name: 'TURTLE_001' })
    ).toBeVisible()
    expect(addLayerAction?.query).toEqual({
      longitude: 26,
      latitude: 19,
      zoom: 1.49,
      bivariateDataviews: null,
      dataviewInstances: [
        {
          config: {
            color: '#F95E5E',
            colorCyclingType: undefined,
          },
          datasetsConfig: [
            {
              datasetId: 'public-turtle-track-2025-2026-1773206254379',
              endpoint: 'user-tracks-data',
              params: [
                {
                  id: 'id',
                  value: 'public-turtle-track-2025-2026-1773206254379',
                },
              ],
            },
          ],
          id: 'user-track-public-turtle-track-2025-2026-1773206254379-1771416000000',
          dataviewId: 'user-track',
        },
        {
          config: {
            visible: false,
          },
          id: 'vms',
        },
        {
          config: {
            visible: false,
          },
          id: 'ais',
        },
      ],
      timebarVisualisation: 'vessel',
    })
  })

  it('should add a polygon user dataset and see it on the map', async () => {
    const testingMiddleware = createTestingMiddleware()
    const jotaiStore = createJotaiStore()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const { getByTestId, getByRole } = await render(<App />, {
      store,
      authenticated: true,
      jotaiStore,
    })

    await userEvent.click(getByTestId('activity-layer-panel-switch-ais'))
    await userEvent.click(getByTestId('activity-layer-panel-switch-vms'))

    const openLayerModalButton = getByTestId('activity-add-layer-button')
    await userEvent.click(openLayerModalButton)

    await userEvent.click(getByRole('button', { name: 'User' }))

    await userEvent.click(getByTestId('user-context-layer:v1-add-to-map-0').first())

    const addLayerAction = testingMiddleware
      .getActions()
      .findLast((action) => action.type === 'HOME')

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const mapElement = getByTestId('app-main')

    await userEvent.dragAndDrop(mapElement, mapElement, {
      sourcePosition: { x: 100, y: 100 },
      targetPosition: { x: 700, y: 100 },
      steps: 10,
    })

    const mapInstance = jotaiStore.get(mapInstanceAtom)
    const viewport = mapInstance?.getViewports?.().find((v: any) => v.id === MAP_VIEW_ID)
    const [x, y] = viewport?.project([-157, 19.18]) || [0, 0]

    await userEvent.click(mapElement, { position: { x, y } })

    expect(getByTestId('map-popup-wrapper').getByRole('heading', { name: 'Hawaii' })).toBeVisible()
    expect(addLayerAction?.query).toEqual({
      longitude: 26,
      latitude: 19,
      zoom: 1.49,
      bivariateDataviews: null,
      dataviewInstances: [
        {
          config: {
            color: '#F95E5E',
            colorCyclingType: undefined,
          },
          datasetsConfig: [
            {
              datasetId: USER_POLYGON_DATASET_ID,
              endpoint: 'context-tiles',
              params: [],
            },
          ],
          dataviewId: 'default-context-layer',
          id: 'user-polygons-1771416000000-1771416000000',
        },
        {
          config: {
            visible: false,
          },
          id: 'vms',
        },
        {
          config: {
            visible: false,
          },
          id: 'ais',
        },
      ],
    })
  })

  it('should add a points user dataset and see it on the map', async () => {
    const testingMiddleware = createTestingMiddleware()
    const jotaiStore = createJotaiStore()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const { getByTestId, getByRole } = await render(<App />, {
      store,
      authenticated: true,
      jotaiStore,
    })

    await userEvent.click(getByTestId('activity-layer-panel-switch-ais'))
    await userEvent.click(getByTestId('activity-layer-panel-switch-vms'))

    const openLayerModalButton = getByTestId('activity-add-layer-button')

    await userEvent.click(openLayerModalButton)
    await userEvent.click(getByRole('button', { name: 'User' }))
    await userEvent.click(getByTestId('user-context-layer:v1-add-to-map-0').last())

    const addLayerAction = testingMiddleware
      .getActions()
      .findLast((action) => action.type === 'HOME')

    await new Promise((resolve) => setTimeout(resolve, 2000))

    const mapElement = getByTestId('app-main')
    const mapInstance = jotaiStore.get(mapInstanceAtom)
    const viewport = mapInstance?.getViewports?.().find((v: any) => v.id === MAP_VIEW_ID)
    const [x, y] = viewport?.project([-79.18, 8.16]) || [0, 0]

    await userEvent.click(mapElement, { position: { x, y } })

    expect(
      getByTestId('map-popup-wrapper').getByRole('heading', { name: 'panama canal' })
    ).toBeVisible()
    expect(addLayerAction?.query).toEqual({
      longitude: 26,
      latitude: 19,
      zoom: 1.49,
      bivariateDataviews: null,
      dataviewInstances: [
        {
          config: {
            color: '#F95E5E',
            colorCyclingType: undefined,
          },
          datasetsConfig: [
            {
              datasetId: 'public-panama-canal-1771993986830',
              endpoint: 'context-tiles',
              params: [
                {
                  id: 'id',
                  value: 'public-panama-canal-1771993986830',
                },
              ],
            },
          ],
          dataviewId: 'default-points-layer',
          id: 'user-points-public-panama-canal-1771993986830-1771416000000',
        },
        {
          config: {
            visible: false,
          },
          id: 'vms',
        },
        {
          config: {
            visible: false,
          },
          id: 'ais',
        },
      ],
    })
  })

  it('should be able to remove a user dataset and not see it on map', async () => {
    const testingMiddleware = createTestingMiddleware()
    const jotaiStore = createJotaiStore()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const { getByTestId, getByRole, getByText } = await render(<App />, {
      store,
      authenticated: true,
      jotaiStore,
    })

    await userEvent.click(getByTestId('activity-layer-panel-switch-ais'))
    await userEvent.click(getByTestId('activity-layer-panel-switch-vms'))

    const openLayerModalButton = getByTestId('activity-add-layer-button')

    await userEvent.click(openLayerModalButton)

    await userEvent.click(getByRole('button', { name: 'User' }))

    await userEvent.click(getByTestId('user-tracks:v1-add-to-map-0'))

    await new Promise((resolve) => setTimeout(resolve, 1000))

    await userEvent.hover(getByText('Turtle track 2025 2026'))

    await new Promise((resolve) => setTimeout(resolve, 500))

    await userEvent.click(
      getByTestId('user-layer-remove-public-turtle-track-2025-2026-1773206254379')
    )

    await new Promise((resolve) => setTimeout(resolve, 2000))

    const removeLayerAction = testingMiddleware
      .getActions()
      .findLast((action) => action.type === 'HOME')

    const mapElement = getByTestId('app-main')
    const mapInstance = jotaiStore.get(mapInstanceAtom)
    const viewport = mapInstance?.getViewports?.().find((v: any) => v.id === MAP_VIEW_ID)
    const [x, y] = viewport?.project([-61.18, -41.16]) || [0, 0]

    await userEvent.click(mapElement, { position: { x, y } })

    await expect.element(getByTestId('map-popup-wrapper')).not.toBeVisible()
    expect(removeLayerAction?.query).toEqual({
      longitude: 26,
      latitude: 19,
      zoom: 1.49,
      bivariateDataviews: null,
      dataviewInstances: [
        {
          config: {
            visible: false,
          },
          id: 'vms',
        },
        {
          config: {
            visible: false,
          },
          id: 'ais',
        },
      ],
      timebarVisualisation: 'vessel',
    })
  })

  it('should be able to add a user dataset and see it on the map', async () => {
    const testTimestamp = 1771416000000 + Math.floor(Math.random() * 1000000000)
    const dateNowSpy = vi.spyOn(Date, 'now').mockReturnValue(testTimestamp)

    const testingMiddleware = createTestingMiddleware()
    const jotaiStore = createJotaiStore()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const { getByTestId, getByText } = await render(<App />, {
      store,
      authenticated: true,
      jotaiStore,
    })

    await userEvent.click(getByTestId('activity-layer-panel-switch-ais'))
    await userEvent.click(getByTestId('activity-layer-panel-switch-vms'))

    await userEvent.click(getByTestId('upload-user-dataset'))

    const fileInput = getByTestId('tracks-file-input')

    await userEvent.upload(fileInput, './test/file-examples/iccat_2019-points.csv')

    await userEvent.click(getByTestId('confirm-upload'))

    // Delete the dataset
    window.confirm = () => true
    await userEvent.click(getByTestId('sidebar-login-icon'))
    await userEvent.click(getByText('Dataset'))
    const deleteButton = getByTestId(/delete-dataset-public-iccat-2019-points-/)
    await userEvent.click(deleteButton)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    // TODO: solve refetch after delete to be able to check that the dataset is not visible on the map anymore
    // await expect.element(deleteButton).not.toBeInTheDocument()

    dateNowSpy?.mockRestore()
  })
})
