/* eslint-disable @typescript-eslint/consistent-type-imports */
import type { ActionType,StateType } from 'typesafe-actions'

export type AppActions = ActionType<typeof import('../redux-modules/actions').default>
export type AppState = StateType<typeof import('../store').rootReducer>

declare module 'typesafe-actions' {
  export type Store = StateType<typeof import('../store').default>

  export type RootState = AppState

  export type RootAction = AppActions

  interface Types {
    RootAction: AppActions
  }
}
