import { Fragment, useCallback, useState } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { FeatureCollection } from 'geojson'
import { DatasetTypes, Resource, ResourceStatus } from '@globalfishingwatch/api-types'
import { Tooltip, IconButton, ColorBarOption } from '@globalfishingwatch/ui-components'
import {
  resolveDataviewDatasetResource,
  UrlDataviewInstance,
} from '@globalfishingwatch/dataviews-client'
import { NO_RECORD_ID } from '@globalfishingwatch/data-transforms'
import styles from 'features/workspace/shared/LayerPanel.module.css'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { selectUserId } from 'features/user/user.selectors'
import { useAutoRefreshImportingDataset } from 'features/datasets/datasets.hook'
import { selectResourceByUrl } from 'features/resources/resources.slice'
import { selectActiveTrackDataviews } from 'features/dataviews/dataviews.slice'
import { useLayerPanelDataviewSort } from 'features/workspace/shared/layer-panel-sort.hook'
import { COLOR_SECONDARY_BLUE } from 'features/app/App'
import DatasetNotFound from '../shared/DatasetNotFound'
import Color from '../common/Color'
import LayerSwitch from '../common/LayerSwitch'
import InfoModal from '../common/InfoModal'
import Remove from '../common/Remove'
import Title from '../common/Title'
import FitBounds from '../common/FitBounds'

type LayerPanelProps = {
  dataview: UrlDataviewInstance
  onToggle?: () => void
}

const SEE_MORE_LENGTH = 5

function UserTrackLayerPanel({ dataview, onToggle }: LayerPanelProps): React.ReactElement {
  const { t } = useTranslation()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const userId = useSelector(selectUserId)
  const [colorOpen, setColorOpen] = useState(false)
  const [seeMoreOpen, setSeeMoreOpen] = useState(false)
  const allTracksActive = useSelector(selectActiveTrackDataviews)
  const {
    items,
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    style,
    isSorting,
    activeIndex,
  } = useLayerPanelDataviewSort(dataview.id)

  const singleTrack = allTracksActive.length === 1

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

  const onSeeMoreClick = useCallback(() => {
    setSeeMoreOpen(!seeMoreOpen)
  }, [seeMoreOpen])

  const dataset = dataview.datasets?.find((d) => d.type === DatasetTypes.UserTracks)
  useAutoRefreshImportingDataset(dataset)
  const isCustomUserLayer = dataset?.ownerId === userId

  const { url: trackUrl } = resolveDataviewDatasetResource(dataview, DatasetTypes.UserTracks)
  const trackResource: Resource<FeatureCollection> = useSelector(
    selectResourceByUrl<FeatureCollection>(trackUrl)
  )
  const trackError = trackResource?.status === ResourceStatus.Error
  const hasRecordIds = dataset?.configuration?.id
    ? trackResource?.data?.features?.some((f) => f.properties?.id !== NO_RECORD_ID)
    : false

  const featuresColoredByField = singleTrack && trackResource?.data && hasRecordIds

  const loading = trackResource?.status === ResourceStatus.Loading

  if (!dataset) {
    return <DatasetNotFound dataview={dataview} />
  }

  const title = t(`datasets:${dataset?.id}.name` as any, dataset?.name || dataset?.id)

  const TitleComponent = (
    <Title
      title={title}
      className={styles.name}
      classNameActive={styles.active}
      dataview={dataview}
      onToggle={onToggle}
    />
  )

  return (
    <div
      className={cx(styles.LayerPanel, {
        [styles.expandedContainerOpen]: colorOpen,
        'print-hidden': !layerActive,
      })}
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      <div className={styles.header}>
        <LayerSwitch
          active={layerActive}
          className={styles.switch}
          dataview={dataview}
          onToggle={onToggle}
          color={featuresColoredByField ? COLOR_SECONDARY_BLUE : undefined}
        />
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
                    disabled={featuresColoredByField}
                  />
                  <FitBounds hasError={trackError} trackResource={trackResource} />
                </Fragment>
              )}
              <InfoModal dataview={dataview} />
              {isCustomUserLayer && <Remove dataview={dataview} />}
              {items.length > 1 && (
                <IconButton
                  size="small"
                  ref={setActivatorNodeRef}
                  {...listeners}
                  icon="drag"
                  className={styles.dragger}
                />
              )}
            </Fragment>
          )}
        </div>
      </div>

      {layerActive && featuresColoredByField && (
        <div
          className={cx(styles.properties, styles.drag, {
            [styles.dragging]: isSorting && activeIndex > -1,
          })}
        >
          {trackResource.data?.features
            .slice(0, seeMoreOpen ? undefined : SEE_MORE_LENGTH)
            .map((feature, index) => {
              return (
                <div
                  key={index}
                  className={styles.trackColor}
                  style={
                    {
                      '--color': feature.properties?.color,
                    } as React.CSSProperties
                  }
                >
                  {feature.properties?.id}
                </div>
              )
            })}
          {trackResource.data?.features!?.length > SEE_MORE_LENGTH && (
            <button
              className={cx(styles.link, {
                [styles.more]: !seeMoreOpen,
                [styles.less]: seeMoreOpen,
              })}
              onClick={onSeeMoreClick}
            >
              {seeMoreOpen ? t('common.less', 'less') : t('common.more', 'more')}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default UserTrackLayerPanel
