import { useTranslation } from 'react-i18next'

import { IS_DEVELOPMENT_ENV } from 'data/map/config'

import styles from './HelpHubError.module.css'

function HelpHubError({ error, className }: { error: string; className?: string }) {
  const { t } = useTranslation()
  return (
    <p className={className} role="alert">
      {t((s) => s.errors.genericShort)}
      {IS_DEVELOPMENT_ENV && <span className={styles.detail}>{error}</span>}
    </p>
  )
}

export default HelpHubError
