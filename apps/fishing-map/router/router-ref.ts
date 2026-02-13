import type { AnyRouter } from '@tanstack/react-router'

let _router: AnyRouter

export function setRouterRef(router: AnyRouter) {
  _router = router
}

export function getRouterRef(): AnyRouter {
  return _router
}
