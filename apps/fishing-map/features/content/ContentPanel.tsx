import type { ReactNode } from 'react'
import cx from 'classnames'

import ContentHeader from 'features/content/ContentHeader'

import styles from './ContentPanel.module.css'

type ContentPanelProps = {
  children: ReactNode
  title?: string
  sidePanelId?: string
}

function ContentPanel({ sidePanelId, title, children }: ContentPanelProps) {
  return (
    <div
      className={cx(
        styles.container,
        sidePanelId?.includes('userGuide') && styles.userGuideBackground
      )}
    >
      <div className={cx(styles.header)}>
        <ContentHeader />
      </div>
      <div className={cx(styles.scrollContainer)}>
        <div className={cx(styles.content)}>
          <h2>{title}</h2>
          {children}
        </div>
      </div>
      <div className={cx(styles.userGuideBackground)}></div>
    </div>
  )
}

export default ContentPanel
