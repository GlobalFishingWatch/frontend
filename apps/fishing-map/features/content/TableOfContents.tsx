import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import { InputText } from '@globalfishingwatch/ui-components'

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
}

function TableOfContents({
  listItems,
  activeId,
  searchQuery,
  onSearchChange,
  onClick,
}: TableOfContentsProps) {
  const { t } = useTranslation()

  return (
    <div className={styles.tableOfContentsContainer}>
      <InputText
        onChange={(e) => onSearchChange(e.target.value)}
        value={searchQuery || ''}
        type="search"
        placeholder={t((t) => t.search.title)}
      />
      <ul>
        {listItems.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => {
                onClick?.(item.id)
              }}
              className={cx(styles.listItem, { [styles.listItemActive]: activeId == item.id })}
            >
              <h3>{item.label}</h3>
            </button>
            {item.subTopics &&
              item.subTopics.map((sub) => {
                return (
                  <button
                    type="button"
                    onClick={() => {
                      onClick?.(sub.id)
                    }}
                    className={cx(styles.listItem, { [styles.listItemActive]: activeId == sub.id })}
                  >
                    <h4>{sub.label}</h4>
                  </button>
                )
              })}

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
        ))}
      </ul>
    </div>
  )
}

export default TableOfContents
