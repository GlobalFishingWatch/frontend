import React, { Fragment, useEffect, useState } from 'react'
import { GFWAPI } from '@globalfishingwatch/api-client'
import type { UserData, UserGroup } from '@globalfishingwatch/api-types'
import { ADMIN_GROUP_ID, ANONYMOUS_GROUP_ID } from '../../data/config'
import styles from './user-groups.module.css'

type UserGroupsListProps = {
  groupId: number
  user?: UserData
  onGroupClick: (group: number) => void
}

export function UserGroupsList({ groupId, onGroupClick, user }: UserGroupsListProps) {
  const [groups, setGroups] = useState<UserGroup[]>()
  const fetchGroups = async () => {
    const userGroups = await GFWAPI.fetch<UserGroup[]>('/auth/user-groups')
    setGroups(userGroups.sort((a, b) => a.name.localeCompare(b.name)))
  }
  useEffect(() => {
    fetchGroups()
  }, [])

  if (!groups || !groups.length) {
    return null
  }

  return (
    <Fragment>
      <h2 className={styles.title}>Groups</h2>
      <ul className={styles.list}>
        {groups
          ?.filter((group) => {
            if (group.name.toLowerCase() === ADMIN_GROUP_ID) {
              return user?.groups?.some((g) => g.toLowerCase() === ADMIN_GROUP_ID)
            }
            return !group.default && group.name.toLowerCase() !== ANONYMOUS_GROUP_ID
          })
          ?.map((group) => {
            return (
              <li key={group.id} className={group.id === groupId ? styles.active : ''}>
                <button className={styles.group} onClick={() => onGroupClick(group.id)}>
                  {group.name}
                </button>
              </li>
            )
          })}
      </ul>
    </Fragment>
  )
}

export default UserGroupsList
