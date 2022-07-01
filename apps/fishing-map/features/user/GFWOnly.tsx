import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Icon } from '@globalfishingwatch/ui-components'
import { isGFWUser } from 'features/user/user.slice'
import styles from './GFWOnly.module.css'

interface GFWOnlyProps {
  type?: 'default' | 'only-icon'
}

function GFWOnly(props: GFWOnlyProps) {
  const { type = 'default' } = props
  const { t } = useTranslation()
  const gfwUser = useSelector(isGFWUser)
  if (!gfwUser) return
  if (type === 'only-icon')
    return (
      <Icon
        tooltip={t('common.onlyVisibleForGFW', 'Only visible for GFW users')}
        style={{ transform: 'translateY(25%)' }}
        icon="gfw-logo"
        type="original-colors"
      />
    )
  return (
    <span className={styles.GFWOnly}>
      <Icon style={{ transform: 'translateY(25%)' }} icon="gfw-logo" type="original-colors" />
      {t('common.onlyVisibleForGFW', 'Only visible for GFW users')}
    </span>
  )
}

export default GFWOnly
