import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import { IconButton } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import type {
  UserGuideSectionSlug,
  UserGuideSlug,
  UserGuideSubSectionSlug,
} from 'features/cms/loaders/user-guide.types'
import { CATEGORIES_CONFIG } from 'features/cms/loaders/user-guide.types'
import { useSidePanel } from 'features/content-panel/contentPanel.hooks'

import styles from './UserGuideLink.module.css'

type UserGuideLinkProps = {
  slug: UserGuideSlug
  className?: string
}

function findSectionForSlug(slug: UserGuideSlug): {
  section: UserGuideSectionSlug
  subSection?: UserGuideSubSectionSlug
} {
  if (slug in CATEGORIES_CONFIG) {
    return { section: slug as UserGuideSectionSlug }
  }
  for (const [section, subsections] of Object.entries(CATEGORIES_CONFIG) as [
    UserGuideSectionSlug,
    readonly string[],
  ][]) {
    if (subsections.includes(slug)) {
      return { section, subSection: slug as UserGuideSubSectionSlug }
    }
  }
  return { section: 'introduction' }
}

function UserGuideLink({ slug, className }: UserGuideLinkProps) {
  const { t, i18n } = useTranslation()
  const { openSidePanel } = useSidePanel()
  const { section, subSection } = findSectionForSlug(slug)
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
