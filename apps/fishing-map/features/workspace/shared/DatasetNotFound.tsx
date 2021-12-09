import React from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { IconButton } from '@globalfishingwatch/ui-components'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import styles from 'features/workspace/shared/LayerPanel.module.css'
import Remove from '../common/Remove'

function DatasetNotFound({ dataview }: { dataview: UrlDataviewInstance }) {
  const { t } = useTranslation()
  return (
    <div className={cx(styles.LayerPanel, 'print-hidden')}>
      <div className={styles.header}>
        <h3 className={cx(styles.name)}>
          {dataview.datasetsConfig?.[0]?.datasetId ||
            t('errors.datasetNotFound', 'Dataset not found')}
        </h3>
        <div className={cx('print-hidden', styles.actions)}>
          <IconButton
            icon="warning"
            type="warning"
            size="small"
            tooltip={t('errors.datasetNotFound', 'Dataset not found')}
            tooltipPlacement="top"
          />
          <Remove dataview={dataview} />
        </div>
      </div>
    </div>
  )
}

export default DatasetNotFound
