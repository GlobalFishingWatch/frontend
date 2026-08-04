import { type I18nServerState, isValidI18nServerState } from 'features/i18n/i18n-state.utils'
import { getIsBrowser } from 'utils/dom'

type DehydratedRouterData = { i18nState?: unknown }

type TanStackBootstrapWindow = Window &
  typeof globalThis & {
    $_TSR?: { router?: { dehydratedData?: DehydratedRouterData } }
  }

export function getDehydratedRootI18nState(): I18nServerState | undefined {
  if (!getIsBrowser()) {
    return undefined
  }

  const state = (window as TanStackBootstrapWindow).$_TSR?.router?.dehydratedData?.i18nState
  return isValidI18nServerState(state) ? state : undefined
}
