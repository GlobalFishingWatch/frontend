import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { IconButton, Tooltip } from '@globalfishingwatch/ui-components'

import styles from 'features/workspace/shared/LayerPanel.module.css'
import LoginButtonWrapper from 'routes/LoginButtonWrapper'

function DatasetLoginRequired({ dataview }: { dataview: UrlDataviewInstance }) {
  const { t } = useTranslation()
  return (
    <div className={cx(styles.LayerPanel, 'print-hidden')}>
      <div className={styles.header}>
        <Tooltip content={t('dataset.login', 'This is a private dataset, login to see it')}>
          <h3 className={cx(styles.name, styles.error)}>
            {dataview.datasetsConfig?.[0]?.datasetId ||
              t('errors.datasetNotFound', 'Dataset not found')}
          </h3>
        </Tooltip>
        <div className={styles.actions}>
          <LoginButtonWrapper>
            <IconButton
              icon="user"
              size="small"
              tooltip={t('dataset.login', 'This is a private dataset, login to see it')}
              tooltipPlacement="top"
            />
          </LoginButtonWrapper>
        </div>
      </div>
    </div>
  )
}

export default DatasetLoginRequired
