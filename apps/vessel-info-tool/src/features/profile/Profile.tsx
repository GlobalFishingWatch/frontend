import { useTranslation } from 'react-i18next'

import type { UserData } from '@globalfishingwatch/api-types'

import styles from './Profile.module.css'
import { Link } from '@tanstack/react-router'

type ProfileProps = {
  user: UserData | null
}

export const Profile = ({ user }: ProfileProps) => {
  const { t } = useTranslation()

  const userInitials = [
    (user?.firstName && user?.firstName?.slice(0, 1)) || '',
    (user?.lastName && user?.lastName?.slice(0, 1)) || '',
  ].join('')

  return (
    <div className="">
      <Link to="/logout" className={styles.button}>
        {/* tooltip={t('logout', 'Log out')} */}
        {userInitials}
      </Link>
    </div>
  )
}

export default Profile
