import { useTranslation } from 'react-i18next'

import { Button } from '@globalfishingwatch/ui-components'

import styles from './VesselRateLimitDisclaimer.module.css'

type VesselRateLimitDisclaimerProps = {
  verifying: boolean
  onVerify: () => void
}

// Replaces every profile section, data loaded before the limit was hit is hidden too
function VesselRateLimitDisclaimer({ verifying, onVerify }: VesselRateLimitDisclaimerProps) {
  const { t } = useTranslation()
  return (
    <div className={styles.disclaimer}>
      <p className={styles.message}>{t((t) => t.rateLimit.profileActivity)}</p>
      <Button loading={verifying} onClick={onVerify}>
        {t((t) => t.rateLimit.verify)}
      </Button>
    </div>
  )
}

export default VesselRateLimitDisclaimer
