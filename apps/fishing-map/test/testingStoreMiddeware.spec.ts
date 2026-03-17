import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import type { RootState } from 'store'
import { makeStore } from 'store'

import { createTestingMiddleware } from './testingStoreMiddeware'

describe('TestingStoreMiddleware Example Usage', () => {
  let testingMiddleware: ReturnType<typeof createTestingMiddleware>
  let store: ReturnType<typeof makeStore>

  beforeEach(() => {
    // Create a new testing middleware instance for each test
    testingMiddleware = createTestingMiddleware()

    // Create store with the testing middleware
    store = makeStore({} as RootState, [testingMiddleware.createMiddleware()])
  })

  afterEach(() => {
    testingMiddleware.clear()
  })

  it('should track dispatched actions', () => {
    // Dispatch some actions
    store.dispatch({ type: 'TEST_ACTION_1', payload: { value: 123 } })
    store.dispatch({ type: 'TEST_ACTION_2', payload: { value: 456 } })

    // Assert actions were dispatched
    const actions = testingMiddleware.getActions()
    // Note, some routing actions are dispatched before the test actions, so we check the last two actions
    expect(actions[actions.length - 2].type).toBe('TEST_ACTION_1')
    expect(actions[actions.length - 1].type).toBe('TEST_ACTION_2')
  })

  it('should filter actions by type', () => {
    store.dispatch({ type: 'ACTION_A' })
    store.dispatch({ type: 'ACTION_B' })
    store.dispatch({ type: 'ACTION_A' })

    const actionAList = testingMiddleware.getActionsByType('ACTION_A')
    expect(actionAList).toHaveLength(2)
  })

  it('should check if action was dispatched', () => {
    store.dispatch({ type: 'MY_ACTION' })

    expect(testingMiddleware.wasActionDispatched('MY_ACTION')).toBe(true)
    expect(testingMiddleware.wasActionDispatched('OTHER_ACTION')).toBe(false)
  })

  it('should wait for async actions', async () => {
    // Simulate async dispatch
    setTimeout(() => {
      store.dispatch({ type: 'ASYNC_ACTION', payload: { data: 'loaded' } })
    }, 100)

    // Wait for the action
    const action = await testingMiddleware.waitForAction('ASYNC_ACTION')
    expect(action.type).toBe('ASYNC_ACTION')
    expect(action.payload?.data).toBe('loaded')
  })

  it('should throw if expected action is not dispatched within timeout', async () => {
    await expect(testingMiddleware.waitForAction('NEVER_DISPATCHED', 100)).rejects.toThrow(
      'Action NEVER_DISPATCHED was not dispatched within 100ms'
    )
  })

  it('should validate expected actions', () => {
    // Set expectations
    testingMiddleware.expectAction('REQUIRED_ACTION_1')
    testingMiddleware.expectAction({
      type: 'REQUIRED_ACTION_2',
      payload: { value: 42 },
    })

    // Dispatch actions
    store.dispatch({ type: 'REQUIRED_ACTION_1' })
    store.dispatch({ type: 'REQUIRED_ACTION_2', payload: { value: 42 } })

    // This should not throw
    expect(() => testingMiddleware.assertExpectedActions()).not.toThrow()
  })

  it('should throw if expected actions are missing', () => {
    testingMiddleware.expectAction('MISSING_ACTION')

    expect(() => testingMiddleware.assertExpectedActions()).toThrow(
      'Expected actions were not dispatched: MISSING_ACTION'
    )
  })

  it('should validate state after action', () => {
    // Expect action with state validation
    testingMiddleware.expectAction('SET_VALUE', {
      matcher: () => {
        // Add your state validation logic here
        // For example: return state.someSlice.value === 42
        return true // placeholder
      },
      description: 'Value should be 42',
    })

    store.dispatch({ type: 'SET_VALUE', payload: 42 })
  })

  it('should use action listeners', () => {
    const actionLog: any[] = []

    // Add listener
    testingMiddleware.addActionListener((action) => {
      actionLog.push({
        action: action.type,
        timestamp: Date.now(),
      })
    })

    store.dispatch({ type: 'ACTION_1' })
    store.dispatch({ type: 'ACTION_2' })

    expect(actionLog).toHaveLength(2)
    expect(actionLog[0].action).toBe('ACTION_1')
    expect(actionLog[1].action).toBe('ACTION_2')
  })

  it('should validate state with custom assertions', () => {
    let assertionCalled = false

    testingMiddleware.addStateAssertion({
      matcher: () => {
        assertionCalled = true
        // Add your state validation logic
        return true
      },
      description: 'Custom state validation',
    })

    store.dispatch({ type: 'ANY_ACTION' })

    expect(assertionCalled).toBe(true)
  })

  it('should track action payload and meta', () => {
    const action = {
      type: 'testing/COMPLEX_ACTION',
      payload: { id: 1, name: 'test' },
      meta: { timestamp: Date.now() },
    }

    store.dispatch(action)

    const actions = testingMiddleware.getActions()
    const trackedAction = actions.find((a) => a.type === 'testing/COMPLEX_ACTION')

    expect(trackedAction).toBeDefined()
    expect(trackedAction?.payload).toEqual(action.payload)
    expect(trackedAction?.meta).toEqual(action.meta)
  })
})
