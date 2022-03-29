import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { Button, IconButton, InputText, Spinner } from '@globalfishingwatch/ui-components'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { FutureUserData, UserData, UserGroup } from '@globalfishingwatch/api-types'
import styles from './user-groups.module.css'

export function UserGroupDetail({ groupId }: { groupId: number }) {
  const [userLoading, setUserLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [group, setGroup] = useState<UserGroup>()
  const [futureUsers, setFutureUsers] = useState<FutureUserData[]>()

  const fetchGroup = useCallback(async (groupId: number) => {
    setLoading(true)
    const group = await GFWAPI.fetch<UserGroup>(`/auth/user-group/${groupId}`)
    const futureUsers = await GFWAPI.fetch<FutureUserData[]>(
      `/auth/future-user?user-group=${groupId}`
    )
    setGroup(group)
    setFutureUsers(futureUsers)
    setLoading(false)
  }, [])

  const onAddUserClick = async () => {
    const users = await GFWAPI.fetch<UserData[]>(`/auth/user?email=${email}`)
    if (users.length === 1) {
      const userId = users[0]?.id
      await GFWAPI.fetch<UserGroup>(`/auth/user-group/${groupId}/user/${userId}`, {
        method: 'POST',
      })
    } else {
      await GFWAPI.fetch<UserGroup>(`/auth/future-user?merge=true`, {
        method: 'POST',
        body: {
          email,
          userGroupIds: [groupId],
        } as any,
      })
    }
    setEmail('')
    fetchGroup(groupId)
  }

  useEffect(() => {
    setLoading(true)
    fetchGroup(groupId)
    return () => {
      setEmail('')
      setGroup(undefined)
    }
  }, [fetchGroup, groupId])

  const onRemoveUserClick = async (id: number) => {
    const confirmation = window.confirm('Are you sure you want to permanently delete this user?')
    if (confirmation) {
      setUserLoading(true)
      await GFWAPI.fetch<UserGroup>(`/auth/user-group/${groupId}/user/${id}`, {
        method: 'DELETE',
      })
      setUserLoading(false)
      fetchGroup(groupId)
    }
  }

  const onRemoveFutureUserClick = async (futureUserId: number) => {
    const confirmation = window.confirm(
      'Are you sure you want to permanently delete this invitation?'
    )
    if (confirmation) {
      setUserLoading(true)
      await GFWAPI.fetch<UserGroup>(`/auth/future-user/${futureUserId}`, {
        method: 'DELETE',
      })
      setUserLoading(false)
      fetchGroup(groupId)
    }
  }

  return (
    <Fragment>
      <h2 className={[styles.title, styles.content].join(' ')}>
        Users {group ? `in the ${group.name} group` : ''}
      </h2>
      {!group && loading && <Spinner />}
      {group && (
        <div className={styles.content}>
          {group?.users?.length > 0 ? (
            <ul className={styles.list}>
              {group?.users.map((user) => {
                return (
                  <li key={user.id}>
                    {user.firstName} ({user.email})
                    <IconButton
                      disabled={userLoading}
                      icon="delete"
                      onClick={() => onRemoveUserClick(user.id)}
                    />
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className={styles.list}>No users added yet</p>
          )}
          {futureUsers?.length > 0 && (
            <Fragment>
              <h3 className={styles.subTitle}>Invited Users</h3>
              <ul className={styles.list}>
                {futureUsers?.map((futureUser) => {
                  return (
                    <li key={futureUser.id}>
                      {futureUser.email}
                      {futureUser.groups?.length > 1 && (
                        <span>
                          (already invited in {futureUser.groups.map((g) => g.name).join(',')})
                        </span>
                      )}
                      <IconButton
                        disabled={userLoading}
                        icon="delete"
                        onClick={() => onRemoveFutureUserClick(futureUser.id)}
                      />
                    </li>
                  )
                })}
              </ul>
            </Fragment>
          )}
          <InputText
            className={styles.input}
            label="User email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button className={styles.button} onClick={onAddUserClick}>
            Add user
          </Button>
        </div>
      )}
    </Fragment>
  )
}

export default UserGroupDetail
