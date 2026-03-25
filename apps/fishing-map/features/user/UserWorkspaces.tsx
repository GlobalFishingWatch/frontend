import { useEffect, useState } from 'react'

import { InputText } from '@globalfishingwatch/ui-components'

import { useAppDispatch } from 'features/app/app.hooks'
import UserWorkspacesPrivate from 'features/user/UserWorkspacesPrivate'
import UserWorkspacesPublic from 'features/user/UserWorkspacesPublic'
import { fetchWorkspaceThunk } from 'features/workspace/workspace.slice'

import styles from './User.module.css'

function UserWorkspaces() {
  const [searchQuery, setSearchQuery] = useState('')
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchWorkspaceThunk({ workspaceId: '' }))
  }, [dispatch])

  const onSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  return (
    <div className={styles.userWorkspaces}>
      <div className={styles.search}>
        <InputText
          type="search"
          value={searchQuery}
          onChange={onSearchQueryChange}
          placeholder="Search"
        />
      </div>
      <UserWorkspacesPrivate searchQuery={searchQuery} />
      <UserWorkspacesPublic searchQuery={searchQuery} />
    </div>
  )
}

export default UserWorkspaces
