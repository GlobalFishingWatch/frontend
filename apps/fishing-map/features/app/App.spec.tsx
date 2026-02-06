import React from 'react'
import { render } from 'test/appTestUtils'
import { defaultState } from 'test/defaultState'
import { createTestingMiddleware } from 'test/testingStoreMiddeware'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import App from 'features/app/App'
import { makeStore } from 'store'

describe('Fishing Map App', () => {
  let testingMiddleware: ReturnType<typeof createTestingMiddleware>
  let store: ReturnType<typeof makeStore>

  beforeEach(() => {
    // Create a new testing middleware instance for each test
    testingMiddleware = createTestingMiddleware()

    // Create store with the testing middleware
    store = makeStore(defaultState, [testingMiddleware.createMiddleware()])
    vi.clearAllMocks()
  })

  afterEach(() => {
    testingMiddleware.clear()
  })

  it('should reflex store changes on layer toggle', async () => {
    const { getByTestId, getByText } = await render(<App />, { store })

    await expect.element(getByText(/common.activity/)).toBeInTheDocument()

    const button = getByTestId('map-control-visibility-toggle').first()

    await button.click()

    const actions = testingMiddleware.getActions()

    const toggleAction = actions.findLast((action) => action.type === 'HOME')

    expect(toggleAction).toBeDefined()
    expect(toggleAction?.query).toStrictEqual({
      bivariateDataviews: null,
      dataviewInstances: [
        {
          config: {
            visible: false,
          },
          id: 'ais',
        },
      ],
    })
  })
})
