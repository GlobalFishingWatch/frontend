import React from 'react'
import { render } from 'test/appTestUtils'
import { defaultState } from 'test/defaultState'
import { createTestingMiddleware } from 'test/testingStoreMiddeware'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import App from 'features/app/App'
import { makeStore } from 'store'

describe('Fishing Map App', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should reflex store changes on layer toggle', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const { getByTestId, getByText } = await render(<App />, { store })

    await expect.element(getByText(/common.activity/)).toBeInTheDocument()

    const button = getByTestId('map-control-visibility-toggle').first()

    await button.click()

    const actions = testingMiddleware.getActions()

    const toggleAction = actions.findLast((action) => action.type === 'HOME')

    expect(toggleAction).toBeDefined()
    expect(toggleAction?.query.dataviewInstances).toMatchObject([
      {
        config: {
          visible: false,
        },
        id: 'ais',
      },
    ])
  })

  it('should preserve map previous state on layer toggle', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const { getByTestId, getByText } = await render(<App />, { store })

    await expect.element(getByText(/common.activity/)).toBeInTheDocument()
    expect(store.getState().map.loaded).toBe(true)

    await getByTestId('map-control-zoom-in').click()

    // Wait for debounced viewport updates to complete (debounced by 1000ms)
    await new Promise((resolve) => setTimeout(resolve, 1100))

    await getByTestId('map-control-visibility-toggle').first().click()
    const actions = testingMiddleware.getActions()
    const toggleAction = actions.findLast((action) => action.type === 'HOME')

    expect(toggleAction).toBeDefined()
    expect(toggleAction?.query).toMatchObject({
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
    })
  })
})
