import type { Middleware } from '@reduxjs/toolkit'

import type { RootState } from 'store'

type ActionMatcher = {
  type: string
  payload?: any
  meta?: any
  query?: any
}

type StateAssertion = {
  matcher: (state: RootState) => boolean
  description?: string
}

type ActionAssertion = {
  action: string | ActionMatcher
  stateAfter?: StateAssertion
}

export class TestingStoreMiddleware {
  private dispatchedActions: ActionMatcher[] = []
  private expectedActions: ActionAssertion[] = []
  private actionListeners: ((action: ActionMatcher, state: RootState) => void)[] = []
  private stateAssertions: StateAssertion[] = []
  private filterMiddlewareRegistered: boolean = true

  setFilterMiddlewareRegistered(filter: boolean) {
    this.filterMiddlewareRegistered = filter
  }

  clear() {
    this.dispatchedActions = []
    this.expectedActions = []
    this.actionListeners = []
    this.stateAssertions = []
  }

  getActions() {
    const actions = [...this.dispatchedActions]
    return this.filterMiddlewareRegistered
      ? actions.filter((action) => !action.type.includes('middlewareRegistered'))
      : actions
  }

  getActionsByType(type: string) {
    const actions = this.filterMiddlewareRegistered
      ? this.dispatchedActions.filter((action) => !action.type.includes('middlewareRegistered'))
      : this.dispatchedActions
    return actions.filter((action) => action.type === type)
  }

  expectAction(action: string | ActionMatcher, stateAfter?: StateAssertion) {
    this.expectedActions.push({ action, stateAfter })
  }

  addActionListener(listener: (action: ActionMatcher, state: RootState) => void) {
    this.actionListeners.push(listener)
  }

  addStateAssertion(assertion: StateAssertion) {
    this.stateAssertions.push(assertion)
  }

  wasActionDispatched(type: string): boolean {
    return this.dispatchedActions.some((action) => action.type === type)
  }

  waitForAction(type: string, timeout = 5000): Promise<ActionMatcher> {
    let listener: (action: ActionMatcher, state: RootState) => void

    return new Promise((resolve, reject) => {
      const existingAction = this.dispatchedActions.find((action) => action.type === type)
      if (existingAction) {
        resolve(existingAction)
        return
      }

      const timeoutId = setTimeout(() => {
        if (!listener) return
        this.removeActionListener(listener)
        reject(new Error(`Action ${type} was not dispatched within ${timeout}ms`))
      }, timeout)

      listener = (action: ActionMatcher) => {
        if (action.type === type) {
          clearTimeout(timeoutId)
          this.removeActionListener(listener)
          resolve(action)
        }
      }

      this.addActionListener(listener)
    })
  }

  private removeActionListener(listener: (action: ActionMatcher, state: RootState) => void) {
    const index = this.actionListeners.indexOf(listener)
    if (index > -1) {
      this.actionListeners.splice(index, 1)
    }
  }

  assertExpectedActions() {
    const notDispatched = this.expectedActions.filter((expected) => {
      const actionType =
        typeof expected.action === 'string' ? expected.action : expected.action.type
      return !this.dispatchedActions.some((action) => {
        if (action.type !== actionType) return false

        if (typeof expected.action === 'object') {
          const matcher = expected.action as ActionMatcher
          if (matcher.payload !== undefined) {
            const payloadMatches =
              JSON.stringify(action.payload) === JSON.stringify(matcher.payload)
            if (!payloadMatches) return false
          }
          if (matcher.meta !== undefined) {
            const metaMatches = JSON.stringify(action.meta) === JSON.stringify(matcher.meta)
            if (!metaMatches) return false
          }
        }

        return true
      })
    })

    if (notDispatched.length > 0) {
      const actionTypes = notDispatched
        .map((a) => (typeof a.action === 'string' ? a.action : a.action.type))
        .join(', ')
      throw new Error(`Expected actions were not dispatched: ${actionTypes}`)
    }
  }

  createMiddleware(): Middleware<object, RootState> {
    return (store) => (next) => (action: unknown) => {
      // Call next first to update the state
      const result = next(action)

      // Track the action
      this.dispatchedActions.push(action as ActionMatcher)

      // Get the state after the action
      const state = store.getState()

      // Call all action listeners
      this.actionListeners.forEach((listener) => {
        try {
          listener(action as ActionMatcher, state)
        } catch (error) {
          console.error('Error in action listener:', error)
        }
      })

      // Check expected actions with state assertions
      const expectedAction = this.expectedActions.find((expected) => {
        const actionType =
          typeof expected.action === 'string' ? expected.action : expected.action.type
        return (action as ActionMatcher).type === actionType
      })

      if (expectedAction?.stateAfter) {
        const { matcher, description } = expectedAction.stateAfter
        if (!matcher(state)) {
          throw new Error(
            `State assertion failed after action ${(action as ActionMatcher).type}${description ? `: ${description}` : ''}`
          )
        }
      }

      // Check state assertions
      this.stateAssertions.forEach((assertion) => {
        if (!assertion.matcher(state)) {
          throw new Error(
            `State assertion failed${assertion.description ? `: ${assertion.description}` : ''}`
          )
        }
      })

      return result
    }
  }
}

export const createTestingMiddleware = () => {
  return new TestingStoreMiddleware()
}
