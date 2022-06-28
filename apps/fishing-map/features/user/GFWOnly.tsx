import { useTranslation } from 'react-i18next'
import styles from './GFWOnly.module.css'

function DownloadTrackModalTitle() {
  const { t } = useTranslation()
  return (
    <span className={styles.GFWOnly}>
      🐠 {t('common.onlyVisibleForGFW', 'Only visible for GFW users')}
    </span>
  )
}

export default DownloadTrackModalTitle
