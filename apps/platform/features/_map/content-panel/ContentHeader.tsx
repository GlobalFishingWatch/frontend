import type { JSX } from 'react'
import { useTranslation } from 'react-i18next'

import { IconButton } from '@globalfishingwatch/ui-components'

import { useSidePanel } from 'features/_map/content-panel/contentPanel.hooks'

import styles from './ContentHeader.module.css'

type ContentHeaderProps = {
  title?: string | JSX.Element
  onClose?: (e?: React.MouseEvent) => void
}

function ContentHeader({ title, onClose }: ContentHeaderProps) {
  const { t } = useTranslation()
  const { closeSidePanel } = useSidePanel()

  return (
    <div className={styles.sidebarHeader}>
      <div className={styles.labelContainer}>{title || t((t) => t.common.content)}</div>
      <IconButton
        icon="close"
        type="solid"
        aria-label={t((t) => t.common.close)}
        onClick={onClose ? onClose : closeSidePanel}
      />
    </div>
  )
}

export default ContentHeader
