import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { DatasetTypes, DatasetStatus, Vessel } from '@globalfishingwatch/api-types'
import { Switch, IconButton, Tooltip, ColorBar } from '@globalfishingwatch/ui-components'
import {
  ColorBarOption,
  HeatmapColorBarOptions,
  TrackColorBarOptions,
} from '@globalfishingwatch/ui-components/dist/color-bar'
import { Generators } from '@globalfishingwatch/layer-composer'
import useClickedOutside from 'hooks/use-clicked-outside'
import { UrlDataviewInstance, AsyncReducerStatus } from 'types'
import styles from 'features/workspace/LayerPanel.module.css'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { resolveDataviewDatasetResource } from 'features/workspace/workspace.selectors'
import { selectResourceByUrl } from 'features/resources/resources.slice'
import { useDatasetsAPI } from 'features/datasets/datasets.hook'

const DATASET_REFRESH_TIMEOUT = 10000

type LayerPanelProps = {
  dataview: UrlDataviewInstance
}

function LayerPanel({ dataview }: LayerPanelProps): React.ReactElement {
  const { t } = useTranslation()
  const { dispatchFetchDataset } = useDatasetsAPI()
  const { upsertDataviewInstance, deleteDataviewInstance } = useDataviewInstancesConnect()
  const { url } = resolveDataviewDatasetResource(dataview, { type: DatasetTypes.Vessels })
  const resource = useSelector(selectResourceByUrl<Vessel>(url))
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
  const expandedContainerRef = useClickedOutside(closeExpandedContainer)
  const isCustomUserLayer = dataview.config?.type === Generators.Type.UserContext

  const dataset = dataview.datasets?.find((d) => d.type === DatasetTypes.Context)

  // TODO remove this once we have the env category ready
  const isEnviromentalLayerUsedAsContextTemporally =
    dataset?.configuration?.propertyToInclude && dataset?.configuration?.propertyToIncludeRange

  useEffect(() => {
    let timeOut: any
    if (dataset && dataset.status === DatasetStatus.Importing) {
      timeOut = setTimeout(() => {
        dispatchFetchDataset(dataset.id)
      }, DATASET_REFRESH_TIMEOUT)
    }
    return () => {
      if (timeOut) {
        clearTimeout(timeOut)
      }
    }
  }, [dataset, dispatchFetchDataset])

  if (!dataset) {
    return (
      <div className={cx(styles.LayerPanel, 'print-hidden')}>
        <div className={styles.header}>
          <h3 className={cx(styles.name)}>{dataview.datasetsConfig?.[0].datasetId}</h3>
          <div className={cx('print-hidden', styles.actions)}>
            <IconButton
              icon="warning"
              type="warning"
              size="small"
              className={styles.actionButton}
              tooltip={t('errors.datasetNotFound', 'Dataset not found')}
              tooltipPlacement="top"
            />
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
      </div>
    )
  }
  const title = isCustomUserLayer ? dataset?.name || dataset?.id : t(`datasets:${dataset?.id}.name`)
  const TitleComponent = (
    <h3 className={cx(styles.name, { [styles.active]: layerActive })} onClick={onToggleLayerActive}>
      {title}
    </h3>
  )

  const datasetImporting = dataset.status === DatasetStatus.Importing
  const datasetError = dataset.status === DatasetStatus.Error
  const resourceLoading = resource?.status === AsyncReducerStatus.Loading
  let infoTooltip = isCustomUserLayer
    ? dataset?.description
    : t(`datasets:${dataset?.id}.description`)
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
            loading={resourceLoading || datasetImporting}
            className={styles.actionButton}
            tooltip={infoTooltip}
            tooltipPlacement="top"
          />
          {layerActive && (
            <IconButton
              icon={colorOpen ? 'color-picker' : 'color-picker-filled'}
              size="small"
              style={colorOpen ? {} : { color: dataview.config?.color }}
              tooltip={t('layer.color_change', 'Change color')}
              tooltipPlacement="top"
              onClick={onToggleColorOpen}
              className={cx(styles.actionButton, styles.expandable, {
                [styles.expanded]: colorOpen,
              })}
            />
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
      {isEnviromentalLayerUsedAsContextTemporally && (
        <div className={styles.properties}>
          <div id={`legend_${dataview.id}`}></div>
        </div>
      )}
      <div className={styles.expandedContainer} ref={expandedContainerRef}>
        {colorOpen && (
          <ColorBar
            colorBarOptions={
              isEnviromentalLayerUsedAsContextTemporally
                ? HeatmapColorBarOptions
                : TrackColorBarOptions
            }
            selectedColor={dataview.config?.color}
            onColorClick={changeColor}
          />
        )}
      </div>
    </div>
  )
}

export default LayerPanel
