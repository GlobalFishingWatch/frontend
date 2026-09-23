import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import { IconButton } from '@globalfishingwatch/ui-components'

import { useSidePanel } from 'features/_map/content-panel/contentPanel.hooks'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import type { UserGuideSlug } from 'features/cms/loaders/user-guide.types'
import { findSectionForSlug } from 'features/help/userGuide.utils'

import styles from './UserGuideLink.module.css'

type UserGuideLinkMode = 'button' | 'link'

type UserGuideLinkProps = {
  slug: UserGuideSlug
  className?: string
  onClick?: () => void
  mode?: UserGuideLinkMode
  children?: ReactNode
}

function UserGuideLink({
  slug,
  className,
  onClick,
  mode = 'button',
  children,
}: UserGuideLinkProps) {
  const { t, i18n } = useTranslation()
  const { openSidePanel } = useSidePanel()
  const sectionMatch = findSectionForSlug(slug)
  const section = sectionMatch?.section ?? 'introduction'
  const subSection = sectionMatch?.subSection
  const articleKey = subSection || section
  const hasArticleLabel = i18n.exists(`userGuide.${articleKey}`)
  const label = children ?? t((t) => t.userGuide.title)

  const handleClick = async () => {
    onClick?.()
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

  if (mode === 'link') {
    return (
      <button type="button" className={cx(styles.textLink, className)} onClick={handleClick}>
        {label}
      </button>
    )
  }

  return (
    <div className={cx(styles.link, className)} onClick={handleClick} role="button" tabIndex={0}>
      <IconButton size="small" icon="help" className={styles.icon} />
      <div className={styles.labelContainer}>
        <span className={styles.label}>{label}</span>
        {hasArticleLabel && (
          <span>{t((t) => t.userGuide[articleKey as keyof typeof t.userGuide])}</span>
        )}
      </div>
    </div>
  )
}

export default UserGuideLink
