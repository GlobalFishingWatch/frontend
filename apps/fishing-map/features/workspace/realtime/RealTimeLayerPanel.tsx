import React from 'react'
import cx from 'classnames'
import { DatasetTypes } from '@globalfishingwatch/api-types'
import { Tooltip } from '@globalfishingwatch/ui-components'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import styles from 'features/workspace/shared/LayerPanel.module.css'
import { getDatasetLabel } from 'features/datasets/datasets.utils'
import { SKYLIGHT_ENCOUNTERS_DATASET_ID } from 'features/datasets/datasets.mock'
import DatasetNotFound from '../shared/DatasetNotFound'
import LayerSwitch from '../common/LayerSwitch'
import Title from '../common/Title'
import InfoModal from '../common/InfoModal'

type LayerPanelProps = {
  dataview: UrlDataviewInstance
}

function RealTimeLayerPanel({ dataview }: LayerPanelProps): React.ReactElement {
  const layerActive = dataview?.config?.visible ?? true

  const dataset = dataview.datasets?.find((d) => d.type === DatasetTypes.TemporalContext)

  if (!dataset) {
    return <DatasetNotFound dataview={dataview} />
  }

  const disabled = !dataset.id.includes(SKYLIGHT_ENCOUNTERS_DATASET_ID)

  const title = getDatasetLabel(dataset)
  const TitleComponent = (
    <Title
      title={title}
      className={styles.name}
      classNameActive={styles.active}
      dataview={dataview}
    />
  )

  return (
    <div
      className={cx(styles.LayerPanel, styles.noBorder, {
        'print-hidden': !layerActive,
      })}
    >
      <div className={styles.header}>
        <LayerSwitch
          disabled={disabled}
          active={layerActive}
          className={styles.switch}
          dataview={dataview}
        />
        {title && title.length > 30 ? (
          <Tooltip content={title}>{TitleComponent}</Tooltip>
        ) : (
          TitleComponent
        )}
        <div className={cx('print-hidden', styles.actions, { [styles.active]: layerActive })}>
          <InfoModal dataview={dataview} />
        </div>
      </div>
    </div>
  )
}

export default RealTimeLayerPanel
