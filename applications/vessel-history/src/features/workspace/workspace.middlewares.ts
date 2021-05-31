import { Middleware, Dispatch } from 'redux'
import { setLastWorkspaceVisited } from 'features/workspace/workspace.slice'
import { RootState } from 'store'
import { UpdateQueryParamsAction } from 'routes/routes.actions'
import { routesMap, WORKSPACE_ROUTES } from 'routes/routes'

// This middleware is going to save the state of the workspace to back
export const routerWorkspaceMiddleware: Middleware =
  ({ getState, dispatch }: { getState: () => RootState; dispatch: Dispatch }) =>
  (next) =>
  (action: UpdateQueryParamsAction) => {
    const { prev } = getState().location
    const { lastVisited } = getState().workspace
    const routesToSaveWorkspace = Object.keys(routesMap).filter(
      (key) => !WORKSPACE_ROUTES.includes(key)
    )
    const comesFromWorkspacesRoute = WORKSPACE_ROUTES.includes(prev.type)
    if (routesToSaveWorkspace.includes(action.type) && comesFromWorkspacesRoute && !lastVisited) {
      const { type, query, payload } = prev
      dispatch(setLastWorkspaceVisited({ type, query, payload }))
    } else if (WORKSPACE_ROUTES.includes(action.type) && lastVisited) {
      dispatch(setLastWorkspaceVisited(undefined))
    }
    next(action)
  }
