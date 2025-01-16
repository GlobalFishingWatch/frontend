import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { InputText } from '@globalfishingwatch/ui-components'

import UserWorkspacesPrivate from 'features/user/UserWorkspacesPrivate'
import UserWorkspacesPublic from 'features/user/UserWorkspacesPublic'

import styles from './User.module.css'

function UserWorkspaces() {
  const [searchQuery, setSearchQuery] = useState('')

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
