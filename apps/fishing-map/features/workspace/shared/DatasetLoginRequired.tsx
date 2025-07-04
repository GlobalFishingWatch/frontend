import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { IconButton, Tooltip } from '@globalfishingwatch/ui-components'

import LoginButtonWrapper from 'routes/LoginButtonWrapper'

import styles from 'features/workspace/shared/LayerPanel.module.css'

function DatasetLoginRequired({ dataview }: { dataview: UrlDataviewInstance }) {
  const { t } = useTranslation()
  return (
    <div className={cx(styles.LayerPanel, 'print-hidden')}>
      <div className={styles.header}>
        <Tooltip content={t('dataset.login')}>
          <h3 className={cx(styles.name, styles.error)}>
            {dataview.datasetsConfig?.[0]?.datasetId || t('errors.datasetNotFound')}
          </h3>
        </Tooltip>
        <div className={styles.actions}>
          <LoginButtonWrapper>
            <IconButton
              icon="user"
              size="small"
              tooltip={t('dataset.login')}
              tooltipPlacement="top"
            />
          </LoginButtonWrapper>
        </div>
      </div>
    </div>
  )
}

export default DatasetLoginRequired
