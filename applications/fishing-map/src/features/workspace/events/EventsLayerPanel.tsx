import React from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { DatasetTypes } from '@globalfishingwatch/api-types'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import Tooltip from '@globalfishingwatch/ui-components/dist/tooltip'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import styles from 'features/workspace/shared/LayerPanel.module.css'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import DatasetNotFound from '../shared/DatasetNotFound'
import LayerSwitch from '../common/LayerSwitch'
import Title from '../common/Title'

type LayerPanelProps = {
  dataview: UrlDataviewInstance
}

function LayerPanel({ dataview }: LayerPanelProps): React.ReactElement {
  const { t } = useTranslation()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()

  const layerActive = dataview?.config?.visible ?? true

  const dataset = dataview.datasets?.find((d) => d.type === DatasetTypes.Events)

  if (!dataset) {
    return <DatasetNotFound dataview={dataview} />
  }

  const title = t(`datasets:${dataset?.id}.name` as any)
  const TitleComponent = (
    <Title
      title={title}
      className={styles.name}
      classNameActive={styles.active}
      dataview={dataview}
    />
  )

  const infoTooltip = t(`datasets:${dataset?.id}.description` as any)

  return (
    <div
      className={cx(styles.LayerPanel, {
        'print-hidden': !layerActive,
      })}
    >
      <div className={styles.header}>
        <LayerSwitch active={layerActive} className={styles.switch} dataview={dataview} />
        {title && title.length > 30 ? (
          <Tooltip content={title}>{TitleComponent}</Tooltip>
        ) : (
          TitleComponent
        )}
        <div className={cx('print-hidden', styles.actions, { [styles.active]: layerActive })}>
          <IconButton
            icon="info"
            type="default"
            size="small"
            className={styles.actionButton}
            tooltip={infoTooltip}
            tooltipPlacement="top"
          />
        </div>
      </div>
    </div>
  )
}

export default LayerPanel
