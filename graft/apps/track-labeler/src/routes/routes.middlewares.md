# apps/track-labeler/src/routes/routes.middlewares.ts · [[query-driven-state-synchronization]] [[track-labeler-routing]]

Middleware module that handles router query parameter updates and token refresh validation on navigation actions.

- routerQueryMiddleware · function · L10-L31 — Redux middleware that merges incoming query parameters with existing location query state unless explicitly replaced.
- routerRefreshTokenMiddleware · function · L33-L50 — Redux middleware that refreshes the user token when it has expired before processing a navigation action.
