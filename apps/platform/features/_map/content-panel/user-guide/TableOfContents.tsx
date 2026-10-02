import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import { Icon, IconButton, InputText } from '@globalfishingwatch/ui-components'

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
  /** pass it to render the search input elsewhere (e.g. a header); omit to use the built-in one */
  searchQuery?: string
}

function TableOfContents({
  data,
  activeId,
  className,
  onClick,
  onSubItemClick,
  searchQuery: controlledSearchQuery,
}: TableOfContentsProps) {
  const { t } = useTranslation()
  const [localSearchQuery, setSearchQuery] = useState('')
  const isSearchControlled = controlledSearchQuery !== undefined
  const searchQuery = isSearchControlled ? controlledSearchQuery : localSearchQuery
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
    const q = searchQuery.trim().toLowerCase()
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
  }, [searchableSections, searchQuery])
  return (
    <div
      className={cx(styles.tableOfContentsContainer, styles.notranslate, className)}
      translate="no"
    >
      {!isSearchControlled && (
        <InputText
          onChange={(e) => setSearchQuery(e.target.value)}
          onCleanButtonClick={() => setSearchQuery('')}
          value={searchQuery}
          type="search"
          placeholder={t((t) => t.search.title)}
        />
      )}
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
                    {getHighlightedText(item.label, searchQuery, styles)}
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
                        {getHighlightedText(item.matchedSubTopic.label, searchQuery, styles)}
                      </h3>
                    </button>
                  </>
                )}
                {hasSubTopics && !searchQuery && (
                  <IconButton
                    icon={isCollapsed ? 'arrow-down' : 'arrow-top'}
                    className={styles.listItemToggle}
                    size="small"
                    onClick={() => toggleCollapsed(item.id)}
                  />
                )}
              </div>
              {hasSubTopics && !isCollapsed && !searchQuery && (
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
                  const searchPreview = getSearchPreview(item.searchPreview, searchQuery)
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
                      {getHighlightedText(searchPreview, searchQuery, styles)}
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
