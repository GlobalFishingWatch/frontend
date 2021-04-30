import React, { Fragment, useState } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { DatasetTypes, ResourceStatus } from '@globalfishingwatch/api-types'
import Tooltip from '@globalfishingwatch/ui-components/dist/tooltip'
import { ColorBarOption } from '@globalfishingwatch/ui-components/dist/color-bar'
import {
  resolveDataviewDatasetResource,
  UrlDataviewInstance,
} from '@globalfishingwatch/dataviews-client'
import { Segment } from '@globalfishingwatch/data-transforms'
import { IconButton } from '@globalfishingwatch/ui-components'
import styles from 'features/workspace/shared/LayerPanel.module.css'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { selectUserId } from 'features/user/user.selectors'
import { useAutoRefreshImportingDataset } from 'features/datasets/datasets.hook'
import { selectResourceByUrl } from 'features/resources/resources.slice'
import DatasetNotFound from '../shared/DatasetNotFound'
import Color from '../common/Color'
import LayerSwitch from '../common/LayerSwitch'
import InfoError from '../common/InfoError'
import Remove from '../common/Remove'
import Title from '../common/Title'
import FitBounds from '../common/FitBounds'
import useDatasetError from './useDatasetError'

type LayerPanelProps = {
  dataview: UrlDataviewInstance
}

function UserTrackLayerPanel({ dataview }: LayerPanelProps): React.ReactElement {
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

  const dataset = dataview.datasets?.find((d) => d.type === DatasetTypes.UserTracks)
  useAutoRefreshImportingDataset(dataset)
  const isCustomUserLayer = dataset?.ownerId === userId

  const { url: trackUrl } = resolveDataviewDatasetResource(dataview, DatasetTypes.UserTracks)
  const trackResource = useSelector(selectResourceByUrl<Segment[]>(trackUrl))
  const trackError = trackResource?.status === ResourceStatus.Error

  const { datasetError, datasetImporting, infoTooltip } = useDatasetError(
    dataset,
    isCustomUserLayer
  )

  const loading = trackResource?.status === ResourceStatus.Loading

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
          {loading ? (
            <IconButton
              loading
              className={styles.loadingIcon}
              size="small"
              tooltip={t('vessel.loading', 'Loading vessel track')}
            />
          ) : (
            <Fragment>
              {layerActive && (
                <Fragment>
                  <Color
                    dataview={dataview}
                    open={colorOpen}
                    onColorClick={changeColor}
                    onToggleClick={onToggleColorOpen}
                    onClickOutside={closeExpandedContainer}
                  />
                  <FitBounds
                    className={styles.actionButton}
                    hasError={trackError}
                    trackResource={trackResource}
                  />
                </Fragment>
              )}
              <InfoError
                error={datasetError}
                loading={datasetImporting}
                tooltip={infoTooltip}
                className={styles.actionButton}
              />
              {isCustomUserLayer && (
                <Remove className={cx(styles.actionButton)} dataview={dataview} />
              )}
            </Fragment>
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

export default UserTrackLayerPanel
