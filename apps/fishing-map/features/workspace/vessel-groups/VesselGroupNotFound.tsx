import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { Tooltip } from '@globalfishingwatch/ui-components'

import Remove from '../shared/Remove'

import styles from 'features/workspace/shared/LayerPanel.module.css'

function VesselGroupNotFound({ dataview }: { dataview: UrlDataviewInstance }) {
  const { t } = useTranslation()
  return (
    <div className={cx(styles.LayerPanel, 'print-hidden')}>
      <div className={styles.header}>
        <Tooltip content={t('vesselGroup.notFound', 'Vessel group not found')}>
          <h3 className={cx(styles.name, styles.error)}>
            {dataview.config?.filters?.['vessel-groups']?.[0] ||
              t('vesselGroup.notFound', 'Vessel group not found')}
          </h3>
        </Tooltip>
        <div className={styles.actions}>
          <Remove dataview={dataview} />
        </div>
      </div>
    </div>
  )
}

export default VesselGroupNotFound
