import React, { useState } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { DatasetTypes, DatasetStatus } from '@globalfishingwatch/api-types'
import { Switch, IconButton, Tooltip, ColorBar } from '@globalfishingwatch/ui-components'
import {
  ColorBarOption,
  TrackColorBarOptions,
} from '@globalfishingwatch/ui-components/dist/color-bar'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import styles from 'features/workspace/shared/LayerPanel.module.css'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { useAutoRefreshImportingDataset } from 'features/datasets/datasets.hook'
import ExpandedContainer from 'features/workspace/shared/ExpandedContainer'
import DatasetNotFound from '../shared/DatasetNotFound'

type LayerPanelProps = {
  dataview: UrlDataviewInstance
}

function LayerPanel({ dataview }: LayerPanelProps): React.ReactElement {
  const { t } = useTranslation()
  const { upsertDataviewInstance, deleteDataviewInstance } = useDataviewInstancesConnect()
  const [colorOpen, setColorOpen] = useState(false)

  const layerActive = dataview?.config?.visible ?? true
  const onToggleLayerActive = () => {
    upsertDataviewInstance({
      id: dataview.id,
      config: {
        visible: !layerActive,
      },
    })
  }

  const onRemoveClick = () => {
    deleteDataviewInstance(dataview.id)
  }

  const changeColor = (color: ColorBarOption) => {
    upsertDataviewInstance({
      id: dataview.id,
      config: {
        color: color.value,
        colorRamp: color.id,
      },
    })
    setColorOpen(false)
  }
  const onToggleColorOpen = () => {
    setColorOpen(!colorOpen)
  }

  const closeExpandedContainer = () => {
    setColorOpen(false)
  }

  const dataset = dataview.datasets?.find((d) => d.type === DatasetTypes.Context)
  const isUserLayer = dataset?.ownerType === 'user'

  useAutoRefreshImportingDataset(dataset)

  if (!dataset) {
    return <DatasetNotFound dataview={dataview} />
  }
  const title = isUserLayer
    ? dataset?.name || dataset?.id
    : t(`datasets:${dataset?.id}.name` as any)
  const TitleComponent = (
    <h3 className={cx(styles.name, { [styles.active]: layerActive })} onClick={onToggleLayerActive}>
      {title}
    </h3>
  )

  const datasetImporting = dataset.status === DatasetStatus.Importing
  const datasetError = dataset.status === DatasetStatus.Error
  let infoTooltip = isUserLayer
    ? dataset?.description
    : t(`datasets:${dataset?.id}.description` as any)
  if (datasetImporting) {
    infoTooltip = t('dataset.importing', 'Dataset is being imported')
  }
  if (datasetError) {
    infoTooltip = `${t('errors.uploadError', 'There was an error uploading your dataset')} - ${
      dataset.importLogs
    }`
  }

  return (
    <div
      className={cx(styles.LayerPanel, {
        [styles.expandedContainerOpen]: colorOpen,
        'print-hidden': !layerActive,
      })}
    >
      <div className={styles.header}>
        <Switch
          disabled={datasetError}
          active={layerActive}
          onClick={onToggleLayerActive}
          tooltip={t('layer.toggleVisibility', 'Toggle layer visibility')}
          tooltipPlacement="top"
          className={styles.switch}
          color={dataview.config?.color}
        />
        {title && title.length > 30 ? (
          <Tooltip content={title}>{TitleComponent}</Tooltip>
        ) : (
          TitleComponent
        )}
        <div className={cx('print-hidden', styles.actions, { [styles.active]: layerActive })}>
          <IconButton
            icon={datasetError ? 'warning' : 'info'}
            type={datasetError ? 'warning' : 'default'}
            size="small"
            loading={datasetImporting}
            className={styles.actionButton}
            tooltip={infoTooltip}
            tooltipPlacement="top"
          />
          {layerActive && (
            <ExpandedContainer
              visible={colorOpen}
              onClickOutside={closeExpandedContainer}
              component={
                <ColorBar
                  colorBarOptions={TrackColorBarOptions}
                  selectedColor={dataview.config?.color}
                  onColorClick={changeColor}
                />
              }
            >
              <IconButton
                icon={colorOpen ? 'color-picker' : 'color-picker-filled'}
                size="small"
                style={colorOpen ? {} : { color: dataview.config?.color }}
                tooltip={t('layer.color_change', 'Change color')}
                tooltipPlacement="top"
                onClick={onToggleColorOpen}
                className={cx(styles.actionButton)}
              />
            </ExpandedContainer>
          )}
          {isUserLayer && (
            <IconButton
              icon="delete"
              size="small"
              tooltip={t('layer.remove', 'Remove layer')}
              tooltipPlacement="top"
              onClick={onRemoveClick}
              className={cx(styles.actionButton)}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default LayerPanel
