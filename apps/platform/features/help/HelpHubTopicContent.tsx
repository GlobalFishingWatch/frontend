import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from '@tanstack/react-router'
import { useGetUserGuideQuery } from 'queries/map/user-guide-api'

import type { Locale } from '@globalfishingwatch/api-types'

import ContentMarkdown from 'features/_map/content-panel/ContentMarkdown'
import { findHelpHubTopic, toHelpHubTopics } from 'features/help/helpHub.types'

import styles from './HelpHubTopicContent.module.css'

function HelpHubTopicContent() {
  const { topicSlug } = useParams({ strict: false })
  const { t, i18n } = useTranslation()

  const { data = [] } = useGetUserGuideQuery({ locale: i18n.language as Locale })
  const topics = useMemo(() => toHelpHubTopics(data), [data])
  const topic = findHelpHubTopic(topics, topicSlug)

  if (!topic) {
    // TODO the route's loader should redirect to the section overview instead.
    return <p className={styles.empty}>{t((s) => s.common.noData)}</p>
  }

  return (
    <article>
      <h1 className={styles.title}>{topic.title}</h1>
      {topic.thumbnail && (
        <img
          className={styles.thumbnail}
          src={topic.thumbnail.url}
          alt={topic.thumbnail.alternativeText ?? ''}
        />
      )}
      {topic.description && <p className={styles.description}>{topic.description}</p>}
      <ContentMarkdown>{topic.body}</ContentMarkdown>
      {topic.subsections?.map((subsection) => (
        <section
          key={subsection.id}
          id={subsection.slug || subsection.id}
          className={styles.subsection}
        >
          <h2 className={styles.subsectionTitle}>{subsection.title}</h2>
          <ContentMarkdown>{subsection.body}</ContentMarkdown>
        </section>
      ))}
    </article>
  )
}

export default HelpHubTopicContent
