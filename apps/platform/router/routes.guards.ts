import { redirect } from '@tanstack/react-router'

import { ROUTE_PATHS } from '@platform/config/routes'

import { PLATFORM_MODE } from 'data/map/config'

/**
 * `beforeLoad` guard for routes that are not public yet. Outside platform mode they redirect to
 * the map, so a shared, typed or crawled URL never renders an unreleased page.
 */
export function redirectToMapUnlessPlatformMode() {
  if (!PLATFORM_MODE) {
    throw redirect({ to: ROUTE_PATHS.MAP, replace: true })
  }
}
