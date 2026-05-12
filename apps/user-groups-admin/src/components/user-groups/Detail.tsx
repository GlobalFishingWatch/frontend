import React, { Fragment, useCallback, useEffect, useState } from 'react'
import sortBy from 'lodash/sortBy'

import { GFWAPI } from '@globalfishingwatch/api-client'
import type { FutureUserData, UserData, UserGroup } from '@globalfishingwatch/api-types'
import { Button, IconButton, InputText, Spinner } from '@globalfishingwatch/ui-components'

import styles from './user-groups.module.css'

export function UserGroupDetail({ groupId, user }: { groupId: number; user: UserData }) {
  const [userLoading, setUserLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [invitationNotes, setInvitationNotes] = useState('')
  const [group, setGroup] = useState<UserGroup>()
  const [futureUsers, setFutureUsers] = useState<FutureUserData[]>()

  const fetchGroup = useCallback(async (groupId: number) => {
    setLoading(true)
    try {
      const group = await GFWAPI.fetch<UserGroup>(`/auth/user-groups/${groupId}?include-users=true`)
      setGroup({ ...group, users: sortBy(group.users, 'email') })
    } catch (e) {
      console.warn(e)
    }
    try {
      const futureUsers = await GFWAPI.fetch<FutureUserData[]>(
        `/auth/future-users?user-group=${groupId}`
      )
      setFutureUsers(sortBy(futureUsers, 'email'))
    } catch (e) {
      console.warn(e)
    }
    setLoading(false)
  }, [])

  const onAddUserClick = async () => {
    const inviterName = [user?.firstName, user?.lastName].filter(Boolean).join(' ')
    const date = new Date().toISOString().slice(0, 10)
    const formattedNotes = invitationNotes
      ? `${inviterName}: ${invitationNotes} (${date})`
      : undefined
    const users = await GFWAPI.fetch<UserData[]>(`/auth/users?email=${encodeURIComponent(email)}`)
    if (users.length === 1) {
      const userId = users[0]?.id
      await GFWAPI.fetch<UserGroup>(`/auth/user-groups/${groupId}/user/${userId}`, {
        method: 'POST',
        body: formattedNotes ? ({ invitationNotes: formattedNotes } as any) : undefined,
      })
    } else {
      await GFWAPI.fetch<UserGroup>(`/auth/future-users?merge=true`, {
        method: 'POST',
        body: {
          email,
          userGroupIds: [groupId],
          ...(formattedNotes && { invitationNotes: formattedNotes }),
        } as any,
      })
    }
    setEmail('')
    setInvitationNotes('')
    fetchGroup(groupId)
  }

  useEffect(() => {
    setLoading(true)
    fetchGroup(groupId)
    return () => {
      setEmail('')
      setInvitationNotes('')
      setGroup(undefined)
      setFutureUsers(undefined)
    }
  }, [fetchGroup, groupId])

  const onRemoveUserClick = async (id: number) => {
    const confirmation = window.confirm('Are you sure you want to remove the user from this group?')
    if (confirmation) {
      setUserLoading(true)
      await GFWAPI.fetch<UserGroup>(`/auth/user-groups/${groupId}/user/${id}`, {
        method: 'DELETE',
      })
      setUserLoading(false)
      fetchGroup(groupId)
    }
  }

  const onDownloadCsvClick = () => {
    const rows = [['Email', 'First Name', 'Last Name', 'Status', 'Notes']]
    group?.users?.forEach((u) =>
      rows.push([
        u.email ?? '',
        u.firstName ?? '',
        u.lastName ?? '',
        'active',
        u.invitationNotes ?? '',
      ])
    )
    futureUsers?.forEach((u) => rows.push([u.email, '', '', 'invited', u.invitationNotes ?? '']))
    const csv = rows.map((r) => r.map((v) => `"${v}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${group?.name ?? 'group'}-users.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const onRemoveFutureUserClick = async (futureUserId: number) => {
    const confirmation = window.confirm(
      'Are you sure you want to permanently delete this invitation?'
    )
    if (confirmation) {
      setUserLoading(true)
      await GFWAPI.fetch<UserGroup>(`/auth/future-users/${futureUserId}`, {
        method: 'DELETE',
      })
      setUserLoading(false)
      fetchGroup(groupId)
    }
  }
  if (!group || loading) {
    return <Spinner />
  }

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{group.name}</h1>
          <p className={styles.description}>{group.description}</p>
        </div>
        <IconButton tooltip="Download CSV" icon="download" onClick={onDownloadCsvClick} />
      </div>
      <h2 className={[styles.subTitle, styles.content].join(' ')}>Users</h2>
      {group && (
        <div className={styles.content}>
          {group?.users && group?.users?.length > 0 ? (
            <ul className={styles.list}>
              {group?.users.map((user) => {
                return (
                  <li key={user.id}>
                    {user.firstName} {user.lastName} ({user.email})
                    {user.invitationNotes && (
                      <span className={styles.invitationNotes}>{user.invitationNotes}</span>
                    )}
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
          {futureUsers && futureUsers?.length > 0 && (
            <Fragment>
              <h3 className={styles.subTitle}>Invited Users</h3>
              <ul className={styles.list}>
                {futureUsers?.map((futureUser) => {
                  return (
                    <li key={futureUser.id}>
                      {futureUser.email}
                      {futureUser.invitationNotes && (
                        <span className={styles.invitationNotes}>{futureUser.invitationNotes}</span>
                      )}
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
        </div>
      )}
      <div className={styles.content}>
        <h2 className={styles.subTitle}>Invitations</h2>
        <div className={styles.inputsContainer}>
          <InputText
            className={styles.input}
            label="User email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputText
            className={styles.input}
            label="Invitation notes"
            placeholder="Note event name, date, type and user access purpose"
            value={invitationNotes}
            onChange={(e) => setInvitationNotes(e.target.value)}
          />
        </div>
        <Button className={styles.button} onClick={onAddUserClick}>
          Add user
        </Button>
      </div>
    </div>
  )
}

export default UserGroupDetail
