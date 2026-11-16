import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { InputText } from '@globalfishingwatch/ui-components/input-text'
import { PIPE_4_WORKSPACE_ID } from '@platform/config/map/workspaces'

import { fetchWorkspacesThunk } from 'features/_map/workspaces-list/workspaces-list.slice'
import { selectUserData } from 'features/_user/selectors/user.selectors'
import UserWorkspacesArchive from 'features/_user/UserWorkspacesArchive'
import UserWorkspacesPrivate from 'features/_user/UserWorkspacesPrivate'
import UserWorkspacesPublic from 'features/_user/UserWorkspacesPublic'
import { useAppDispatch } from 'features/app/app.hooks'

import styles from './User.module.css'

function UserWorkspaces() {
  const dispatch = useAppDispatch()
  const userId = useSelector(selectUserData)?.id
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (userId) {
      dispatch(fetchWorkspacesThunk({}))
      dispatch(fetchWorkspacesThunk({ ids: [PIPE_4_WORKSPACE_ID] }))
    }
  }, [dispatch, userId])

  const onSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  return (
    <div className={styles.userWorkspaces}>
      <div className={styles.search}>
        <InputText
          className={styles.searchInput}
          type="search"
          value={searchQuery}
          onChange={onSearchQueryChange}
          placeholder="Search"
        />
      </div>
      <UserWorkspacesPrivate searchQuery={searchQuery} />
      <UserWorkspacesPublic searchQuery={searchQuery} />
      <UserWorkspacesArchive searchQuery={searchQuery} />
    </div>
  )
}

export default UserWorkspaces
