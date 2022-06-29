import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { isGFWUser } from 'features/user/user.slice'
import styles from './GFWOnly.module.css'

function GFWOnly() {
  const { t } = useTranslation()
  const gfwUser = useSelector(isGFWUser)
  return gfwUser ? (
    <span className={styles.GFWOnly}>
      🐟 {t('common.onlyVisibleForGFW', 'Only visible for GFW users')}
    </span>
  ) : null
}

export default GFWOnly
