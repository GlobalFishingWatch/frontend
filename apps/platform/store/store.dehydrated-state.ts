import type { AppStore, RootState } from 'store'
import { getIsBrowser } from 'utils/dom'

/**
 * Currently used by the vessel profile SSR loader to prerender the vessel identity.
 *
 * `location` and `user` are intentionally excluded: they are already populated in client-side
 */
export const SSR_DEHYDRATED_SLICES = ['vessel', 'dataviews', 'datasets'] as const

type DehydratedReduxState = Partial<Pick<RootState, (typeof SSR_DEHYDRATED_SLICES)[number]>>

type DehydratedRouterData = { reduxState?: unknown }

type TanStackBootstrapWindow = Window &
  typeof globalThis & {
    $_TSR?: { router?: { dehydratedData?: DehydratedRouterData } }
  }

export function serializeReduxState(store: AppStore): DehydratedReduxState {
  const state = store.getState()
  return SSR_DEHYDRATED_SLICES.reduce((acc, key) => {
    acc[key] = state[key] as never
    return acc
  }, {} as DehydratedReduxState)
}

export function getDehydratedReduxState(): DehydratedReduxState | undefined {
  if (!getIsBrowser()) {
    return undefined
  }
  const state = (window as TanStackBootstrapWindow).$_TSR?.router?.dehydratedData?.reduxState
  if (state == null || typeof state !== 'object') {
    return undefined
  }
  return state as DehydratedReduxState
}
