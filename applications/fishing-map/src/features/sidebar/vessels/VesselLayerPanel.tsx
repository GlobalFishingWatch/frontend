import React from 'react'
import cx from 'classnames'
import { WorkspaceDataview } from 'types'
import { Switch, IconButton, Tooltip } from '@globalfishingwatch/ui-components'
import styles from 'features/sidebar/common/LayerPanel.module.css'
import { useDataviewsConfigConnect } from 'features/workspace/workspace.hook'
import { TRACKS_DATASET_ID } from 'features/workspace/workspace.mock'

type LayerPanelProps = {
  dataview: WorkspaceDataview
}

function LayerPanel({ dataview }: LayerPanelProps): React.ReactElement {
  const { updateDataviewConfig, deleteDataviewConfig } = useDataviewsConfigConnect()

  const layerActive = dataview?.config?.visible ?? true
  const onToggleLayerActive = () => {
    updateDataviewConfig({
      id: dataview.configId,
      config: { visible: !layerActive },
    })
  }
  const onRemoveLayerClick = () => {
    deleteDataviewConfig(dataview.configId)
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
            onClick={onRemoveLayerClick}
          />
        </div>
      </div>
    </div>
  )
}

export default LayerPanel
