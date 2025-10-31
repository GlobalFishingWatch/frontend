import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import type { Dataset, DatasetGeometryType } from '@globalfishingwatch/api-types'
import { DatasetStatus, DataviewType } from '@globalfishingwatch/api-types'
import {
  getDatasetConfigurationProperty,
  getDatasetGeometryType,
  getUserDataviewDataset,
} from '@globalfishingwatch/datasets-client'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { DrawFeatureType, UserTracksLayer } from '@globalfishingwatch/deck-layers'
import { useDebounce } from '@globalfishingwatch/react-hooks'
import type { ColorBarOption, ThicknessSelectorOption } from '@globalfishingwatch/ui-components'
import { IconButton } from '@globalfishingwatch/ui-components'

import { HIDDEN_DATAVIEW_FILTERS, ONLY_GFW_STAFF_DATAVIEW_SLUGS } from 'data/workspaces'
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
import DatasetLoginRequired from 'features/workspace/shared/DatasetLoginRequired'
import FitBounds from 'features/workspace/shared/FitBounds'
import { useLayerPanelDataviewSort } from 'features/workspace/shared/layer-panel-sort.hook'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'

import DatasetNotFound from '../shared/DatasetNotFound'
import DatasetSchemaField from '../shared/DatasetSchemaField'
import ExpandedContainer from '../shared/ExpandedContainer'
import InfoModal from '../shared/InfoModal'
import Filters from '../shared/LayerFilters'
import LayerProperties, { POINT_PROPERTIES, POLYGON_PROPERTIES } from '../shared/LayerProperties'
import { showSchemaFilter } from '../shared/LayerSchemaFilter'
import LayerSwitch from '../shared/LayerSwitch'
import Remove from '../shared/Remove'
import Title from '../shared/Title'

import UserLayerTrackPanel, { useUserLayerMetadata } from './UserLayerTrackPanel'

import styles from 'features/workspace/shared/LayerPanel.module.css'

type UserPanelProps = {
  dataview: UrlDataviewInstance
  mergedDataviewId?: string
  onToggle?: () => void
}

function UserPanel({
  dataview,
  mergedDataviewId,
  onToggle,
}: UserPanelProps): React.ReactElement<any> {
  const { t } = useTranslation()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const { dispatchDatasetModalOpen } = useDatasetModalOpenConnect()
  const { dispatchDatasetModalConfig } = useDatasetModalConfigConnect()
  const { dispatchSetMapDrawing, dispatchSetMapDrawEditDataset } = useMapDrawConnect()
  const [filterOpen, setFiltersOpen] = useState(false)
  const [propertiesOpen, setPropertiesOpen] = useState(false)
  const userId = useSelector(selectUserId)
  const guestUser = useSelector(selectIsGuestUser)
  const layerActive = dataview?.config?.visible ?? true
  const dataset = getUserDataviewDataset(dataview)
  const datasetGeometryType = getDatasetGeometryType(dataset)
  const { instance, loaded, hasFeaturesColoredByField, error } = useUserLayerMetadata(
    dataview,
    mergedDataviewId
  )
  const layerLoaded = loaded && !error
  const layerLoadedDebounced = useDebounce(layerLoaded, 300)
  const layerLoading = layerActive && !layerLoadedDebounced && !error

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
    setPropertiesOpen(false)
  }
  const changeThickness = (thickness: ThicknessSelectorOption) => {
    upsertDataviewInstance({
      id: dataview.id,
      config: {
        thickness: thickness.value,
      },
    })
    setPropertiesOpen(false)
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
    setPropertiesOpen(!propertiesOpen)
  }

  const onToggleFilterOpen = () => {
    setFiltersOpen(!filterOpen)
  }

  const closeExpandedContainer = () => {
    setFiltersOpen(false)
    setPropertiesOpen(false)
  }

  const isUserLayer = !guestUser && dataset?.ownerId === userId
  const isBQEditorLayer = getIsBQEditorDataset(dataset)
  const showSortHandler = items.length > 1

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
        [styles.expandedContainerOpen]: filterOpen || propertiesOpen,
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
          <GFWOnly
            type="only-icon"
            style={{ transform: 'none' }}
            className={styles.gfwIcon}
            userGroup="gfw"
          />
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
          {layerActive && !error && (
            <>
              {isUserLayer && !isBQEditorLayer && (
                <IconButton
                  icon="edit"
                  size="small"
                  disabled={dataview.datasets?.[0]?.status === DatasetStatus.Importing}
                  tooltip={datasetGeometryType === 'draw' ? t('layer.editDraw') : t('dataset.edit')}
                  tooltipPlacement="top"
                  onClick={onEditClick}
                />
              )}
              <Fragment>
                <LayerProperties
                  dataview={dataview}
                  open={propertiesOpen}
                  disabled={hasFeaturesColoredByField}
                  onColorClick={changeColor}
                  onThicknessClick={changeThickness}
                  onToggleClick={onToggleColorOpen}
                  onClickOutside={closeExpandedContainer}
                  colorType={
                    dataview.config?.type === DataviewType.HeatmapStatic ||
                    dataview.config?.type === DataviewType.HeatmapAnimated
                      ? 'fill'
                      : 'line'
                  }
                  properties={
                    dataview?.config?.type === DataviewType.UserContext
                      ? POLYGON_PROPERTIES
                      : POINT_PROPERTIES
                  }
                />
              </Fragment>
              {datasetGeometryType === 'tracks' && (
                <FitBounds
                  hasError={error !== undefined}
                  layer={instance as UserTracksLayer}
                  disabled={layerLoading}
                />
              )}
              {hasSchemaFilters &&
                !HIDDEN_DATAVIEW_FILTERS.includes(dataview.dataviewId as string) && (
                  <ExpandedContainer
                    visible={filterOpen}
                    onClickOutside={closeExpandedContainer}
                    component={
                      <Filters dataview={dataview} onConfirmCallback={onToggleFilterOpen} />
                    }
                  >
                    <div className={styles.filterButtonWrapper}>
                      <IconButton
                        icon={filterOpen ? 'filter-on' : 'filter-off'}
                        size="small"
                        onClick={onToggleFilterOpen}
                        tooltip={filterOpen ? t('layer.filterClose') : t('layer.filterOpen')}
                        tooltipPlacement="top"
                      />
                    </div>
                  </ExpandedContainer>
                )}
            </>
          )}
          <InfoModal dataview={dataview} />
          <Remove
            dataview={dataview}
            loading={layerLoading && dataset?.status !== DatasetStatus.Importing}
          />
          {showSortHandler && (
            <IconButton
              size="small"
              ref={setActivatorNodeRef}
              {...listeners}
              icon={error ? 'warning' : 'drag'}
              type={error ? 'warning' : 'default'}
              tooltip={error ? error : ''}
              className={error ? styles.disabled : styles.dragger}
            />
          )}
        </div>
        <IconButton
          icon={layerActive ? (error ? 'warning' : 'more') : undefined}
          type={error ? 'warning' : 'default'}
          loading={layerLoading || dataset?.status === DatasetStatus.Importing}
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
