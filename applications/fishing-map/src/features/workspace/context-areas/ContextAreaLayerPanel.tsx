import React, { useState } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { DatasetTypes, DatasetStatus } from '@globalfishingwatch/api-types'
import { Tooltip, ColorBar } from '@globalfishingwatch/ui-components'
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
import Color from '../common/Color'
import LayerSwitch from '../common/LayerSwitch'
import InfoError from '../common/InfoError'
import Remove from '../common/Remove'
import Title from '../common/Title'

type LayerPanelProps = {
  dataview: UrlDataviewInstance
}

function LayerPanel({ dataview }: LayerPanelProps): React.ReactElement {
  const { t } = useTranslation()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const [colorOpen, setColorOpen] = useState(false)

  const layerActive = dataview?.config?.visible ?? true

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
    <Title
      title={title}
      className={styles.name}
      classNameActive={styles.active}
      dataview={dataview}
    />
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
        <LayerSwitch
          disabled={datasetError}
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
          <InfoError
            error={datasetError}
            loading={datasetImporting}
            tooltip={infoTooltip}
            className={styles.actionButton}
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
              <Color
                open={colorOpen}
                dataview={dataview}
                onClick={onToggleColorOpen}
                className={cx(styles.actionButton)}
              />
            </ExpandedContainer>
          )}
          {isUserLayer && <Remove className={cx(styles.actionButton)} dataview={dataview} />}
        </div>
      </div>
    </div>
  )
}

export default LayerPanel
