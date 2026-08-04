import type { ComponentProps, ComponentType, ReactNode } from 'react'
import { Link } from '@tanstack/react-router'

import { ROUTE_PATHS } from '@platform/config/routes'

import type { WorkspaceCategory } from 'data/map/workspaces'
import { DEFAULT_WORKSPACE_CATEGORY, DEFAULT_WORKSPACE_ID } from 'data/map/workspaces'
import type {
  selectLastVisitedWorkspace,
  selectWorkspace,
} from 'features/_map/workspace/workspace.selectors'
import { cleanReportPayload, cleanReportQuery } from 'features/_map/workspace/workspace.utils'
import { EMPTY_SEARCH_FILTERS } from 'features/_vessels/search/search.config'
import type { NavItem, RoutedNavItem } from 'features/nav/nav.config'
import type { ValidRoutePathValues } from 'router/routes.utils'
import { toValidRoutePath } from 'router/routes.utils'
import type { QueryParams } from 'types'

/** Live state and side effects a row's link may depend on. */
export type NavLinkContext = {
  workspace: ReturnType<typeof selectWorkspace>
  lastVisitedWorkspace: ReturnType<typeof selectLastVisitedWorkspace>
  isWorkspaceLocation: boolean
  isWorkspaceVesselLocation: boolean
  onWorkspaceClick: () => void
  onSearchClick: () => void
  onCategoryClick: (category: WorkspaceCategory) => void
}

export type NavLinkProps = {
  to: ValidRoutePathValues
  params?: Record<string, string>
  search?: unknown
  replace?: boolean
  onClick?: () => void
}

/**
 * TanStack types `Link` per call site: `to` must be a literal, and `params`/`search` are then
 * inferred *from that literal*. Nav rows come from a config array, so `to` is only ever a union —
 * there is no literal to infer from, and the generic never resolves. This narrows `Link` to the
 * subset of props the nav uses, with `to` still typed as a real route path (`ValidRoutePathValues`),
 * so a bad path is still a compile error. What is given up is the `params`/`search` shape *matching*
 * that specific path — the router validates it at runtime.
 */
export const NavLink = Link as ComponentType<
  NavLinkProps & {
    className?: string
    onClick?: ComponentProps<'a'>['onClick']
    children?: ReactNode
    'data-testid'?: string
  }
>

const workspaceParams = (workspace: NavLinkContext['workspace']) => ({
  category: workspace?.category || DEFAULT_WORKSPACE_CATEGORY,
  workspaceId: workspace?.id || DEFAULT_WORKSPACE_ID,
})

/**
 * Rows whose target depends on live state, keyed by nav item id. Everything else links straight to
 * its `to`/`params` — see `getNavLinkProps`.
 */
const NAV_LINK_RESOLVERS: Record<string, (ctx: NavLinkContext) => NavLinkProps> = {
  // Back to the workspace the user came from, minus any report state.
  workspace: ({ workspace, lastVisitedWorkspace, onWorkspaceClick }) => ({
    to: lastVisitedWorkspace
      ? toValidRoutePath(lastVisitedWorkspace.to, lastVisitedWorkspace.params)
      : ROUTE_PATHS.WORKSPACE,
    params: lastVisitedWorkspace
      ? cleanReportPayload(lastVisitedWorkspace.params || {})
      : workspaceParams(workspace),
    search: lastVisitedWorkspace
      ? {
          ...cleanReportQuery(lastVisitedWorkspace.search || {}),
          ...EMPTY_SEARCH_FILTERS,
          userTab: undefined,
        }
      : (prev: QueryParams) => ({
          ...cleanReportQuery(prev),
          dataviewInstances: (prev.dataviewInstances || []).filter(
            (dataviewInstance) => dataviewInstance.origin !== 'report'
          ),
          ...EMPTY_SEARCH_FILTERS,
          userTab: undefined,
        }),
    replace: true,
    onClick: onWorkspaceClick,
  }),
  // Search stays inside the workspace (keeping its state) when there is one.
  search: ({ workspace, isWorkspaceLocation, isWorkspaceVesselLocation, onSearchClick }) => {
    const workspaceScoped = isWorkspaceLocation || isWorkspaceVesselLocation
    return {
      to: workspaceScoped ? ROUTE_PATHS.WORKSPACE_SEARCH : ROUTE_PATHS.SEARCH,
      params: workspaceParams(workspace),
      search: workspaceScoped ? (prev: QueryParams) => prev : {},
      replace: !workspaceScoped,
      onClick: onSearchClick,
    }
  },
}

export function getNavLinkProps(item: RoutedNavItem, ctx: NavLinkContext): NavLinkProps {
  const resolver = NAV_LINK_RESOLVERS[item.id]
  if (resolver) {
    return resolver(ctx)
  }
  const category = item.params?.category
  return {
    to: toValidRoutePath(item.to),
    params: item.params,
    search: {},
    onClick: category ? () => ctx.onCategoryClick(category as WorkspaceCategory) : undefined,
  }
}

/** Rows linking to where the user already is: inert row, and a tooltip saying so. */
export function isNavItemCurrentLocation(item: NavItem, ctx: NavLinkContext): boolean {
  return item.id === 'workspace' && ctx.isWorkspaceLocation
}
