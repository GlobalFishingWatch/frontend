import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { trackEvent, TrackCategory } from 'features/app/analytics.hooks'
import styles from './Info.module.css'

interface FaqProps {
  source?: string
}
const Faq: React.FC<FaqProps> = ({ source = '' }): React.ReactElement => {
  const { t } = useTranslation()

  const trackClick = useCallback(() => {
    trackEvent({
      category: TrackCategory.GeneralVVFeatures,
      action: "User click on FAQ's",
      label: source,
    })
  }, [source])
  return (
    <div>
      <a
        className={styles.faqButton}
        onClick={trackClick}
        target="_blank"
        href={t('common.faqLink', 'https://www.localized-link-to-faqs.com')}
        rel="noreferrer"
      >
        {t('common.faq', "FAQ's")}
      </a>
    </div>
  )
}

export default Faq
