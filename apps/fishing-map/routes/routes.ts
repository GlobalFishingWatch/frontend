// Redux First Router has been migrated to TanStack Router
// This file now only exports route constants and types for backward compatibility
// The actual routing is handled by TanStack Router in router.tsx

export const HOME = 'HOME'
export const WORKSPACE = 'WORKSPACE'
export const WORKSPACES_LIST = 'WORKSPACES_LIST'
export const USER = 'USER'
export const SEARCH = 'SEARCH'
export const WORKSPACE_SEARCH = 'WORKSPACE_SEARCH'
export const VESSEL = 'VESSEL'
export const WORKSPACE_VESSEL = 'WORKSPACE_VESSEL'
export const REPORT = 'REPORT'
export const VESSEL_GROUP_REPORT = 'VESSEL_GROUP_REPORT'
export const PORT_REPORT = 'PORT_REPORT'
export const WORKSPACE_REPORT = 'WORKSPACE_REPORT'
export const WORKSPACE_ROUTES = [HOME, WORKSPACE]
export const REPORT_ROUTES = [REPORT, WORKSPACE_REPORT, PORT_REPORT, VESSEL_GROUP_REPORT]
export const VESSEL_ROUTES = [VESSEL, WORKSPACE_VESSEL]

export const ALL_WORKSPACE_ROUTES = [
  ...WORKSPACE_ROUTES,
  ...REPORT_ROUTES,
  WORKSPACE_VESSEL,
  WORKSPACE_SEARCH,
  VESSEL_GROUP_REPORT,
  PORT_REPORT,
]

export type ROUTE_TYPES =
  | typeof HOME
  | typeof USER
  | typeof WORKSPACES_LIST
  | typeof WORKSPACE
  | typeof VESSEL
  | typeof VESSEL_GROUP_REPORT
  | typeof WORKSPACE_VESSEL
  | typeof REPORT
  | typeof WORKSPACE_REPORT
  | typeof SEARCH
  | typeof WORKSPACE_SEARCH
  | typeof REPORT
  | typeof PORT_REPORT

export const SAVE_WORKSPACE_BEFORE_LEAVE_KEY = 'SAVE_WORKSPACE_BEFORE_LEAVE'

export const ROUTES_WITH_WORKSPACES = [
  HOME,
  WORKSPACE,
  WORKSPACE_SEARCH,
  WORKSPACE_VESSEL,
  WORKSPACE_REPORT,
  VESSEL_GROUP_REPORT,
  PORT_REPORT,
]

// Legacy Redux First Router configuration (no longer used, kept for reference)
// Routes are now defined in router.tsx using TanStack Router
//
// const confirmLeave = (state: any, action: any) => {
//   const suggestWorkspaceSave = state.workspace?.suggestSave === true
//   const isGuestUser = selectIsGuestUser(state)
//   if (
//     !isGuestUser &&
//     !ROUTES_WITH_WORKSPACES.includes(action.type) &&
//     state.location?.type !== action.type &&
//     suggestWorkspaceSave
//   ) {
//     return t('common.confirmLeave')
//   }
// }
//
// export const routesMap: RoutesMap = { ... }
// export default connectRoutes(routesMap, routesOptions)
