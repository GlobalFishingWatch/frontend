import { useMemo, useState } from 'react'
import cx from 'classnames'

import { Icon, IconButton } from '@globalfishingwatch/ui-components'

import { getHighlightedText, getSearchPreview } from 'utils/text'

import styles from '../ContentPanel.module.css'

const markdownToText = (markdown = '') =>
  markdown
    .replace(/<[^>]*>/g, ' ') // html tags (iframes, etc)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links -> their text
    .replace(/[#*_`>~|]+/g, ' ') // emphasis, headings, quotes, tables
    .replace(/^\s*[-+]\s+/gm, ' ') // list bullets
    .replace(/\s+/g, ' ')
    .trim()

export type TableOfContentsSection = {
  id: string
  slug?: string
  title: string
  body?: string
  subsections?: {
    id: string
    slug?: string
    title: string
    body?: string
  }[]
}

type TableOfContentsProps = {
  data: TableOfContentsSection[]
  activeId?: string
  className?: string
  onClick?: (id: string) => void
  onSubItemClick?: (sectionId: string, subId: string) => void
  searchQuery?: string
}

function TableOfContents({
  data,
  activeId,
  className,
  onClick,
  onSubItemClick,
  searchQuery,
}: TableOfContentsProps) {
  const query = searchQuery?.trim() ?? ''
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const toggleCollapsed = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  // match and preview against plain text so urls and html attributes don't count as hits
  const searchableSections = useMemo(
    () =>
      data.map((s) => {
        const subsections = (s.subsections ?? []).map((sub) => ({
          ...sub,
          text: `${sub.title} ${markdownToText(sub.body)}`,
        }))
        const ownText = markdownToText(s.body)
        return {
          ...s,
          subsections,
          ownText,
          // most articles keep their content in subsections, not in the section body
          text: [ownText, ...subsections.map((sub) => sub.text)].join(' '),
        }
      }),
    [data]
  )

  const listItems = useMemo(() => {
    const q = query.toLowerCase()
    const matches = (text: string) => text.toLowerCase().includes(q)
    return searchableSections
      .filter((s) => !q || matches(s.title) || matches(s.text))
      .map((s) => ({
        id: s.slug || s.id.toString(),
        label: s.title,
        subTopics: s.subsections.map((sub) => ({
          id: sub.slug || sub.id,
          label: sub.title,
        })),
        ...(q && {
          searchPreview: s.text,
          matchedSubTopic:
            matches(s.title) || matches(s.ownText)
              ? undefined
              : s.subsections
                  .filter((sub) => matches(sub.text))
                  .map((sub) => ({ id: sub.slug || sub.id, label: sub.title }))[0],
        }),
      }))
  }, [searchableSections, query])
  return (
    <div
      className={cx(styles.tableOfContentsContainer, styles.notranslate, className)}
      translate="no"
    >
      <ul>
        {listItems.map((item) => {
          const isCollapsed = !expandedIds.has(item.id)
          const hasSubTopics = item.subTopics && item.subTopics.length > 0
          return (
            <li key={item.id}>
              <div className={styles.listItemRow}>
                <button
                  type="button"
                  onClick={() => onClick?.(item.id)}
                  className={cx(styles.listItem, { [styles.listItemActive]: activeId == item.id })}
                >
                  <h3 className={styles.listItemLabel}>
                    {getHighlightedText(item.label, query, styles)}
                  </h3>
                </button>
                {item.matchedSubTopic && (
                  <>
                    <Icon icon="arrow-right" className={styles.secondary} />
                    <button
                      type="button"
                      onClick={() => onSubItemClick?.(item.id, item.matchedSubTopic!.id)}
                      className={styles.listItem}
                    >
                      <h3 className={styles.listItemLabel}>
                        {getHighlightedText(item.matchedSubTopic.label, query, styles)}
                      </h3>
                    </button>
                  </>
                )}
                {hasSubTopics && !query && (
                  <IconButton
                    icon={isCollapsed ? 'arrow-down' : 'arrow-top'}
                    className={styles.listItemToggle}
                    size="small"
                    onClick={() => toggleCollapsed(item.id)}
                  />
                )}
              </div>
              {hasSubTopics && !isCollapsed && !query && (
                <ul>
                  {item.subTopics!.map((sub) => (
                    <li key={sub.id}>
                      <button
                        type="button"
                        onClick={() => onSubItemClick?.(item.id, sub.id)}
                        className={styles.subTopic}
                      >
                        {sub.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {item.searchPreview &&
                (() => {
                  const searchPreview = getSearchPreview(item.searchPreview, query)
                  return (
                    <button
                      type="button"
                      onClick={() =>
                        item.matchedSubTopic
                          ? onSubItemClick?.(item.id, item.matchedSubTopic.id)
                          : onClick?.(item.id)
                      }
                      className={styles.searchPreview}
                    >
                      {getHighlightedText(searchPreview, query, styles)}
                    </button>
                  )
                })()}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default TableOfContents
