import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { getRouteApi, Link, useNavigate } from '@tanstack/react-router'

import { ROUTE_PATHS } from '@platform/config/routes'

import TableOfContents from 'features/_map/content-panel/user-guide/TableOfContents'
import { useActiveItemOnScroll } from 'features/help/helpHub.hooks'
import { getHelpHubSectionCopy } from 'features/help/helpHub.i18n'
import { findHelpHubSection } from 'features/help/helpHub.utils'
import HelpHubError from 'features/help/HelpHubError'
import HelpHubItemContent from 'features/help/HelpHubItemContent'

import styles from './HelpHubSectionPage.module.css'

const sectionRoute = getRouteApi('/_platform/_content/help-and-resources/$sectionSlug/{-$itemSlug}')

function HelpHubSectionPage() {
  const { sectionSlug, itemSlug } = sectionRoute.useParams()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const { items, error } = sectionRoute.useLoaderData()
  const itemSlugs = useMemo(() => items.map((item) => item.slug), [items])

  const handleActiveChange = useCallback(
    (activeSlug: string) => {
      const nextItemSlug = activeSlug === itemSlugs[0] ? undefined : activeSlug
      if (nextItemSlug === itemSlug) {
        return
      }
      navigate({
        to: ROUTE_PATHS.HELP_HUB_SECTION,
        params: { sectionSlug, itemSlug: nextItemSlug },
        replace: true,
        resetScroll: false,
      })
    },
    [navigate, sectionSlug, itemSlug, itemSlugs]
  )

  useActiveItemOnScroll({
    containerRef: scrollContainerRef,
    itemSlugs,
    onActiveChange: handleActiveChange,
  })

  // Deep link: jump to the requested item once, on first render with content. Instant rather than
  // smooth, so a late-loading image cannot shift the target out from under an in-flight animation.
  const hasJumpedRef = useRef(false)
  useEffect(() => {
    if (hasJumpedRef.current || !items.length) {
      return
    }
    hasJumpedRef.current = true
    if (!itemSlug) {
      return
    }
    scrollContainerRef.current
      ?.querySelector(`[data-item-slug="${CSS.escape(itemSlug)}"]`)
      ?.scrollIntoView({ block: 'start' })
  }, [items, itemSlug])

  const scrollToItem = useCallback((slug: string) => {
    scrollContainerRef.current
      ?.querySelector(`[data-item-slug="${CSS.escape(slug)}"]`)
      ?.scrollIntoView({ block: 'start' })
  }, [])

  const section = findHelpHubSection(sectionSlug)
  const copy = section ? getHelpHubSectionCopy(section.id) : undefined

  if (error) {
    return <HelpHubError error={error} className={styles.placeholder} />
  }

  if (!items.length) {
    return <p className={styles.placeholder}>{t((s) => s.common.noData)}</p>
  }

  return (
    <div className={styles.page}>
      {copy && (
        <header className={styles.header}>
          <nav>
            <ul className={styles.breadcrumb}>
              <li>
                <Link to={ROUTE_PATHS.HELP_HUB} className={styles.breadcrumbLink}>
                  {t((s) => s.helpHub.title)}
                </Link>
              </li>
              <li className={styles.breadcrumbSeparator} aria-hidden="true">
                ›
              </li>
              <li>{copy.title}</li>
            </ul>
          </nav>
        </header>
      )}
      <div className={styles.container}>
        <TableOfContents
          data={items}
          activeId={itemSlug ?? itemSlugs[0]}
          className={styles.tableOfContents}
          onClick={scrollToItem}
          onSubItemClick={(_sectionId, subId) =>
            scrollContainerRef.current
              ?.querySelector(`#${CSS.escape(subId)}`)
              ?.scrollIntoView({ block: 'start' })
          }
        />
        <div ref={scrollContainerRef} className={styles.content}>
          {items.map((item) => (
            <HelpHubItemContent key={item.slug} item={item} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default HelpHubSectionPage
