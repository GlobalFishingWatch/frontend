import React, { useState } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { DatasetTypes, DatasetStatus } from '@globalfishingwatch/api-types'
import Switch from '@globalfishingwatch/ui-components/dist/switch'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import Tooltip from '@globalfishingwatch/ui-components/dist/tooltip'
import ColorBar, {
  ColorBarOption,
  HeatmapColorBarOptions,
} from '@globalfishingwatch/ui-components/dist/color-bar'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import styles from 'features/workspace/shared/LayerPanel.module.css'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { selectUserId } from 'features/user/user.selectors'
import { useAutoRefreshImportingDataset } from 'features/datasets/datasets.hook'
import ExpandedContainer from 'features/workspace/shared/ExpandedContainer'
import DatasetNotFound from '../shared/DatasetNotFound'

type LayerPanelProps = {
  dataview: UrlDataviewInstance
}

function LayerPanel({ dataview }: LayerPanelProps): React.ReactElement {
  const { t } = useTranslation()
  const { upsertDataviewInstance, deleteDataviewInstance } = useDataviewInstancesConnect()
  const userId = useSelector(selectUserId)
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

  const onRemoveClick = () => {
    deleteDataviewInstance(dataview.id)
  }

  const dataset = dataview.datasets?.find(
    (d) =>
      d.type === DatasetTypes.Fourwings ||
      d.type === DatasetTypes.Context ||
      d.type === DatasetTypes.UserTracks
  )
  useAutoRefreshImportingDataset(dataset)
  const isCustomUserLayer = dataset?.ownerId === userId

  if (!dataset) {
    return <DatasetNotFound dataview={dataview} />
  }

  const title = isCustomUserLayer
    ? dataset?.name || dataset?.id
    : t(`datasets:${dataset?.id}.name` as any)

  const TitleComponent = (
    <h3 className={cx(styles.name, { [styles.active]: layerActive })} onClick={onToggleLayerActive}>
      {title}
    </h3>
  )

  const datasetImporting = dataset.status === DatasetStatus.Importing
  const datasetError = dataset.status === DatasetStatus.Error
  let infoTooltip = isCustomUserLayer
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
                  colorBarOptions={HeatmapColorBarOptions}
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
                className={styles.actionButton}
              />
            </ExpandedContainer>
          )}
          {isCustomUserLayer && (
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

      {layerActive && (
        <div className={styles.properties}>
          <div id={`legend_${dataview.id}`}></div>
        </div>
      )}
    </div>
  )
}

export default LayerPanel
