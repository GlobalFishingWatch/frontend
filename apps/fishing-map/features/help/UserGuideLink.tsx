import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import { IconButton } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { strapiApi } from 'features/cms/loaders'
import { useSidePanel } from 'features/content-panel/contentPanel.hooks'

import styles from './UserGuideLink.module.css'

export const USER_GUIDE_SECTIONS = [
  'uploading-data',
  'analysis-and-dynamic-reports',
  'activity-fishing',
  'activity-vessel-presence',
] as const

export const USER_GUIDE_SUB_SECTIONS = [
  'downloading-data',
  'vessel-search',
  'vessel-groups',
  'filtering-activity-layers',
  'detections-sar',
  'detections-viirs',
] as const

export type UserGuideSection =
  | (typeof USER_GUIDE_SECTIONS)[number]
  | (typeof USER_GUIDE_SUB_SECTIONS)[number]

type UserGuideLinkProps = {
  section: UserGuideSection
  className?: string
}

function UserGuideLink({ section, className }: UserGuideLinkProps) {
  const { t, i18n } = useTranslation()
  const { openSidePanel } = useSidePanel()

  const handleClick = async () => {
    const subSection = USER_GUIDE_SUB_SECTIONS.includes(
      section as (typeof USER_GUIDE_SUB_SECTIONS)[number]
    )
      ? section
      : undefined

    let contentId: string
    if (subSection) {
      contentId = await strapiApi.userGuide
        .getContentFromSubcontentId({
          data: { slug: subSection, locale: i18n.language },
        })
        .then((res) => {
          return res.data?.[0]?.slug || ''
        })
    } else {
      contentId = section
    }
    openSidePanel({
      type: 'userGuide',
      id: contentId,
      subcontentId: subSection,
    })
    trackEvent({
      category: TrackCategory.HelpHints,
      action: `redirect to user guide to specific section`,
      label: `${i18n.language} - ${section}`,
    })
  }

  return (
    <div className={cx(styles.link, className)} onClick={handleClick} role="button" tabIndex={0}>
      <IconButton size="small" icon="help" className={styles.icon} />
      <div className={styles.labelContainer}>
        <span className={styles.label}>{t((t) => t.userGuide.title)}</span>
        <span>{t((t) => t.userGuide[section])}</span>
      </div>
    </div>
  )
}

export default UserGuideLink
