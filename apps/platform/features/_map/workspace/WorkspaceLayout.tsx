import { Outlet } from '@tanstack/react-router'

/**
 * Workspace layout route component for all /$category/$workspaceId/* routes.
 * Workspace data fetching is centralized in `useEnsureWorkspace` (mounted in App); this just
 * renders <Outlet /> so the matched child route component appears in the sidebar.
 */
function WorkspaceLayout() {
  return <Outlet />
}

export default WorkspaceLayout
