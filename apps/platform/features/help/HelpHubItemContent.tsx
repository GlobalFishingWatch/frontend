import { memo } from 'react'

import ContentMarkdown from 'features/_map/content-panel/ContentMarkdown'
import type { HelpHubItem } from 'features/help/helpHub.types'

import styles from './HelpHubItemContent.module.css'

type HelpHubItemContentProps = {
  item: HelpHubItem
}

function HelpHubItemContent({ item }: HelpHubItemContentProps) {
  return (
    <article id={item.slug} data-item-slug={item.slug} className={styles.item}>
      <h1 className={styles.title}>{item.title}</h1>
      {item.thumbnail && (
        <img
          className={styles.thumbnail}
          src={item.thumbnail.url}
          alt={item.thumbnail.alternativeText ?? ''}
        />
      )}
      {item.description && <p className={styles.description}>{item.description}</p>}
      <ContentMarkdown>{item.body}</ContentMarkdown>
      {item.subsections?.map((subsection) => (
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

export default memo(HelpHubItemContent)
