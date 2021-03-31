import React from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import styles from 'features/workspace/shared/LayerPanel.module.css'
import { useDataviewInstancesConnect } from '../workspace.hook'

function DatasetNotFound({ dataview }: { dataview: UrlDataviewInstance }) {
  const { deleteDataviewInstance } = useDataviewInstancesConnect()
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
            className={styles.actionButton}
            tooltip={t('errors.datasetNotFound', 'Dataset not found')}
            tooltipPlacement="top"
          />
          <IconButton
            icon="delete"
            size="small"
            tooltip={t('layer.remove', 'Remove layer')}
            tooltipPlacement="top"
            onClick={() => deleteDataviewInstance(dataview.id)}
            className={cx(styles.actionButton)}
          />
        </div>
      </div>
    </div>
  )
}

export default DatasetNotFound
