import { useMemo } from 'react'
import cx from 'classnames'

import ContentHeader from 'features/content/ContentHeader'
import { htmlSafeParse } from 'utils/html-parser'

import styles from './ContentPanel.module.css'

type ContentPanelProps = {
  children: string
  title?: string
  sidePanelId?: string
}

function ContentPanel({ sidePanelId, title, children }: ContentPanelProps) {
  const content = useMemo(() => {
    if (!sidePanelId || !children) return null
    return htmlSafeParse(children)
  }, [children, sidePanelId])

  return (
    <div
      className={cx(
        styles.container,
        sidePanelId?.includes('user-guide') && styles.userGuideBackground
      )}
    >
      <div className={cx(styles.header)}>
        <ContentHeader />
      </div>
      <div className={cx(styles.scrollContainer)}>
        <div className={cx(styles.content)}>
          <h2>{title}</h2>
          {content}
        </div>
      </div>
      <div className={cx(styles.userGuideBackground)}></div>
    </div>
  )
}

export default ContentPanel
