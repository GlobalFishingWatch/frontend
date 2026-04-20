import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import { IconButton } from '@globalfishingwatch/ui-components'

import { useReplaceQueryParams } from 'router/routes.hook'

import styles from './ContentHeader.module.css'

type ContentHeaderProps = {
  title?: string
  openTableOfContents?: () => void
}

function ContentHeader({ title, openTableOfContents }: ContentHeaderProps) {
  const { t } = useTranslation()
  const { replaceQueryParams } = useReplaceQueryParams()

  return (
    <div className={cx(styles.sticky)}>
      <div className={cx(styles.sidebarHeader)}>
        <h2>
          {openTableOfContents && (
            <IconButton icon="list" onClick={() => openTableOfContents()} />
          )}
          {title || t((t) => t.content.userGuide)}
        </h2>
        <div>
          <IconButton
            icon="close"
            aria-label={t((t) => t.common.close)}
            onClick={() =>
              replaceQueryParams({ sidePanelId: undefined, sidePanelContent: undefined })
            }
          />
        </div>
      </div>
    </div>
  )
}

export default ContentHeader
