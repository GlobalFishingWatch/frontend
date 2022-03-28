import React, { Fragment, useEffect, useState } from 'react'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { UserGroup } from '@globalfishingwatch/api-types'
import styles from './user-groups.module.css'

type UserGroupsListProps = { groupId: number; onGroupClick: (group: number) => void }
export function UserGroupsList({ groupId, onGroupClick }: UserGroupsListProps) {
  const [groups, setGroups] = useState<UserGroup[]>()
  const fetchGroups = async () => {
    const userGroups = await GFWAPI.fetch<UserGroup[]>('/auth/user-group')
    setGroups(userGroups)
  }
  useEffect(() => {
    fetchGroups()
  }, [])

  if (!groups) {
    return null
  }

  return (
    <Fragment>
      <h2 className={styles.title}>Groups</h2>
      <ul className={styles.list}>
        {groups
          ?.filter((g) => !g.default && g.name.toLowerCase() !== 'anonymous')
          ?.map((group) => {
            return (
              <li className={group.id === groupId ? styles.active : ''}>
                <button key={group.id} onClick={() => onGroupClick(group.id)}>
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
