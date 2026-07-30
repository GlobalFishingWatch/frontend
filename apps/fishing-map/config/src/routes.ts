export const DEFAULT_PATH_BASENAME = '/map'

// Route path literals for type-safe navigation, matching the file routes in routes/_app
export const ROUTE_PATHS = {
  HOME: '/' as const,
  USER: '/user' as const,
  SEARCH: '/vessel-search' as const,
  REPORT: '/report/$reportId' as const,
  VESSEL: '/vessel/$vesselId' as const,
  WORKSPACES_LIST: '/$category' as const,
  WORKSPACE: '/$category/$workspaceId' as const,
  WORKSPACE_SEARCH: '/$category/$workspaceId/vessel-search' as const,
  WORKSPACE_VESSEL: '/$category/$workspaceId/vessel/$vesselId' as const,
  WORKSPACE_REPORT: '/$category/$workspaceId/report' as const,
  WORKSPACE_REPORT_DATASET: '/$category/$workspaceId/report/$datasetId' as const,
  WORKSPACE_REPORT_FULL: '/$category/$workspaceId/report/$datasetId/$areaId' as const,
  VESSEL_GROUP_REPORT: '/$category/$workspaceId/vessel-group-report/$vesselGroupId' as const,
  PORT_REPORT: '/$category/$workspaceId/ports-report/$portId' as const,
} as const

export type RoutePathValues = (typeof ROUTE_PATHS)[keyof typeof ROUTE_PATHS]
