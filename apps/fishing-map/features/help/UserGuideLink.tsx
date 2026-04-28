import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import { IconButton } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useSidePanel } from 'features/content/contentPanel.hooks'

import styles from './UserGuideLink.module.css'

export type UserGuideSection =
  | 'uploadData'
  | 'uploadPolygons'
  | 'uploadTracks'
  | 'uploadPoints'
  | 'analysis'
  | 'downloadActivity'
  | 'vesselSearch'
  | 'vesselGroups'
  | 'activityFishing'
  | 'activityPresence'
  | 'activityFilters'
  | 'detectionsSAR'
  | 'detectionsVIIRS'

type UserGuideLinkProps = {
  section: UserGuideSection
  className?: string
}

function UserGuideLink({ section, className }: UserGuideLinkProps) {
  const { t, i18n } = useTranslation()
  const { openSidePanel } = useSidePanel()

  const handleClick = () => {
    trackEvent({
      category: TrackCategory.HelpHints,
      action: `redirect to user guide to specific section`,
      label: `${i18n.language} - ${section}`,
    })
    openSidePanel({ type: 'userGuide', id: section })
  }
  return (
    <button className={cx(styles.link, className)} onClick={handleClick} type="button">
      <IconButton size="small" icon="help" className={styles.icon} />{' '}
      <div>
        <label className={styles.label}>{t((t) => t.userGuide.title)}</label>
        <span>{t((t) => t.userGuide[section])}</span>
      </div>
    </button>
  )
}

export default UserGuideLink
