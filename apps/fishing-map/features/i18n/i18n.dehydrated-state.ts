import { ROOT_DOM_ELEMENT } from 'data/config'
import { type I18nServerState, isValidI18nServerState } from 'features/i18n/i18n-state.utils'
import { getIsBrowser } from 'utils/dom'

/**
 * TanStack Router dehydrated match before client hydration.
 * `i` = route id, `l` = loader data — not post-hydration `routeId` / `loaderData`.
 */
type DehydratedRouterMatch = {
  i?: string
  l?: { i18nState?: unknown }
}

type TanStackRouterBootstrapWindow = Window &
  typeof globalThis & {
    $_TSR?: { router?: { matches?: DehydratedRouterMatch[] } }
  }

function getDehydratedRouterMatches(): DehydratedRouterMatch[] | undefined {
  return (window as TanStackRouterBootstrapWindow).$_TSR?.router?.matches
}

/** Extract validated root i18n loader state from TanStack Router dehydrated matches. */
function getRootI18nStateFromDehydratedMatches(
  matches: DehydratedRouterMatch[] | undefined
): I18nServerState | undefined {
  if (!matches?.length) {
    return undefined
  }

  for (const match of matches) {
    if (!match.i?.startsWith(ROOT_DOM_ELEMENT)) {
      continue
    }
    const state = match.l?.i18nState
    if (isValidI18nServerState(state)) {
      return state
    }
  }

  return undefined
}

/** Root loader i18n state from TanStack Router's pre-hydration bootstrap payload. */
export function getDehydratedRootI18nState(): I18nServerState | undefined {
  if (!getIsBrowser()) {
    return undefined
  }

  return getRootI18nStateFromDehydratedMatches(getDehydratedRouterMatches())
}
