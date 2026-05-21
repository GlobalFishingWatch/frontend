import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import { IconButton, InputText } from '@globalfishingwatch/ui-components'

import type { TUserGuideSection } from 'features/cms/strapi.types'
import { getHighlightedText, getSearchPreview } from 'utils/text'

import styles from './ContentPanel.module.css'

type TableOfContentsProps = {
  data: TUserGuideSection[]
  activeId?: string
  onClick?: (id: string) => void
  onSubTopicClick?: (sectionId: string, subId: string) => void
}

function TableOfContents({ data, activeId, onClick, onSubTopicClick }: TableOfContentsProps) {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
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

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return data
    const q = searchQuery.toLowerCase()
    return data.filter(
      (s) => s.title.toLowerCase().includes(q) || s.body?.toLowerCase().includes(q)
    )
  }, [data, searchQuery])

  const listItems = useMemo(
    () =>
      filteredSections.map((s) => ({
        id: s.slug || s.id.toString(),
        label: s.title,
        subTopics: s.subsections?.map((sub) => ({
          id: sub.slug || sub.id,
          label: sub.title,
        })),
        ...(searchQuery && { searchPreview: s.body }),
      })) || [],
    [filteredSections, searchQuery]
  )
  return (
    <div className={styles.tableOfContentsContainer}>
      <InputText
        onChange={(e) => setSearchQuery(e.target.value)}
        value={searchQuery}
        type="search"
        placeholder={t((t) => t.search.title)}
      />
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
                  <h3 className={styles.listItemLabel}>{item.label}</h3>
                </button>
                {hasSubTopics && (
                  <IconButton
                    icon={isCollapsed ? 'arrow-down' : 'arrow-top'}
                    size="small"
                    onClick={() => toggleCollapsed(item.id)}
                  />
                )}
              </div>
              {hasSubTopics && !isCollapsed && (
                <ul>
                  {item.subTopics!.map((sub) => (
                    <li key={sub.id}>
                      <button
                        type="button"
                        onClick={() => onSubTopicClick?.(item.id, sub.id)}
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
                  const searchPreview = getSearchPreview(item.searchPreview as string, searchQuery)
                  return (
                    <p className={styles.searchPreview}>
                      {getHighlightedText(searchPreview, searchQuery, styles)}
                    </p>
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
