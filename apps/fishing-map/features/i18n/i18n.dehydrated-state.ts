import type { I18nServerState } from 'features/i18n/i18n.server'
import { getIsBrowser } from 'utils/dom'

/**
 * TanStack Router dehydrated match (`DehydratedMatch` in @tanstack/router-core).
 * `i` is the match id; `l` is loader data. This is the stable SSR wire format in
 * `window.$_TSR.router.matches` before client hydration runs — not post-hydration
 * `routeId` / `loaderData` fields on router context matches.
 */
type DehydratedMatch = {
  i?: string
  l?: { i18nState?: I18nServerState }
}

export function getRootI18nStateFromDehydratedMatches(
  matches: DehydratedMatch[] | undefined
): I18nServerState | undefined {
  if (!matches?.length) {
    return undefined
  }

  const rootMatch = matches.find((match) => match.i?.startsWith('__root__'))
  return rootMatch?.l?.i18nState
}

/** Read root loader i18n state from TanStack Router's pre-hydration bootstrap payload. */
export function getDehydratedRootI18nState(): I18nServerState | undefined {
  if (!getIsBrowser()) {
    return undefined
  }

  const matches = (window as { $_TSR?: { router?: { matches?: DehydratedMatch[] } } }).$_TSR
    ?.router?.matches

  return getRootI18nStateFromDehydratedMatches(matches)
}
