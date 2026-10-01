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
      <div className={styles.labelContainer}>{title || t((t) => t.common.content)}</div>
    </div>
  )
}

export default ContentHeader
