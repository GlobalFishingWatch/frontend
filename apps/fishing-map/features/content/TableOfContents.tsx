import type { ChangeEvent } from 'react'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { InputText } from '@globalfishingwatch/ui-components'

import { useReplaceQueryParams } from 'router/routes.hook'

import styles from './ContentPanel.module.css'

type TableOfContentsProps = {
  listItems: { id: string; label: string }[]
}

function TableOfContents({ listItems }: TableOfContentsProps) {
  const { t } = useTranslation()
  const { replaceQueryParams } = useReplaceQueryParams()
  // const searchQuery = useSelector(selectSearchQuery)
  const [searchQuery, setSearchQuery] = useState('')

  const onInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }, [])

  return (
    <div>
      <InputText
        onChange={onInputChange}
        value={searchQuery || ''}
        type="search"
        placeholder={t((t) => t.search.title, {
          ns: 'translations',
        })}
      />
      <ul>
        {listItems.map((item) => (
          <li key={item.id} className={styles.listItem}>
            <button type="button" onClick={() => replaceQueryParams({ sidePanelId: item.id })}>
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TableOfContents
