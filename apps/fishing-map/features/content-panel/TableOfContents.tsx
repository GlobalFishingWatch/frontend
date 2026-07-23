import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import type { SelectOption } from '@globalfishingwatch/ui-components'
import { IconButton, InputText, Select } from '@globalfishingwatch/ui-components'

import type { UserGuideContent, UserGuideRole } from 'features/cms/loaders/user-guide.types'
import { USER_GUIDE_ROLES } from 'features/cms/loaders/user-guide.types'
import { getHighlightedText, getSearchPreview } from 'utils/text'

import styles from './ContentPanel.module.css'

type TableOfContentsProps = {
  data: UserGuideContent
  activeId?: string
  onClick?: (id: string) => void
  onSubTopicClick?: (sectionId: string, subId: string) => void
}

function TableOfContents({ data, activeId, onClick, onSubTopicClick }: TableOfContentsProps) {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState<UserGuideRole | undefined>()
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const roleOptions = useMemo<SelectOption<UserGuideRole>[]>(
    () => USER_GUIDE_ROLES.map((role) => ({ id: role, label: role })),
    []
  )
  const selectedRoleOption = useMemo(
    () => roleOptions.find((option) => option.id === selectedRole),
    [roleOptions, selectedRole]
  )

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
    let sections = data
    if (selectedRole) {
      sections = sections.filter((s) => s.role?.includes(selectedRole))
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      sections = sections.filter(
        (s) => s.title.toLowerCase().includes(q) || s.body?.toLowerCase().includes(q)
      )
    }
    return sections
  }, [data, searchQuery, selectedRole])

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
      <Select
        options={roleOptions}
        selectedOption={selectedRoleOption}
        onSelect={(option) => setSelectedRole(option.id as UserGuideRole)}
        onCleanClick={() => setSelectedRole(undefined)}
        placeholder={t((t) => t.userGuide.filterByRole)}
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
