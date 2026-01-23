import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router'

import { PATH_BASENAME } from 'data/config'

// Root route - not used for rendering since we're using Next.js
// Router is used only for URL state management, not component rendering
const rootRoute = createRootRoute({
  component: () => null,
})

// Index route (HOME)
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/index',
  component: () => <Outlet />,
})

// User route
const userRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/user',
  component: () => <Outlet />,
})

// Vessel search route
const vesselSearchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/vessel-search',
  component: () => <Outlet />,
})

// Report route
const reportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/report/$reportId',
  component: () => <Outlet />,
})

// Vessel route
const vesselRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/vessel/$vesselId',
  component: () => <Outlet />,
})

// Category route (WORKSPACES_LIST)
const categoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/$category',
  component: () => <Outlet />,
})

// Workspace route
const workspaceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/$category/$workspaceId',
  component: () => <Outlet />,
})

// Workspace search route
const workspaceSearchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/$category/$workspaceId/vessel-search',
  component: () => <Outlet />,
})

// Workspace vessel route
const workspaceVesselRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/$category/$workspaceId/vessel/$vesselId',
  component: () => <Outlet />,
})

// Workspace report route
const workspaceReportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/$category/$workspaceId/report/$datasetId/$areaId',
  component: () => <Outlet />,
})

// Workspace report route (datasetId only)
const workspaceReportDatasetRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/$category/$workspaceId/report/$datasetId',
  component: () => <Outlet />,
})

// Workspace report route (no params)
const workspaceReportNoParamsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/$category/$workspaceId/report',
  component: () => <Outlet />,
})

// Vessel group report route
const vesselGroupReportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/$category/$workspaceId/vessel-group-report/$vesselGroupId',
  component: () => <Outlet />,
})

// Port report route
const portReportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/$category/$workspaceId/ports-report/$portId',
  component: () => <Outlet />,
})

// Build route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  userRoute,
  vesselSearchRoute,
  reportRoute,
  vesselRoute,
  categoryRoute,
  workspaceRoute,
  workspaceSearchRoute,
  workspaceVesselRoute,
  workspaceReportRoute,
  workspaceReportDatasetRoute,
  workspaceReportNoParamsRoute,
  vesselGroupReportRoute,
  portReportRoute,
])

// Create router instance
export const router = createRouter({
  routeTree,
  basepath: PATH_BASENAME,
  defaultPreload: 'intent',
})

// Register router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
