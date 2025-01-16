import { Fragment, useState } from 'react'
import type { NextPage } from 'next'

import UserGroupDetail from '../components/user-groups/Detail'
import UserGroupsList from '../components/user-groups/List'

import styles from './app.module.css'

const Home: NextPage = ({ login }: any) => {
  const [groupId, setGroupId] = useState<number | undefined>()
  return (
    <Fragment>
      <aside className={styles.aside}>
        <UserGroupsList groupId={groupId as number} onGroupClick={setGroupId} user={login.user} />
      </aside>
      <main className={styles.main}>{groupId && <UserGroupDetail groupId={groupId} />}</main>
    </Fragment>
  )
}

export default Home
