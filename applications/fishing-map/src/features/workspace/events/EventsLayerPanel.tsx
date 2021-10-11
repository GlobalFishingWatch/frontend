import React from 'react'
import cx from 'classnames'
import { DatasetTypes } from '@globalfishingwatch/api-types'
import Tooltip from '@globalfishingwatch/ui-components/dist/tooltip'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { IconButton } from '@globalfishingwatch/ui-components'
import styles from 'features/workspace/shared/LayerPanel.module.css'
import { getDatasetLabel } from 'features/datasets/datasets.utils'
import DatasetNotFound from '../shared/DatasetNotFound'
import LayerSwitch from '../common/LayerSwitch'
import Title from '../common/Title'
import InfoModal from '../common/InfoModal'

type LayerPanelProps = {
  dataview: UrlDataviewInstance
}

function LayerPanel({ dataview }: LayerPanelProps): React.ReactElement {
  const layerActive = dataview?.config?.visible ?? true

  const dataset = dataview.datasets?.find((d) => d.type === DatasetTypes.Events)

  if (!dataset) {
    return <DatasetNotFound dataview={dataview} />
  }

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
          <InfoModal dataview={dataview} />
        </div>
        <IconButton
          icon="more"
          className={cx('print-hidden', styles.shownUntilHovered)}
          size="small"
        />
      </div>
    </div>
  )
}

export default LayerPanel
