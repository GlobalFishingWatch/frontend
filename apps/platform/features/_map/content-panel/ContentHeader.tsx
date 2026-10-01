import type { JSX } from 'react'
import { useTranslation } from 'react-i18next'

import styles from './ContentHeader.module.css'

type ContentHeaderProps = {
  title?: string | JSX.Element
}

function ContentHeader({ title }: ContentHeaderProps) {
  const { t } = useTranslation()

  return (
    <div className={styles.sidebarHeader}>
      <span className={styles.labelContainer}>{title || t((t) => t.common.content)}</span>
    </div>
  )
}

export default ContentHeader
