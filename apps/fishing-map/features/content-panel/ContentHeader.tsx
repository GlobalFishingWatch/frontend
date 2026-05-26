import type { JSX } from 'react'
import { useTranslation } from 'react-i18next'

import { IconButton } from '@globalfishingwatch/ui-components'

import { useSidePanel } from 'features/content-panel/contentPanel.hooks'

import styles from './ContentHeader.module.css'

type ContentHeaderProps = {
  title?: string | JSX.Element
}

function ContentHeader({ title }: ContentHeaderProps) {
  const { t } = useTranslation()
  const { closeSidePanel } = useSidePanel()

  return (
    <div className={styles.sidebarHeader}>
      {title || t((t) => t.common.content)}
      <IconButton
        icon="close"
        aria-label={t((t) => t.common.close)}
        onClick={() => closeSidePanel()}
      />
    </div>
  )
}

export default ContentHeader
