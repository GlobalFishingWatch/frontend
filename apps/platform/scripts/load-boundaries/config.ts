/**
 * What each page is allowed to load. The engine in load-boundaries.ts knows nothing about this app;
 * everything app-specific lives here. Paths are relative to apps/platform.
 */
import { globSync } from 'node:fs'

import type { Check } from './shared.ts'
import { APP_ROOT } from './shared.ts'

/** Packages only the map needs. */
const MAP_ONLY_PACKAGES = [
  '@deck.gl/',
  '@luma.gl/',
  '@loaders.gl/',
  '@globalfishingwatch/deck-layers',
  '@globalfishingwatch/deck-layer-composer',
  '@globalfishingwatch/deck-loaders',
  '@globalfishingwatch/timebar',
]

/** Packages no page may load before it needs them. Each one costs every page, map or not. */
const HEAVY_PACKAGES = [
  ...MAP_ONLY_PACKAGES,
  '@turf/turf',
  '@strapi/client',
  'simple-statistics',
  'match-sorter',
  'recharts',
  'd3-geo',
  'd3-format',
  'd3-scale',
  'topojson-client',
]

/**
 * Root barrels that pull far more than any one consumer uses. Import the leaf subpath instead
 * (`react-aria-components/Button`, `@globalfishingwatch/ui-components/icon`).
 * apps/platform/eslint.config.js bans the same roots by folder; this bans them by reachability.
 */
const ROOT_BARRELS = [
  'react-aria-components',
  '@globalfishingwatch/ui-components',
  '@globalfishingwatch/deck-layers',
  '@globalfishingwatch/timebar',
]

/**
 * Subpaths of map-only libs that pull nothing heavy, so any page may import them. Only modules
 * inside the lib are exempt: if one starts importing @deck.gl, that still fails.
 */
const LIGHT_MAP_SUBPATHS = [
  '@globalfishingwatch/deck-layers/config', // layer colors, ramps, sort order
  '@globalfishingwatch/deck-loaders/fourwings/helpers', // fourwings cell/time math
  '@globalfishingwatch/timebar/constants',
]

/** Map-feature folders. */
const MAP_ONLY_MODULES = ['features/_map/', 'features/_reports/']

/**
 * Map-folder modules that add only themselves on top of the shell (check with
 * `explain <file> --baseline routes/_platform.tsx`), so loading them outside /map costs nothing.
 * An entry no content page reaches any more fails the check: delete it.
 */
const ALLOWED_MAP_MODULES = [
  'features/_map/sidebar/sidebar.utils.ts', // SCROLL_CONTAINER_DOM_ID, also imported by router.tsx
  'features/_map/map/map.config.ts', // map constants, type-only deck.gl import
  'features/_map/dataviews/dataviews.utils.ts', // dataview helpers; everything it imports is in the shell
  'features/_map/workspace/shared/InfoError.tsx', // error icon button
  'features/_reports/report-area/title/report-title.utils.tsx', // area name formatting, no imports
  'features/_reports/report-vessel-group/VesselGroupReportLink.tsx', // a Link to the report
  'features/_reports/report-vessel-group/VesselGroupReportLink.module.css', // ...and its one class
  'features/_reports/report-vessel-group/vessel-group-report.hooks.ts', // dispatches eager-slice actions
  'features/_reports/tabs/activity/reports-activity.actions.ts', // RTK-only leaf action
]

/**
 * Content pages that need map code by design, so they are not checked.
 *   vessel-search.tsx: advanced search filters by map datasets (DatasetLabel, dataview selectors).
 */
export const MAP_DEPENDENT_ROUTES = ['routes/_platform/_content/vessel-search.tsx']

const CONTENT_ROUTES = globSync('routes/_platform/_content{.tsx,/**/*.tsx}', { cwd: APP_ROOT })
  .filter((route) => !MAP_DEPENDENT_ROUTES.includes(route))
  .sort()

const SHELL = 'routes/_platform.tsx'

const EVERY_PAGE: Check['forbid'] = {
  packages: HEAVY_PACKAGES,
  allowSubpaths: LIGHT_MAP_SUBPATHS,
  barrels: ROOT_BARRELS,
}

const CONTENT_PAGE: Check['forbid'] = {
  packages: MAP_ONLY_PACKAGES,
  allowSubpaths: LIGHT_MAP_SUBPATHS,
  modules: MAP_ONLY_MODULES,
  allow: ALLOWED_MAP_MODULES,
  barrels: ROOT_BARRELS,
}

/**
 * maxModules: set a little above the count when the budget was last moved. Raise one only with a
 * reason in the commit; lower it whenever a refactor makes room.
 */
export const CHECKS: Check[] = [
  {
    // router.tsx calls makeStore unconditionally, so everything the reducer map reaches is in the
    // entry chunk. Slices injected with rootReducer.inject() are not in it.
    label: 'eager store',
    entries: ['routes/__root.tsx', 'store/reducers.ts'],
    maxModules: 190,
    forbid: EVERY_PAGE,
    why: 'The reducer map loads on every page, including pages with no map.',
  },
  {
    label: 'platform shell',
    entries: [SHELL],
    maxModules: 320,
    forbid: EVERY_PAGE,
    why: 'routes/_platform.tsx is the Redux shell every page mounts.',
  },
  {
    // Lazy in ContentLayout, but loads on every content page once the user has visited a workspace.
    label: 'NavigationHistoryButton',
    entries: ['features/_map/sidebar/buttons/NavigationHistoryButton.tsx'],
    maxModules: 235,
    forbid: EVERY_PAGE,
    why: 'Loads on every content page after a workspace visit.',
  },
  // One check per page, so a failure names the page. A page mounts the shell and the _content
  // layout too; the shell is listed so totals are what the page really loads, and is the baseline
  // so it is judged by its own check above.
  ...CONTENT_ROUTES.map((route): Check => ({
    label: route,
    entries: [...new Set([SHELL, 'routes/_platform/_content.tsx', route])],
    baseline: [SHELL],
    forbid: CONTENT_PAGE,
    why: 'Pages outside /map share the store with the map, but must not load map or report code until the user navigates there.',
  })),
]
