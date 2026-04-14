import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { IconButton } from '@globalfishingwatch/ui-components'

import { useReplaceQueryParams } from 'router/routes.hook'
import { selectSidePanelContent } from 'router/routes.selectors'

import styles from './ContentHeader.module.css'

type ContentHeaderProps = {
  title?: string
  openTableOfContents?: () => void
}

function ContentHeader({ title, openTableOfContents }: ContentHeaderProps) {
  const { t } = useTranslation()
  const { replaceQueryParams } = useReplaceQueryParams()
  const contentType = useSelector(selectSidePanelContent)

  return (
    <div className={cx(styles.sticky)}>
      <div className={cx(styles.sidebarHeader)}>
        <h2>{title || contentType}</h2>
        <div>
          {contentType === 'userGuide' && openTableOfContents && (
            <IconButton icon="menu" onClick={() => openTableOfContents && openTableOfContents()} />
          )}
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
