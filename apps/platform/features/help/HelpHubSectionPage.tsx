import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { getRouteApi, useNavigate } from '@tanstack/react-router'
import { useGetUserGuideQuery } from 'queries/map/user-guide-api'

import type { Locale } from '@globalfishingwatch/api-types'
import { Spinner } from '@globalfishingwatch/ui-components'
import { ROUTE_PATHS } from '@platform/config/routes'

import TableOfContents from 'features/_map/content-panel/user-guide/TableOfContents'
import { findHelpHubSection } from 'features/help/helpHub.content'
import { useActiveTopicOnScroll } from 'features/help/helpHub.hooks'
import { getHelpHubSectionCopy } from 'features/help/helpHub.i18n'
import { toHelpHubTopics } from 'features/help/helpHub.types'
import HelpHubTopicContent from 'features/help/HelpHubTopicContent'

import styles from './HelpHubSectionPage.module.css'

const sectionRoute = getRouteApi(
  '/_platform/_content/help-and-resources/$sectionSlug/{-$topicSlug}'
)

function HelpHubSectionPage() {
  const { sectionSlug, topicSlug } = sectionRoute.useParams()
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // TODO swap for the help hub CMS
  const {
    data = [],
    isLoading,
    isError,
  } = useGetUserGuideQuery({
    locale: i18n.language as Locale,
  })

  const topics = useMemo(() => toHelpHubTopics(data), [data])
  const topicSlugs = useMemo(() => topics.map((topic) => topic.slug), [topics])

  const handleActiveChange = useCallback(
    (activeSlug: string) => {
      const nextTopicSlug = activeSlug === topicSlugs[0] ? undefined : activeSlug
      if (nextTopicSlug === topicSlug) {
        return
      }
      navigate({
        to: ROUTE_PATHS.HELP_HUB_SECTION,
        params: { sectionSlug, topicSlug: nextTopicSlug },
        replace: true,
        resetScroll: false,
      })
    },
    [navigate, sectionSlug, topicSlug, topicSlugs]
  )

  useActiveTopicOnScroll({
    containerRef: scrollContainerRef,
    topicSlugs,
    onActiveChange: handleActiveChange,
  })

  // Deep link: jump to the requested topic once, on first render with content. Instant rather than
  // smooth, so a late-loading image cannot shift the target out from under an in-flight animation.
  const hasJumpedRef = useRef(false)
  useEffect(() => {
    if (hasJumpedRef.current || !topics.length) {
      return
    }
    hasJumpedRef.current = true
    if (!topicSlug) {
      return
    }
    scrollContainerRef.current
      ?.querySelector(`[data-topic-slug="${CSS.escape(topicSlug)}"]`)
      ?.scrollIntoView({ block: 'start' })
  }, [topics, topicSlug])

  const scrollToTopic = useCallback((slug: string) => {
    scrollContainerRef.current
      ?.querySelector(`[data-topic-slug="${CSS.escape(slug)}"]`)
      ?.scrollIntoView({ block: 'start' })
  }, [])

  const section = findHelpHubSection(sectionSlug)
  const copy = section ? getHelpHubSectionCopy(section.id) : undefined

  if (isLoading) {
    return (
      <div className={styles.placeholder}>
        <Spinner />
      </div>
    )
  }

  if (isError || !topics.length) {
    return <p className={styles.placeholder}>{t((s) => s.common.noData)}</p>
  }

  return (
    <div className={styles.container}>
      <TableOfContents
        data={topics}
        activeId={topicSlug ?? topicSlugs[0]}
        className={styles.tableOfContents}
        onClick={scrollToTopic}
        onSubTopicClick={(_sectionId, subId) =>
          scrollContainerRef.current
            ?.querySelector(`#${CSS.escape(subId)}`)
            ?.scrollIntoView({ block: 'start' })
        }
      />
      <div ref={scrollContainerRef} className={styles.content}>
        {copy && (
          <header className={styles.header}>
            <h1 className={styles.title}>{copy.title}</h1>
            <p className={styles.description}>{copy.description}</p>
          </header>
        )}
        {topics.map((topic) => (
          <HelpHubTopicContent key={topic.slug} topic={topic} />
        ))}
      </div>
    </div>
  )
}

export default HelpHubSectionPage
