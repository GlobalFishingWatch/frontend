import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from '@tanstack/react-router'
import { useGetUserGuideQuery } from 'queries/map/user-guide-api'

import type { Locale } from '@globalfishingwatch/api-types'
import { ROUTE_PATHS } from '@platform/config/routes'

import { findHelpHubSection } from 'features/help/helpHub.content'
import { getHelpHubSectionCopy } from 'features/help/helpHub.i18n'
import { toHelpHubTopics } from 'features/help/helpHub.types'

import styles from './HelpHubSectionOverview.module.css'

function HelpHubSectionOverview() {
  const { sectionSlug } = useParams({ strict: false })
  const { i18n } = useTranslation()

  const { data = [] } = useGetUserGuideQuery({ locale: i18n.language as Locale })
  const topics = useMemo(() => toHelpHubTopics(data), [data])

  const section = findHelpHubSection(sectionSlug)
  if (!section) {
    return null
  }

  const { title, description } = getHelpHubSectionCopy(section.id)

  return (
    <article>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.description}>{description}</p>
      <ul className={styles.topics}>
        {topics.map((topic) => (
          <li key={topic.slug}>
            <Link
              to={ROUTE_PATHS.HELP_HUB_TOPIC}
              params={{ sectionSlug: section.slug, topicSlug: topic.slug }}
              className={styles.topicLink}
            >
              {topic.title}
            </Link>
          </li>
        ))}
      </ul>
    </article>
  )
}

export default HelpHubSectionOverview
