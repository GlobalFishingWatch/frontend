import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { getRouteApi, Link, useNavigate } from '@tanstack/react-router'
import cx from 'classnames'

import { ROUTE_PATHS } from '@platform/config/routes'

import TableOfContents from 'features/_map/content-panel/user-guide/TableOfContents'
import { SCROLL_CONTAINER_DOM_ID } from 'features/_map/sidebar/sidebar.utils'
import { getHelpHubSectionCopy } from 'features/help/helpHub.i18n'
import { findHelpHubSection } from 'features/help/helpHub.utils'
import HelpHubError from 'features/help/HelpHubError'
import HelpHubItemContent from 'features/help/HelpHubItemContent'

import styles from './HelpHubSectionPage.module.css'

const sectionRoute = getRouteApi('/_platform/_content/help-and-resources/$sectionSlug/{-$itemSlug}')

function HelpHubSectionPage() {
  const { sectionSlug } = sectionRoute.useParams()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const { index, item, error } = sectionRoute.useLoaderData()
  const activeSlug = item?.slug

  const { previous, next } = useMemo(() => {
    const position = index.findIndex(({ slug }) => slug === activeSlug)
    return position === -1 ? {} : { previous: index[position - 1], next: index[position + 1] }
  }, [index, activeSlug])

  const goToItem = useCallback(
    (slug: string) => {
      navigate({ to: ROUTE_PATHS.HELP_HUB_SECTION, params: { sectionSlug, itemSlug: slug } })
    },
    [navigate, sectionSlug]
  )

  // One article per page now, and the whole layout scrolls, so a new article starts at the top.
  useEffect(() => {
    document.getElementById(SCROLL_CONTAINER_DOM_ID)?.scrollTo({ top: 0 })
  }, [activeSlug])

  const section = findHelpHubSection(sectionSlug)
  const copy = section ? getHelpHubSectionCopy(section.id) : undefined

  if (error) {
    return <HelpHubError error={error} className={styles.placeholder} />
  }

  if (!item) {
    return <p className={styles.placeholder}>{t((s) => s.common.noData)}</p>
  }

  return (
    <div className={styles.container}>
      <div className={styles.aside}>
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
        <TableOfContents
          data={index}
          activeId={activeSlug}
          className={styles.tableOfContents}
          onClick={goToItem}
          onSubItemClick={(sectionId, subId) => {
            if (sectionId === activeSlug) {
              scrollContainerRef.current
                ?.querySelector(`#${CSS.escape(subId)}`)
                ?.scrollIntoView({ block: 'start' })
              return
            }
            goToItem(sectionId)
          }}
        />
      </div>
      <div ref={scrollContainerRef} className={styles.content}>
        <HelpHubItemContent item={item} />
        <nav className={styles.pagination}>
          {previous && (
            <Link
              to={ROUTE_PATHS.HELP_HUB_SECTION}
              params={{ sectionSlug, itemSlug: previous.slug }}
              className={styles.paginationLink}
            >
              <span className={styles.paginationLabel}>
                ‹ {t((s) => s.helpHub.previousArticle)}
              </span>
              <span className={styles.paginationTitle}>{previous.title}</span>
            </Link>
          )}
          {next && (
            <Link
              to={ROUTE_PATHS.HELP_HUB_SECTION}
              params={{ sectionSlug, itemSlug: next.slug }}
              className={cx(styles.paginationLink, styles.paginationNext)}
            >
              <span className={styles.paginationLabel}>{t((s) => s.helpHub.nextArticle)} ›</span>
              <span className={styles.paginationTitle}>{next.title}</span>
            </Link>
          )}
        </nav>
      </div>
    </div>
  )
}

export default HelpHubSectionPage
