import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { Tooltip } from '@globalfishingwatch/ui-components'

import styles from 'features/workspace/shared/LayerPanel.module.css'

import Remove from '../common/Remove'

function DatasetNotFound({ dataview }: { dataview: UrlDataviewInstance }) {
  const { t } = useTranslation()
  return (
    <div className={cx(styles.LayerPanel, 'print-hidden')}>
      <div className={styles.header}>
        <Tooltip content={t('errors.datasetNotFound', 'Dataset not found')}>
          <h3 className={cx(styles.name, styles.error)}>
            {dataview.datasetsConfig?.[0]?.datasetId ||
              t('errors.datasetNotFound', 'Dataset not found')}
          </h3>
        </Tooltip>
        <div className={styles.actions}>
          <Remove dataview={dataview} />
        </div>
      </div>
    </div>
  )
}

export default DatasetNotFound
