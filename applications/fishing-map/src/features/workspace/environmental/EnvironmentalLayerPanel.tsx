import React, { useState } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { DatasetTypes } from '@globalfishingwatch/api-types'
import Tooltip from '@globalfishingwatch/ui-components/dist/tooltip'
import { ColorBarOption } from '@globalfishingwatch/ui-components/dist/color-bar'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import styles from 'features/workspace/shared/LayerPanel.module.css'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { selectUserId } from 'features/user/user.selectors'
import { useAutoRefreshImportingDataset } from 'features/datasets/datasets.hook'
import DatasetNotFound from '../shared/DatasetNotFound'
import Color from '../common/Color'
import LayerSwitch from '../common/LayerSwitch'
import InfoError from '../common/InfoError'
import Remove from '../common/Remove'
import Title from '../common/Title'
import useDatasetError from './useDatasetError'

type LayerPanelProps = {
  dataview: UrlDataviewInstance
}

function EnvironmentalLayerPanel({ dataview }: LayerPanelProps): React.ReactElement {
  const { t } = useTranslation()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const userId = useSelector(selectUserId)
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

  const dataset = dataview.datasets?.find(
    (d) => d.type === DatasetTypes.Fourwings || d.type === DatasetTypes.Context
  )
  useAutoRefreshImportingDataset(dataset)
  const isCustomUserLayer = dataset?.ownerId === userId

  const { datasetError, datasetImporting, infoTooltip } = useDatasetError(
    dataset,
    isCustomUserLayer
  )

  if (!dataset) {
    return <DatasetNotFound dataview={dataview} />
  }

  const title = isCustomUserLayer
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

  return (
    <div
      className={cx(styles.LayerPanel, {
        [styles.expandedContainerOpen]: colorOpen,
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
          {layerActive && (
            <Color
              dataview={dataview}
              open={colorOpen}
              onColorClick={changeColor}
              onToggleClick={onToggleColorOpen}
              onClickOutside={closeExpandedContainer}
            />
          )}
          <InfoError
            error={datasetError}
            loading={datasetImporting}
            tooltip={infoTooltip}
            className={styles.actionButton}
          />
          {isCustomUserLayer && <Remove className={cx(styles.actionButton)} dataview={dataview} />}
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

export default EnvironmentalLayerPanel
