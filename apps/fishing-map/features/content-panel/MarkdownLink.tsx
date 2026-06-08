import { useMemo } from 'react'
import { parse } from 'qs'

import { useSidePanel } from 'features/content-panel/contentPanel.hooks'
import { findSectionForSlug } from 'features/help/userGuide.utils'
import { useReplaceQueryParams } from 'router/routes.hook'
import { Route } from 'routes/_app'
import type { QueryParams } from 'types'

type MarkdownLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement>

const MarkdownLink = ({ href, children, ...props }: MarkdownLinkProps) => {
  const { replaceQueryParams } = useReplaceQueryParams()
  const { openSidePanel } = useSidePanel()
  const { sidePanelContent, sidePanelId, sidePanelSubcontentId } = Route.useSearch()

  const sameRouteUrl = useMemo(() => {
    if (!href) return null
    try {
      const url = new URL(href, window.location.origin)
      const isSameRoute =
        url.origin === window.location.origin && url.pathname === window.location.pathname
      return isSameRoute ? url : null
    } catch {
      return null
    }
  }, [href])

  if (href?.startsWith('#')) {
    const sectionMatch = findSectionForSlug(href.replace(/^#/, ''))
    if (!sectionMatch) {
      return <span>{children}</span>
    }
    return (
      <a
        href={href}
        onClick={(e) => {
          e.preventDefault()
          openSidePanel({
            type: 'userGuide',
            id: sectionMatch.section,
            subcontentId: sectionMatch.subSection,
          })
        }}
        {...props}
      >
        {children}
      </a>
    )
  }

  if (!sameRouteUrl) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    )
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    const newParams = parse(sameRouteUrl.search, {
      ignoreQueryPrefix: true,
    }) as Partial<QueryParams>
    replaceQueryParams({
      ...newParams,
      sidePanelContent,
      sidePanelId,
      sidePanelSubcontentId,
    })
  }

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  )
}

export default MarkdownLink
