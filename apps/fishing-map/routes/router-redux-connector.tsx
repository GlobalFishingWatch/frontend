import { useEffect } from 'react'

import { useAppDispatch } from 'features/app/app.hooks'

import { router } from './router'
import { setLocation } from './location.slice'
import {
  extractPayloadFromParams,
  getRouteTypeFromPath,
  parseSearchParams,
} from './router.utils'

/**
 * Component that syncs URL state to Redux location slice
 * This maintains backward compatibility with all existing Redux selectors
 * Uses router instance directly for URL matching, but syncs from window.location
 */
export function RouterReduxConnector() {
  const dispatch = useAppDispatch()

  // Sync URL to Redux on mount and URL changes
  useEffect(() => {
    if (typeof window === 'undefined') return

    const syncLocation = () => {
      const pathname = window.location.pathname
      const search = window.location.search.slice(1) // Remove '?'
      
      // Remove basename from pathname if present
      let cleanPathname = pathname
      const basename = router.options.basepath || ''
      if (basename && basename !== '/' && pathname.startsWith(basename)) {
        cleanPathname = pathname.slice(basename.length) || '/'
      }
      
      // Parse URL path to extract params manually (since we're not using RouterProvider)
      const pathParts = cleanPathname.split('/').filter(Boolean)
      const params: Record<string, string | undefined> = {}
      
      // Extract params based on path patterns
      if (pathParts[0] === 'index' || cleanPathname === '/' || cleanPathname === '/index') {
        // HOME route
      } else if (pathParts[0] === 'user') {
        // USER route
      } else if (pathParts[0] === 'vessel-search') {
        // SEARCH route
      } else if (pathParts[0] === 'report' && pathParts[1]) {
        params.reportId = pathParts[1]
      } else if (pathParts[0] === 'vessel' && pathParts[1]) {
        params.vesselId = pathParts[1]
      } else if (pathParts[0]) {
        // Category-based routes
        params.category = pathParts[0]
        if (pathParts[1]) params.workspaceId = pathParts[1]
        if (pathParts[2] === 'vessel-search') {
          // WORKSPACE_SEARCH
        } else if (pathParts[2] === 'vessel' && pathParts[3]) {
          params.vesselId = pathParts[3]
        } else if (pathParts[2] === 'report') {
          if (pathParts[3]) params.datasetId = pathParts[3]
          if (pathParts[4]) params.areaId = pathParts[4]
        } else if (pathParts[2] === 'vessel-group-report' && pathParts[3]) {
          params.vesselGroupId = pathParts[3]
        } else if (pathParts[2] === 'ports-report' && pathParts[3]) {
          params.portId = pathParts[3]
        }
      }
      
      const routeType = getRouteTypeFromPath(cleanPathname, params as Record<string, string>)
      const payload = extractPayloadFromParams(params)
      const query = search ? parseSearchParams(search) : {}

      dispatch(
        setLocation({
          type: routeType,
          payload,
          query: query as any,
          pathname: cleanPathname,
        })
      )
    }

    // Initial sync
    syncLocation()

    // Listen to popstate (browser back/forward)
    window.addEventListener('popstate', syncLocation)

    return () => {
      window.removeEventListener('popstate', syncLocation)
    }
  }, [dispatch])

  return null
}
