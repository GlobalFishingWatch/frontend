import { render } from 'test/appTestUtils'
import { waitForMapViewport } from 'test/utils/map'
import { createTestingMiddleware, defaultState } from 'test/utils/store'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { makeStore } from 'store'

const AIS_HIDDEN_INSTANCE = expect.objectContaining({
  id: 'ais',
  config: expect.objectContaining({ visible: false }),
})

describe('Platform App', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should reflect store changes on layer toggle', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()])
    const { getByTestId } = await render({ store })

    const button = getByTestId('activity-layer-panel-switch-ais')

    await button.click()

    const actions = testingMiddleware.getActions()

    const toggleAction = actions.findLast(
      (action) => action.type === 'location/setLocation' && action.payload?.type === 'MAP'
    )

    const expectedResult = expect.arrayContaining([AIS_HIDDEN_INSTANCE])
    expect(toggleAction).toBeDefined()
    expect(toggleAction?.payload?.query?.dataviewInstances).toEqual(expectedResult)
    expect(store.getState()?.location?.query?.dataviewInstances).toEqual(expectedResult)
  })

  it('should preserve map previous state on layer toggle', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()])
    const { getByTestId, jotaiStore } = await render({ store })

    await waitForMapViewport(jotaiStore)
    await getByTestId('map-control-zoom-in').click()

    await expect.poll(() => store.getState().location.query.zoom, { timeout: 5000 }).toBe(2.49)

    const { latitude, longitude } = store.getState().location.query

    await getByTestId('activity-layer-panel-switch-ais').click()
    const actions = testingMiddleware.getActions()
    const toggleAction = actions.findLast(
      (action) => action.type === 'location/setLocation' && action.payload?.type === 'MAP'
    )

    const expectedResult = {
      dataviewInstances: expect.arrayContaining([AIS_HIDDEN_INSTANCE]),
      latitude,
      longitude,
      zoom: 2.49,
    }
    expect(toggleAction?.payload?.query).toMatchObject(expectedResult)
    expect(store.getState().location.query).toMatchObject(expectedResult)
  })
})
