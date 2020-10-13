import React from 'react'
import cx from 'classnames'
import { UrlDataviewInstance } from 'types'
import { Switch, IconButton, Tooltip } from '@globalfishingwatch/ui-components'
import styles from 'features/sidebar/common/LayerPanel.module.css'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'

type LayerPanelProps = {
  dataview: UrlDataviewInstance
}

function LayerPanel({ dataview }: LayerPanelProps): React.ReactElement {
  const { upsertDataviewInstance, deleteDataviewInstance } = useDataviewInstancesConnect()

  const layerActive = dataview?.config?.visible ?? true
  const onToggleLayerActive = () => {
    upsertDataviewInstance({
      id: dataview.id,
      config: { visible: !layerActive },
    })
  }
  const onRemoveLayerClick = () => {
    deleteDataviewInstance(dataview.id)
  }

  const datasetConfig = dataview.datasetsConfig?.find(
    (dc) => dc?.params.find((p) => p.id === 'vesselId')?.value
  )
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
          color={dataview.config?.color}
        />
        {title && title.length > 30 ? (
          <Tooltip content={title}>{TitleComponent}</Tooltip>
        ) : (
          TitleComponent
        )}
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
