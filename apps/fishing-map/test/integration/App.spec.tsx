import { render } from 'test/appTestUtils'
import { createTestingMiddleware, defaultState } from 'test/utils/store'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { makeStore } from 'store'

describe('Fishing Map App', () => {
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
      (action) => action.type === 'location/setLocation' && action.payload?.type === 'HOME'
    )

    const expectedResult = [
      {
        config: {
          visible: false,
        },
        id: 'ais',
      },
    ]
    expect(toggleAction).toBeDefined()
    expect(toggleAction?.payload?.query?.dataviewInstances).toMatchObject(expectedResult)
    expect(store.getState()?.location?.query?.dataviewInstances).toMatchObject(expectedResult)
  })

  it('should preserve map previous state on layer toggle', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()])
    const { getByTestId } = await render({ store })

    await getByTestId('map-control-zoom-in').click()

    await new Promise((resolve) => setTimeout(resolve, 1100))

    await getByTestId('activity-layer-panel-switch-ais').click()
    const actions = testingMiddleware.getActions()
    const toggleAction = actions.findLast(
      (action) => action.type === 'location/setLocation' && action.payload?.type === 'HOME'
    )

    const expectedResult = {
      dataviewInstances: [
        {
          config: {
            visible: false,
          },
          id: 'ais',
        },
      ],
      latitude: 19,
      longitude: 26,
      zoom: 2.49,
    }
    expect(toggleAction?.payload?.query).toMatchObject(expectedResult)
    expect(store.getState().location.query).toMatchObject(expectedResult)
  })
})
