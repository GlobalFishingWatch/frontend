import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { trackEvent, TrackCategory } from 'features/app/analytics.hooks'
import styles from './Info.module.css'

interface GuideAndVideoProps {
  source?: string
}
const GuideAndVideo: React.FC<GuideAndVideoProps> = ({ source = '' }): React.ReactElement => {
  const { t } = useTranslation()

  const trackClick = useCallback(
    (link) => {
      trackEvent({
        category: TrackCategory.GeneralVVFeatures,
        action: `User click on ${link}`,
        label: source,
      })
    },
    [source]
  )

  return (
    <div>
      <a
        className={styles.faqButton}
        onClick={() => trackClick('How to Guide')}
        target="_blank"
        href={t('common.howToGuideLink', 'https://www.localized-link-to-guide.com')}
        rel="noreferrer"
      >
        {t('common.howToGuide', 'How to Guide')}
      </a>
      {' | '}
      <a
        className={styles.faqButton}
        onClick={() => trackClick('Basic Video')}
        target="_blank"
        href={t('common.basicVideoLink', 'https://www.localized-link-to-video.com')}
        rel="noreferrer"
      >
        {t('common.basicVideo', 'Basic video')}
      </a>
    </div>
  )
}

export default GuideAndVideo
