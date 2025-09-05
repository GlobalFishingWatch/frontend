import type { UserData } from '@globalfishingwatch/api-types'
import { Button } from '@globalfishingwatch/ui-components'

import styles from './Profile.module.css'

interface ProfileProps {
  user: UserData
}
export const Profile = ({ user }: ProfileProps) => {
  const userInitials = [
    (user?.firstName && user?.firstName?.slice(0, 1)) || '',
    (user?.lastName && user?.lastName?.slice(0, 1)) || '',
  ].join('')

  return (
    <div className="">
      <Button
        className={styles.button}
        type="secondary"
        onClick={() => console.log('Profile button clicked')}
      >
        {userInitials}
      </Button>
    </div>
  )
}

export default Profile
