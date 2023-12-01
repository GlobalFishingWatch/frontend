import { Fragment, useState } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  DatasetStatus,
  DatasetGeometryType,
  ResourceStatus,
  Dataview,
  Dataset,
  DatasetTypes,
} from '@globalfishingwatch/api-types'
import { Tooltip, ColorBarOption, IconButton } from '@globalfishingwatch/ui-components'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { getDatasetGeometryType } from '@globalfishingwatch/datasets-client'
import styles from 'features/workspace/shared/LayerPanel.module.css'
import { selectUserId } from 'features/user/user.selectors'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import {
  useAutoRefreshImportingDataset,
  useDatasetModalConfigConnect,
  useDatasetModalOpenConnect,
} from 'features/datasets/datasets.hook'
import { isGFWUser, selectIsGuestUser } from 'features/user/user.slice'
import DatasetLoginRequired from 'features/workspace/shared/DatasetLoginRequired'
import { useLayerPanelDataviewSort } from 'features/workspace/shared/layer-panel-sort.hook'
import GFWOnly from 'features/user/GFWOnly'
import { ONLY_GFW_STAFF_DATAVIEW_SLUGS, HIDDEN_DATAVIEW_FILTERS } from 'data/workspaces'
import {
  getDatasetLabel,
  getSchemaFiltersInDataview,
  isPrivateDataset,
} from 'features/datasets/datasets.utils'
import { useMapDrawConnect } from 'features/map/map-draw.hooks'
import { COLOR_SECONDARY_BLUE } from 'features/app/App'
import FitBounds from 'features/workspace/common/FitBounds'
import DatasetNotFound from '../shared/DatasetNotFound'
import Color from '../common/Color'
import LayerSwitch from '../common/LayerSwitch'
import Remove from '../common/Remove'
import Title from '../common/Title'
import Filters from '../activity/ActivityFilters'
import InfoModal from '../common/InfoModal'
import ExpandedContainer from '../shared/ExpandedContainer'
import DatasetSchemaField from '../shared/DatasetSchemaField'
import { showSchemaFilter } from '../activity/ActivitySchemaFilter'
import UserLayerTrackPanel, { useUserLayerTrackResource } from './UserLayerTrackPanel'

type UserPanelProps = {
  dataview: UrlDataviewInstance
  onToggle?: () => void
}

export function getUserDataviewDataset(dataview?: Dataview | UrlDataviewInstance): Dataset {
  return dataview?.datasets?.find(
    (d) =>
      d.type === DatasetTypes.Context ||
      d.type === DatasetTypes.UserContext ||
      d.type === DatasetTypes.UserTracks
  ) as Dataset
}

function UserPanel({ dataview, onToggle }: UserPanelProps): React.ReactElement {
  const { t } = useTranslation()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const { dispatchDatasetModalOpen } = useDatasetModalOpenConnect()
  const { dispatchDatasetModalConfig } = useDatasetModalConfigConnect()
  const { dispatchSetMapDrawing, dispatchSetMapDrawEditDataset } = useMapDrawConnect()
  const [filterOpen, setFiltersOpen] = useState(false)
  const [colorOpen, setColorOpen] = useState(false)
  const gfwUser = useSelector(isGFWUser)
  const userId = useSelector(selectUserId)
  const guestUser = useSelector(selectIsGuestUser)
  const layerActive = dataview?.config?.visible ?? true
  const dataset = getUserDataviewDataset(dataview)
  const datasetGeometryType = getDatasetGeometryType(dataset)
  const { resource, featuresColoredByField } = useUserLayerTrackResource(dataview)
  const trackError = resource?.status === ResourceStatus.Error

  useAutoRefreshImportingDataset(layerActive ? dataset : ({} as Dataset), 5000)

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

  const { filtersAllowed } = getSchemaFiltersInDataview(dataview)
  const hasSchemaFilters = filtersAllowed.some(showSchemaFilter)
  const hasSchemaFilterSelection = filtersAllowed.some(
    (schema) => schema.optionsSelected?.length > 0
  )

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

  const onEditClick = () => {
    if (datasetGeometryType === 'draw') {
      dispatchSetMapDrawEditDataset(dataset?.id)
      dispatchSetMapDrawing(true)
    } else {
      dispatchDatasetModalOpen(true)
      dispatchDatasetModalConfig({
        id: dataset?.id,
        type:
          (dataset?.configuration?.configurationUI?.geometryType as DatasetGeometryType) ||
          dataset?.configuration?.geometryType,
      })
    }
  }
  const onToggleColorOpen = () => {
    setColorOpen(!colorOpen)
  }

  const onToggleFilterOpen = () => {
    setFiltersOpen(!filterOpen)
  }

  const closeExpandedContainer = () => {
    setFiltersOpen(false)
    setColorOpen(false)
  }

  const isUserLayer = !guestUser && dataset?.ownerId === userId

  if (!dataset) {
    const dataviewHasPrivateDataset = dataview.datasetsConfig?.some((d) =>
      isPrivateDataset({ id: d.datasetId })
    )
    return guestUser && dataviewHasPrivateDataset ? (
      <DatasetLoginRequired dataview={dataview} />
    ) : (
      <DatasetNotFound dataview={dataview} />
    )
  }

  const title = dataset
    ? getDatasetLabel(dataset)
    : t(`dataview.${dataview?.id}.title` as any, dataview?.name || dataview?.id)

  const TitleComponent = (
    <Title
      title={title}
      className={styles.name}
      classNameActive={styles.active}
      dataview={dataview}
      onToggle={onToggle}
      showIcon
    />
  )

  const hasLayerProperties = hasSchemaFilterSelection || datasetGeometryType === 'tracks'

  return (
    <div
      className={cx(styles.LayerPanel, {
        [styles.expandedContainerOpen]: filterOpen || colorOpen,
        'print-hidden': !layerActive,
      })}
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      <div className={styles.header}>
        <LayerSwitch
          disabled={dataset?.status === DatasetStatus.Error}
          active={layerActive}
          className={styles.switch}
          dataview={dataview}
          onToggle={onToggle}
          color={featuresColoredByField ? COLOR_SECONDARY_BLUE : undefined}
          testId={`context-layer-${dataview.id}`}
        />
        {ONLY_GFW_STAFF_DATAVIEW_SLUGS.includes(dataview.dataviewId as string) && (
          <GFWOnly type="only-icon" style={{ transform: 'none' }} className={styles.gfwIcon} />
        )}
        {title && title.length > 30 ? (
          <Tooltip content={title}>{TitleComponent}</Tooltip>
        ) : (
          TitleComponent
        )}
        <div className={cx('print-hidden', styles.actions, { [styles.active]: layerActive })}>
          {layerActive && (
            <IconButton
              icon="edit"
              size="small"
              disabled={dataview.datasets?.[0]?.status === DatasetStatus.Importing}
              tooltip={
                datasetGeometryType === 'draw'
                  ? t('layer.editDraw', 'Edit draw')
                  : t('dataset.edit', 'Edit dataset')
              }
              tooltipPlacement="top"
              onClick={onEditClick}
            />
          )}
          {layerActive && (
            <Fragment>
              <Color
                dataview={dataview}
                open={colorOpen}
                disabled={featuresColoredByField}
                onColorClick={changeColor}
                onToggleClick={onToggleColorOpen}
                onClickOutside={closeExpandedContainer}
              />
              {datasetGeometryType === 'tracks' && (
                <FitBounds hasError={trackError} trackResource={resource} />
              )}
            </Fragment>
          )}
          {layerActive &&
            hasSchemaFilters &&
            !HIDDEN_DATAVIEW_FILTERS.includes(dataview.dataviewId as string) && (
              <ExpandedContainer
                visible={filterOpen}
                onClickOutside={closeExpandedContainer}
                component={<Filters dataview={dataview} onConfirmCallback={onToggleFilterOpen} />}
              >
                <div className={styles.filterButtonWrapper}>
                  <IconButton
                    icon={filterOpen ? 'filter-on' : 'filter-off'}
                    size="small"
                    onClick={onToggleFilterOpen}
                    tooltip={
                      filterOpen
                        ? t('layer.filterClose', 'Close filters')
                        : t('layer.filterOpen', 'Open filters')
                    }
                    tooltipPlacement="top"
                  />
                </div>
              </ExpandedContainer>
            )}
          {<InfoModal dataview={dataview} />}
          {(isUserLayer || gfwUser) && <Remove dataview={dataview} />}
          {items.length > 1 && (
            <IconButton
              size="small"
              ref={setActivatorNodeRef}
              {...listeners}
              icon="drag"
              className={styles.dragger}
            />
          )}
        </div>
      </div>
      {layerActive && hasLayerProperties && (
        <div
          className={cx(styles.properties, styles.dataWarning, styles.drag, {
            [styles.dragging]: isSorting && activeIndex > -1,
          })}
        >
          {hasSchemaFilterSelection && (
            <div className={styles.filters}>
              <div className={styles.filters}>
                {filtersAllowed.map(({ id, label }) => (
                  <DatasetSchemaField key={id} dataview={dataview} field={id} label={label} />
                ))}
              </div>
            </div>
          )}
          {datasetGeometryType === 'tracks' && <UserLayerTrackPanel dataview={dataview} />}
        </div>
      )}
    </div>
  )
}

export default UserPanel
