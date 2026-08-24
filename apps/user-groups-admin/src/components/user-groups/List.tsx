import React, { Fragment, useEffect, useState } from 'react'

import { GFWAPI } from '@globalfishingwatch/api-client'
import {
  BADGES_GROUP_ADMIN_ID,
  BADGES_GROUP_PREFIX,
  type UserData,
  type UserGroup,
} from '@globalfishingwatch/api-types'
import { InputText } from '@globalfishingwatch/ui-components'

import { ADMIN_GROUP_ID, ANONYMOUS_GROUP_ID } from '../../data/config'

import styles from './user-groups.module.css'

type UserGroupsListProps = {
  groupId: number
  user?: UserData
  onGroupClick: (group: number) => void
}

export function UserGroupsList({ groupId, onGroupClick, user }: UserGroupsListProps) {
  const [groups, setGroups] = useState<UserGroup<number>[]>()
  const [query, setQuery] = useState('')
  const fetchGroups = async () => {
    const userGroups = await GFWAPI.fetch<UserGroup<number>[]>('/auth/user-groups')
    setGroups(userGroups.sort((a, b) => a.name.localeCompare(b.name)))
  }
  useEffect(() => {
    fetchGroups()
  }, [])

  if (!groups || !groups.length) {
    return null
  }

  const visibleGroups = groups
    .filter((group) => {
      if (group.name.toLowerCase() === ADMIN_GROUP_ID) {
        return user?.groups?.some((g) => g.toLowerCase() === ADMIN_GROUP_ID)
      }
      if (group.name.startsWith(BADGES_GROUP_PREFIX)) {
        return user?.groups?.some((g) => g === BADGES_GROUP_ADMIN_ID)
      }
      return (
        !group.default &&
        group.name.toLowerCase() !== ANONYMOUS_GROUP_ID &&
        group.name !== BADGES_GROUP_ADMIN_ID
      )
    })
    .filter((group) => group.name.toLowerCase().includes(query.trim().toLowerCase()))

  return (
    <Fragment>
      <h2 className={styles.title}>Groups</h2>
      <InputText
        type="search"
        value={query}
        placeholder="Search groups"
        onChange={(e) => setQuery(e.target.value)}
        onCleanButtonClick={() => setQuery('')}
        className={styles.search}
      />
      {visibleGroups.length > 0 ? (
        <ul className={styles.list}>
          {visibleGroups.map((group) => {
            return (
              <li key={group.id} className={group.id === groupId ? styles.active : ''}>
                <button className={styles.group} onClick={() => onGroupClick(group.id)}>
                  {group.name}
                </button>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className={styles.empty}>No groups found</p>
      )}
    </Fragment>
  )
}

export default UserGroupsList
