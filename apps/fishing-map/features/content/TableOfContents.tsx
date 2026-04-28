import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import { InputText } from '@globalfishingwatch/ui-components'

import { useReplaceQueryParams } from 'router/routes.hook'

import styles from './ContentPanel.module.css'

type TableOfContentsProps = {
  listItems: { id: string; label: string }[]
  activeId?: string
  searchQuery: string
  onSearchChange: (value: string) => void
  onClick?: (isOpen: boolean) => void
}

function TableOfContents({
  listItems,
  activeId,
  searchQuery,
  onSearchChange,
  onClick,
}: TableOfContentsProps) {
  const { t } = useTranslation()
  const { replaceQueryParams } = useReplaceQueryParams()

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
          <li
            key={item.id}
            className={cx(styles.listItem, { [styles.listItemActive]: activeId == item.id })}
          >
            <button
              type="button"
              onClick={() => {
                replaceQueryParams({ sidePanelId: item.id })
                onClick?.(false)
              }}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TableOfContents
