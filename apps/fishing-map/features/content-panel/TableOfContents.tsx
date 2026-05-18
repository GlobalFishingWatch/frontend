import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import { IconButton, InputText } from '@globalfishingwatch/ui-components'

import { getHighlightedText, getSearchPreview } from 'utils/text'

import styles from './ContentPanel.module.css'

type TableOfContentsProps = {
  listItems: {
    id: string
    label: string
    subTopics?: { id: string; label: string }[]
    searchPreview?: string
  }[]
  activeId?: string
  searchQuery: string
  onSearchChange: (value: string) => void
  onClick?: (id: string) => void
  onSubTopicClick?: (sectionId: string, subId: string) => void
}

function TableOfContents({
  listItems,
  activeId,
  searchQuery,
  onSearchChange,
  onClick,
  onSubTopicClick,
}: TableOfContentsProps) {
  const { t } = useTranslation()
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

  return (
    <div className={styles.tableOfContentsContainer}>
      <InputText
        onChange={(e) => onSearchChange(e.target.value)}
        value={searchQuery || ''}
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
