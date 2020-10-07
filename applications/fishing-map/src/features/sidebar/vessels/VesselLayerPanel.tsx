import React from 'react'
import cx from 'classnames'
import { Switch, IconButton, Tooltip } from '@globalfishingwatch/ui-components'
import { Dataview } from '@globalfishingwatch/dataviews-client'
import styles from 'features/sidebar/common/LayerPanel.module.css'
import { TRACKS_DATASET_ID } from 'features/workspace/workspace.selectors'
import { useDataviewsConnect } from 'features/workspace/workspace.hook'

type LayerPanelProps = {
  dataview: Dataview
}

function LayerPanel({ dataview }: LayerPanelProps): React.ReactElement {
  const { updateUrlDataview } = useDataviewsConnect()

  const layerActive = dataview?.config?.visible ?? true
  const onToggleLayerActive = () => {
    updateUrlDataview({
      uid: dataview.uid || dataview.id.toString(),
      config: { visible: !layerActive },
    })
  }

  const datasetConfig = dataview.datasetsConfig?.find((d) => d.datasetId === TRACKS_DATASET_ID)
  const vesselId = datasetConfig?.params.find((p) => p.id === 'vesselId')?.value as string
  const title = vesselId || dataview.name

  const TitleComponent = (
    <h3 className={cx(styles.name, { [styles.active]: layerActive })} onClick={onToggleLayerActive}>
      {title}
    </h3>
  )

  return (
    <div className={cx(styles.LayerPanel)}>
      <div className={styles.header}>
        <Switch
          active={layerActive}
          onClick={onToggleLayerActive}
          tooltip="Toggle layer visibility"
          tooltipPlacement="top"
          color={dataview.config.color}
        />
        {title.length > 30 ? <Tooltip content={title}>{TitleComponent}</Tooltip> : TitleComponent}
        <div className={cx(styles.actions, { [styles.active]: layerActive })}>
          <IconButton
            icon="info"
            size="small"
            className={styles.actionButton}
            tooltip={dataview.description}
            tooltipPlacement="top"
          />
          <IconButton
            icon="delete"
            size="small"
            className={styles.actionButton}
            tooltip="Delete"
            tooltipPlacement="top"
          />
        </div>
      </div>
    </div>
  )
}

export default LayerPanel
