import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import { IconButton } from '@globalfishingwatch/ui-components'

import { useSidePanel } from 'features/content/contentPanel.hooks'

import styles from './ContentHeader.module.css'

type ContentHeaderProps = {
  title?: string
  openTableOfContents?: () => void
}

function ContentHeader({ title, openTableOfContents }: ContentHeaderProps) {
  const { t } = useTranslation()
  const { closeSidePanel } = useSidePanel()

  return (
    <div className={cx(styles.sticky)}>
      <div className={cx(styles.sidebarHeader)}>
        <h2 className={cx(styles.title)}>
          {openTableOfContents && <IconButton icon="list" onClick={() => openTableOfContents()} />}
          {title || t((t) => t.common.content)}
        </h2>
        <div>
          <IconButton
            icon="close"
            aria-label={t((t) => t.common.close)}
            onClick={() => closeSidePanel()}
          />
        </div>
      </div>
    </div>
  )
}

export default ContentHeader
