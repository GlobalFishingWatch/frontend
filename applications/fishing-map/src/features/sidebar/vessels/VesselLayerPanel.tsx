import React from 'react'
import cx from 'classnames'
import { UrlDataviewInstance, AsyncReducerStatus } from 'types'
import { useSelector } from 'react-redux'
// import { formatDate } from 'utils/dates'
import { Switch, IconButton, Tooltip, Spinner } from '@globalfishingwatch/ui-components'
import styles from 'features/sidebar/common/LayerPanel.module.css'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { resolveDataviewDatasetResource } from 'features/workspace/workspace.selectors'
import { VESSELS_DATASET_TYPE } from 'features/workspace/workspace.mock'
import { selectResourceByUrl } from 'features/resources/resources.slice'

type LayerPanelProps = {
  dataview: UrlDataviewInstance
}

type Vessel = {
  shipname: string
  flag: string
  imo: string
  first_transmission_date: string
  last_transmission_date: string
}

function LayerPanel({ dataview }: LayerPanelProps): React.ReactElement {
  const { upsertDataviewInstance, deleteDataviewInstance } = useDataviewInstancesConnect()
  const { url } = resolveDataviewDatasetResource(dataview, VESSELS_DATASET_TYPE)
  const resource = useSelector(selectResourceByUrl<Vessel>(url))

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

  if (resource?.status === AsyncReducerStatus.Loading) {
    return (
      <div className={cx(styles.LayerPanel)}>
        <Spinner size="small" />
      </div>
    )
  }

  const datasetConfig = dataview.datasetsConfig?.find(
    (dc) => dc?.params.find((p) => p.id === 'vesselId')?.value
  )

  const vesselName = resource?.data?.shipname
  const vesselId = datasetConfig?.params.find((p) => p.id === 'vesselId')?.value as string
  const title = vesselName || vesselId || dataview.name
  const infoTooltip = (
    <p className={styles.infoTooltip}>
      {dataview.info.fields.map((field: keyof Vessel) => {
        const fieldValue = resource?.data?.[field]
        if (!fieldValue) return null
        return (
          <span key={field} className={styles.infoTooltipRow}>
            {field.toUpperCase()}: {fieldValue}
          </span>
        )
      })}
    </p>
  )

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
            tooltip={infoTooltip}
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
