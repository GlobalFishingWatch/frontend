import type { AppStore } from 'store'

export type AppRouterContext = {
  store?: AppStore
}

export function getAppRouterStore(context?: AppRouterContext) {
  return context?.store
}
