import React from 'react'
import { render } from 'test/appTestUtils'
import { createTestingMiddleware } from 'test/testingStoreMiddeware'
import { defaultState } from 'test/utils/store/redux-store-test'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import App from 'features/app/App'
import { makeStore } from 'store'

describe('Fishing Map App', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should reflect store changes on layer toggle', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const { getByTestId } = await render(<App />, { store })

    const button = getByTestId('activity-layer-panel-switch-ais')

    await button.click()

    const actions = testingMiddleware.getActions()

    const toggleAction = actions.findLast((action) => action.type === 'HOME')

    const expectedResult = [
      {
        config: {
          visible: false,
        },
        id: 'ais',
      },
    ]
    expect(toggleAction).toBeDefined()
    expect(toggleAction?.query.dataviewInstances).toMatchObject(expectedResult)
    expect(store.getState()?.location?.query?.dataviewInstances).toMatchObject(expectedResult)
  })

  it('should preserve map previous state on layer toggle', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const { getByTestId } = await render(<App />, { store })

    await getByTestId('map-control-zoom-in').click()

    await new Promise((resolve) => setTimeout(resolve, 1100))

    await getByTestId('activity-layer-panel-switch-ais').click()
    const actions = testingMiddleware.getActions()
    const toggleAction = actions.findLast((action) => action.type === 'HOME')

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
    expect(toggleAction?.query).toMatchObject(expectedResult)
    expect(store.getState().location.query).toMatchObject(expectedResult)
  })
})
