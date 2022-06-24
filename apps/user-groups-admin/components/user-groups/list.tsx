import React, { Fragment, useEffect, useState } from 'react'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { UserGroup } from '@globalfishingwatch/api-types'
import styles from './user-groups.module.css'

type UserGroupsListProps = { groupId: number; onGroupClick: (group: number) => void }
export function UserGroupsList({ groupId, onGroupClick }: UserGroupsListProps) {
  const [groups, setGroups] = useState<UserGroup[]>()
  const fetchGroups = async () => {
    const userGroups = await GFWAPI.fetch<UserGroup[]>('/auth/user-group')
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
          ?.filter(
            (g) =>
              !g.default &&
              g.name.toLowerCase() !== 'anonymous' &&
              g.name.toLowerCase() !== 'admin-group'
          )
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
