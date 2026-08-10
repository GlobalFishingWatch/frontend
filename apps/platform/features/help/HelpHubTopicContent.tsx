import { memo } from 'react'

import ContentMarkdown from 'features/_map/content-panel/ContentMarkdown'
import type { HelpHubTopic } from 'features/help/helpHub.types'

import styles from './HelpHubTopicContent.module.css'

type HelpHubTopicContentProps = {
  topic: HelpHubTopic
}

function HelpHubTopicContent({ topic }: HelpHubTopicContentProps) {
  return (
    <article id={topic.slug} data-topic-slug={topic.slug} className={styles.topic}>
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

export default memo(HelpHubTopicContent)
