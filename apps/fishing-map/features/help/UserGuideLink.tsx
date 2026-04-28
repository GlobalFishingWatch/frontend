import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import { IconButton } from '@globalfishingwatch/ui-components'

import { useSidePanel } from 'features/content/contentPanel.hooks'

import styles from './UserGuideLink.module.css'

type UserGuideLinkProps = {
  section: string
  className?: string
}

function UserGuideLink({ section, className }: UserGuideLinkProps) {
  const { t } = useTranslation()
  const { openSidePanel } = useSidePanel()

  const handleClick = () => {
    openSidePanel({ type: 'userGuide', id: section })
  }

  return (
    <div className={cx(styles.link, className)} onClick={handleClick} role="button" tabIndex={0}>
      <IconButton size="small" icon="help" className={styles.icon} />
      <div>
        <span className={styles.label}>{t((t) => t.userGuide.title)}</span>
        <span>{t((t) => t.userGuide[section])}</span>
      </div>
    </div>
  )
}

export default UserGuideLink
