// Stands in for `reselect` (every importer, RTK and RTK Query included) while the react-redux
// signals implementation is enabled — wired by the `react-redux-signals` plugin in vite.config.ts.
//
// Why: signals hands every hook the same tracking proxy for a given state, and reselect's default
// `argsMemoize` (weakMapMemoize, keyed on that state) makes the 2nd+ hook sharing a selector hit
// the cache without reading state. Signals then records no dependencies for that hook and it never
// updates again (react-redux 9.4.0-alpha.0). A pass-through `argsMemoize` makes input selectors
// always run; `memoize` still caches the result function on its inputs.
// Delete this file and its plugin branch once react-redux ships a fix.
import { createSelectorCreator as baseCreateSelectorCreator, weakMapMemoize } from 'reselect'

export * from 'reselect'

type AnyFn = (...args: any[]) => any
const passThrough = <F>(fn: F) => fn
// Overloads are generic over memoize types; the shim only forwards, so call through a loose type.
const looseCreateSelectorCreator = baseCreateSelectorCreator as (options: object) => unknown

// Accepts both call forms: (memoize, ...memoizeOptions) and ({ memoize, argsMemoize, ... }).
export const createSelectorCreator = ((
  memoizeOrOptions: AnyFn | object,
  ...memoizeOptions: unknown[]
) =>
  looseCreateSelectorCreator({
    argsMemoize: passThrough,
    ...(typeof memoizeOrOptions === 'function'
      ? { memoize: memoizeOrOptions, memoizeOptions }
      : memoizeOrOptions),
  })) as typeof baseCreateSelectorCreator

export const createSelector = createSelectorCreator({ memoize: weakMapMemoize })
