import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import type { RootState } from 'store'
import { makeStore } from 'store'

import { createTestingMiddleware } from './testing-store-middleware'

describe('TestingStoreMiddleware', () => {
  let testingMiddleware: ReturnType<typeof createTestingMiddleware>
  let store: ReturnType<typeof makeStore>

  beforeEach(() => {
    testingMiddleware = createTestingMiddleware()
    store = makeStore({} as RootState, [testingMiddleware.createMiddleware()])
  })

  afterEach(() => {
    testingMiddleware.clear()
  })

  it('should track dispatched actions', () => {
    store.dispatch({ type: 'TEST_ACTION_1', payload: { value: 123 } })
    store.dispatch({ type: 'TEST_ACTION_2', payload: { value: 456 } })

    const actions = testingMiddleware.getActions()
    expect(actions[actions.length - 2].type).toBe('TEST_ACTION_1')
    expect(actions[actions.length - 1].type).toBe('TEST_ACTION_2')
  })

  it('should filter actions by type', () => {
    store.dispatch({ type: 'ACTION_A' })
    store.dispatch({ type: 'ACTION_B' })
    store.dispatch({ type: 'ACTION_A' })

    expect(testingMiddleware.getActionsByType('ACTION_A')).toHaveLength(2)
  })

  it('should return the last action of a given type', () => {
    store.dispatch({ type: 'location/setLocation', payload: { query: { zoom: 1 } } })
    store.dispatch({ type: 'location/setLocation', payload: { query: { zoom: 2 } } })

    expect(
      testingMiddleware.getLastActionByType('location/setLocation')?.payload?.query?.zoom
    ).toBe(2)
  })

  it('should check if action was dispatched', () => {
    store.dispatch({ type: 'MY_ACTION' })

    expect(testingMiddleware.wasActionDispatched('MY_ACTION')).toBe(true)
    expect(testingMiddleware.wasActionDispatched('OTHER_ACTION')).toBe(false)
  })

  it('should wait for async actions', async () => {
    setTimeout(() => {
      store.dispatch({ type: 'ASYNC_ACTION', payload: { data: 'loaded' } })
    }, 100)

    const action = await testingMiddleware.waitForAction('ASYNC_ACTION')
    expect(action.type).toBe('ASYNC_ACTION')
    expect(action.payload?.data).toBe('loaded')
  })

  it('should throw if expected action is not dispatched within timeout', async () => {
    await expect(testingMiddleware.waitForAction('NEVER_DISPATCHED', 100)).rejects.toThrow(
      'Action NEVER_DISPATCHED was not dispatched within 100ms'
    )
  })

  it('should track action payload and meta', () => {
    const action = {
      type: 'testing/COMPLEX_ACTION',
      payload: { id: 1, name: 'test' },
      meta: { timestamp: Date.now() },
    }

    store.dispatch(action)

    const trackedAction = testingMiddleware
      .getActions()
      .find((a) => a.type === 'testing/COMPLEX_ACTION')

    expect(trackedAction).toBeDefined()
    expect(trackedAction?.payload).toEqual(action.payload)
    expect(trackedAction?.meta).toEqual(action.meta)
  })
})
