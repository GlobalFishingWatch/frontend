import type { AnyRouter } from '@tanstack/react-router'

let routerRef: AnyRouter | undefined

export function setRouterRef(router: AnyRouter) {
  routerRef = router
}

export function getRouterRef(): AnyRouter | undefined {
  return routerRef
}
