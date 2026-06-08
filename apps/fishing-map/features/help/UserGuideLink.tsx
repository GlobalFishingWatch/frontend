import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import { IconButton } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import type { UserGuideSlug } from 'features/cms/loaders/user-guide.types'
import { useSidePanel } from 'features/content-panel/contentPanel.hooks'
import { findSectionForSlug } from 'features/help/userGuide.utils'

import styles from './UserGuideLink.module.css'

type UserGuideLinkProps = {
  slug: UserGuideSlug
  className?: string
}

function UserGuideLink({ slug, className }: UserGuideLinkProps) {
  const { t, i18n } = useTranslation()
  const { openSidePanel } = useSidePanel()
  const sectionMatch = findSectionForSlug(slug)
  const section = sectionMatch?.section ?? 'introduction'
  const subSection = sectionMatch?.subSection

  const handleClick = async () => {
    openSidePanel({
      type: 'userGuide',
      id: section,
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
        <span>{t((t) => t.userGuide[(subSection || section) as keyof typeof t.userGuide])}</span>
      </div>
    </div>
  )
}

export default UserGuideLink
