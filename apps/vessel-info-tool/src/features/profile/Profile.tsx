import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { Route } from '@/routes/_auth/index'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { Button } from '@globalfishingwatch/ui-components'

import styles from './Profile.module.css'

export const Profile = () => {
  const { t } = useTranslation()
  const { user } = Route.useLoaderData()

  const handleLogoutClick = useCallback(() => {
    GFWAPI.logout().then(() => {
      window.location.reload()
    })
  }, [])

  const userInitials = [
    (user?.firstName && user?.firstName?.slice(0, 1)) || '',
    (user?.lastName && user?.lastName?.slice(0, 1)) || '',
  ].join('')

  return (
    <div className="">
      <Button
        className={styles.button}
        type="secondary"
        onClick={handleLogoutClick}
        tooltip={t('logout', 'Log out')}
      >
        {userInitials}
      </Button>
    </div>
  )
}

export default Profile
