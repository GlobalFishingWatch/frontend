import type { Middleware } from '@reduxjs/toolkit'

import type { RootState } from 'store'

type ActionMatcher = {
  type: string
  payload?: any
  meta?: any
  query?: any
}

export class TestingStoreMiddleware {
  private dispatchedActions: ActionMatcher[] = []
  private actionListeners: ((action: ActionMatcher, state: RootState) => void)[] = []
  private filterMiddlewareRegistered: boolean = true

  setFilterMiddlewareRegistered(filter: boolean) {
    this.filterMiddlewareRegistered = filter
  }

  clear() {
    this.dispatchedActions = []
    this.actionListeners = []
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

  getLastActionByType(type: string) {
    const actions = this.filterMiddlewareRegistered
      ? this.dispatchedActions.filter((action) => !action.type.includes('middlewareRegistered'))
      : this.dispatchedActions
    const filteredActions = actions.filter((action) => action.type === type)
    return filteredActions[filteredActions.length - 1]
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

      this.actionListeners.push(listener)
    })
  }

  private removeActionListener(listener: (action: ActionMatcher, state: RootState) => void) {
    const index = this.actionListeners.indexOf(listener)
    if (index > -1) {
      this.actionListeners.splice(index, 1)
    }
  }

  createMiddleware(): Middleware<object, RootState> {
    return (store) => (next) => (action: unknown) => {
      const result = next(action)

      this.dispatchedActions.push(action as ActionMatcher)

      const state = store.getState()

      this.actionListeners.forEach((listener) => {
        try {
          listener(action as ActionMatcher, state)
        } catch (error) {
          console.error('Error in action listener:', error)
        }
      })

      return result
    }
  }
}

export const createTestingMiddleware = () => {
  return new TestingStoreMiddleware()
}
