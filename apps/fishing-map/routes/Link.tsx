import type { ReactNode } from 'react'

import type { QueryParams } from 'types'

import { router } from './router'
import { buildSearchParams, getFullPath, linkToToPath, parseSearchParams } from './router.utils'
import { updateLocation } from './routes.actions'
import type { LinkTo, LinkToPayload, ROUTE_TYPES } from './routes.types'

interface CompatibleLinkProps {
  to: LinkTo | { type: ROUTE_TYPES; payload?: LinkToPayload; query?: QueryParams; replaceQuery?: boolean }
  children?: ReactNode
  className?: string
  onClick?: (e: React.MouseEvent) => void
  'data-test'?: string
  'data-testid'?: string
  replace?: boolean
}

/**
 * Compatible Link component that maintains the same API as redux-first-router-link
 * but uses TanStack Router under the hood
 */
export default function Link({ to, children, className, onClick, ...props }: CompatibleLinkProps) {
  const linkTo = to as LinkTo
  
  const path = linkToToPath(linkTo.type, linkTo.payload || {})
  const fullPath = getFullPath(path)
  
  // Get current query from URL
  const currentQuery = typeof window !== 'undefined'
    ? (window.location.search ? parseSearchParams(window.location.search.slice(1)) : {})
    : {}
  const searchParams = buildSearchParams(linkTo.query || {}, linkTo.replaceQuery || false, currentQuery)
  
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick(e)
    }
    
    // If not prevented, navigate using updateLocation which handles both TanStack Router and Redux
    if (!e.defaultPrevented) {
      e.preventDefault()
      updateLocation(linkTo.type, {
        query: linkTo.query || {},
        payload: linkTo.payload || {},
        replaceQuery: linkTo.replaceQuery || false,
        replaceUrl: props.replace || false,
      })
    }
  }

  // Use href for compatibility
  const href = searchParams ? `${fullPath}?${searchParams}` : fullPath

  return (
    <a
      href={href}
      className={className}
      onClick={handleClick}
      data-test={props['data-test']}
      data-testid={props['data-testid']}
    >
      {children}
    </a>
  )
}

// Re-export TanStack Router's Link for direct use if needed
export { Link as TanStackLink }
