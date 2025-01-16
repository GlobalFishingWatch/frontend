import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import type { Dataset,DatasetGeometryType } from '@globalfishingwatch/api-types'
import { DatasetStatus, DataviewType } from '@globalfishingwatch/api-types'
import {
  getDatasetConfigurationProperty,
  getDatasetGeometryType,
  getUserDataviewDataset,
} from '@globalfishingwatch/datasets-client'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { useGetDeckLayer } from '@globalfishingwatch/deck-layer-composer'
import type { DrawFeatureType, UserTracksLayer } from '@globalfishingwatch/deck-layers'
import { useDebounce } from '@globalfishingwatch/react-hooks'
import type { ColorBarOption } from '@globalfishingwatch/ui-components'
import { IconButton } from '@globalfishingwatch/ui-components'

import { HIDDEN_DATAVIEW_FILTERS,ONLY_GFW_STAFF_DATAVIEW_SLUGS } from 'data/workspaces'
import { COLOR_SECONDARY_BLUE } from 'features/app/app.config'
import {
  useAutoRefreshImportingDataset,
  useDatasetModalConfigConnect,
  useDatasetModalOpenConnect,
} from 'features/datasets/datasets.hook'
import {
  getDatasetLabel,
  getIsBQEditorDataset,
  getSchemaFiltersInDataview,
  isPrivateDataset,
} from 'features/datasets/datasets.utils'
import { useMapDrawConnect } from 'features/map/map-draw.hooks'
import GFWOnly from 'features/user/GFWOnly'
import { selectUserId } from 'features/user/selectors/user.permissions.selectors'
import { selectIsGuestUser } from 'features/user/selectors/user.selectors'
import FitBounds from 'features/workspace/common/FitBounds'
import DatasetLoginRequired from 'features/workspace/shared/DatasetLoginRequired'
import { useLayerPanelDataviewSort } from 'features/workspace/shared/layer-panel-sort.hook'
import styles from 'features/workspace/shared/LayerPanel.module.css'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'

import Color from '../common/Color'
import InfoModal from '../common/InfoModal'
import Filters from '../common/LayerFilters'
import { showSchemaFilter } from '../common/LayerSchemaFilter'
import LayerSwitch from '../common/LayerSwitch'
import Remove from '../common/Remove'
import Title from '../common/Title'
import DatasetNotFound from '../shared/DatasetNotFound'
import DatasetSchemaField from '../shared/DatasetSchemaField'
import ExpandedContainer from '../shared/ExpandedContainer'

import UserLayerTrackPanel, { useUserLayerTrackMetadata } from './UserLayerTrackPanel'

type UserPanelProps = {
  dataview: UrlDataviewInstance
  onToggle?: () => void
}

function UserPanel({ dataview, onToggle }: UserPanelProps): React.ReactElement<any> {
  const { t } = useTranslation()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const { dispatchDatasetModalOpen } = useDatasetModalOpenConnect()
  const { dispatchDatasetModalConfig } = useDatasetModalConfigConnect()
  const { dispatchSetMapDrawing, dispatchSetMapDrawEditDataset } = useMapDrawConnect()
  const [filterOpen, setFiltersOpen] = useState(false)
  const [colorOpen, setColorOpen] = useState(false)
  const userId = useSelector(selectUserId)
  const guestUser = useSelector(selectIsGuestUser)
  const layerActive = dataview?.config?.visible ?? true
  const dataset = getUserDataviewDataset(dataview)
  const datasetGeometryType = getDatasetGeometryType(dataset)
  const { loaded, hasFeaturesColoredByField, error } = useUserLayerTrackMetadata(dataview)
  const layerLoaded = loaded && !error
  const layerLoadedDebounced = useDebounce(layerLoaded, 300)
  const layerLoading = layerActive && !layerLoadedDebounced && !error
  const layer = useGetDeckLayer<UserTracksLayer>(dataview.id)

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
  const polygonColor = getDatasetConfigurationProperty({ dataset, property: 'polygonColor' })
  const hasLegend = polygonColor !== undefined
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
      const geometryType = getDatasetConfigurationProperty({ dataset, property: 'geometryType' })
      dispatchSetMapDrawing(geometryType as DrawFeatureType)
    } else {
      dispatchDatasetModalOpen(true)
      dispatchDatasetModalConfig({
        id: dataset?.id,
        dataviewId: dataview.id,
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
  const isBQEditorLayer = getIsBQEditorDataset(dataset)

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
          color={hasFeaturesColoredByField ? COLOR_SECONDARY_BLUE : undefined}
          testId={`context-layer-${dataview.id}`}
        />
        {ONLY_GFW_STAFF_DATAVIEW_SLUGS.includes(dataview.dataviewId as string) && (
          <GFWOnly type="only-icon" style={{ transform: 'none' }} className={styles.gfwIcon} />
        )}
        <Title
          title={title}
          className={styles.name}
          classNameActive={styles.active}
          dataview={dataview}
          onToggle={onToggle}
          showIcon
        />
        <div
          className={cx(
            'print-hidden',
            styles.actions,
            { [styles.active]: layerActive },
            styles.hideUntilHovered
          )}
        >
          {layerActive && isUserLayer && !isBQEditorLayer && (
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
                disabled={hasFeaturesColoredByField}
                onColorClick={changeColor}
                onToggleClick={onToggleColorOpen}
                onClickOutside={closeExpandedContainer}
                colorType={
                  dataview.config?.type === DataviewType.HeatmapStatic ||
                  dataview.config?.type === DataviewType.HeatmapAnimated
                    ? 'fill'
                    : 'line'
                }
              />
            </Fragment>
          )}
          {layerActive && datasetGeometryType === 'tracks' && (
            <FitBounds
              hasError={error !== undefined}
              layer={layer?.instance}
              disabled={layerLoading}
            />
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
          <Remove
            dataview={dataview}
            loading={layerLoading && dataset?.status !== DatasetStatus.Importing}
          />
          {items.length > 1 && (
            <IconButton
              size="small"
              ref={setActivatorNodeRef}
              {...listeners}
              icon={error ? 'warning' : 'drag'}
              type={error ? 'warning' : 'default'}
              tooltip={error ? error : ''}
              className={styles.dragger}
            />
          )}
        </div>
        <IconButton
          icon={layerActive ? (error ? 'warning' : 'more') : undefined}
          type={error ? 'warning' : 'default'}
          loading={layerLoading}
          className={cx('print-hidden', styles.shownUntilHovered)}
          size="small"
        />
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

      {layerActive && hasLegend && (
        <div
          className={cx(styles.properties, styles.drag, {
            [styles.dragging]: isSorting && activeIndex > -1,
          })}
        >
          <div id={`legend_${dataview.id}`}></div>
        </div>
      )}
    </div>
  )
}

export default UserPanel
