import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { DatasetTypes } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { useDeckLayerLoaded, useGetDeckLayer } from '@globalfishingwatch/deck-layer-composer'
import type { FourwingsClustersLayer } from '@globalfishingwatch/deck-layers'
import type { ColorBarOption } from '@globalfishingwatch/ui-components'
import { IconButton } from '@globalfishingwatch/ui-components'

import { getDatasetLabel, isPrivateDataset } from 'features/_map/datasets/datasets.utils'
import { getFiltersInDataview } from 'features/_map/dataviews/dataviews.filters'
import { useMigrateToLatestDataview } from 'features/_map/dataviews/dataviews.hooks'
import { selectReadOnly } from 'features/_map/workspace/selectors/app.selectors'
import DatasetLoginRequired from 'features/_map/workspace/shared/DatasetLoginRequired'
import DatasetSchemaField from 'features/_map/workspace/shared/DatasetSchemaField'
import ExpandedContainer from 'features/_map/workspace/shared/ExpandedContainer'
import { useLayerPanelDataviewSort } from 'features/_map/workspace/shared/layer-panel-sort.hook'
import Remove from 'features/_map/workspace/shared/Remove'
import { useDataviewInstancesConnect } from 'features/_map/workspace/workspace.hook'
import {
  selectIsWorkspaceOwnerOrDefault,
  selectIsWorkspaceRefreshing,
} from 'features/_map/workspace/workspace.selectors'
import { selectIsGFWUser, selectIsGuestUser } from 'features/_user/selectors/user.selectors'
import { useVesselGroupsOptions } from 'features/_user/vessel-groups/vessel-groups.hooks'

import DatasetNotFound from '../shared/DatasetNotFound'
import InfoButton from '../shared/InfoButton'
import Filters from '../shared/LayerFilters'
import LayerProperties from '../shared/LayerProperties'
import LayerSwitch from '../shared/LayerSwitch'
import Title from '../shared/Title'

import styles from 'features/_map/workspace/shared/LayerPanel.module.css'

type EventsLayerPanelProps = {
  dataview: UrlDataviewInstance
  onToggle?: () => void
}

function EventsLayerPanel({ dataview, onToggle }: EventsLayerPanelProps): React.ReactElement<any> {
  const { t } = useTranslation()
  const layerActive = dataview?.config?.visible ?? true
  const layerLoaded = useDeckLayerLoaded(dataview.id)
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const [filterOpen, setFiltersOpen] = useState(false)
  const [colorOpen, setColorOpen] = useState(false)
  const vesselGroupsOptions = useVesselGroupsOptions()
  const isWorkspaceRefreshing = useSelector(selectIsWorkspaceRefreshing)
  const { filtersAllowed } = getFiltersInDataview(dataview, {
    vesselGroups: vesselGroupsOptions,
  })
  const {
    onMigrateDataviewClick,
    getIsDataviewMigrated,
    isLoading: isMigrating,
  } = useMigrateToLatestDataview()
  const isGFWUser = useSelector(selectIsGFWUser)
  const readOnly = useSelector(selectReadOnly)
  const isWorkspaceOwner = useSelector(selectIsWorkspaceOwnerOrDefault)
  const showSchemaFilters = filtersAllowed.length > 0
  const hasSchemaFilterSelection = filtersAllowed.some(
    (schema) => schema.optionsSelected?.length > 0
  )
  const eventLayer = useGetDeckLayer<FourwingsClustersLayer>(dataview?.id)
  const layerError = eventLayer?.instance?.getError?.()
  const { items, attributes, listeners, setNodeRef, setActivatorNodeRef, style } =
    useLayerPanelDataviewSort(dataview.id)
  const guestUser = useSelector(selectIsGuestUser)
  const showDeprecatedWarning = isWorkspaceOwner && dataview.deprecated

  const dataset = dataview.datasets?.find(
    (d) => d.type === DatasetTypes.Events || d.type === DatasetTypes.Fourwings
  )

  const closeExpandedContainer = () => {
    setFiltersOpen(false)
    setColorOpen(false)
  }

  const onToggleFilterOpen = () => {
    setFiltersOpen(!filterOpen)
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

  if (!dataset || dataset.status === 'deleted') {
    const dataviewHasPrivateDataset = dataview.datasetsConfig?.some((d) =>
      isPrivateDataset({ id: d.datasetId })
    )
    return (guestUser || isWorkspaceRefreshing) && dataviewHasPrivateDataset ? (
      <DatasetLoginRequired dataview={dataview} isLoading={isWorkspaceRefreshing} />
    ) : (
      <DatasetNotFound dataview={dataview} />
    )
  }

  const title = getDatasetLabel(dataset)

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
          active={layerActive}
          className={styles.switch}
          dataview={dataview}
          onToggle={onToggle}
          testId={`events-layer-switch-${dataview.id}`}
        />
        <Title
          title={title}
          className={styles.name}
          classNameActive={styles.active}
          dataview={dataview}
          onToggle={onToggle}
        />
        <div
          className={cx(
            'print-hidden',
            styles.actions,
            { [styles.active]: layerActive },
            styles.hideUntilHovered
          )}
        >
          {layerActive && (
            <LayerProperties
              dataview={dataview}
              open={colorOpen}
              onColorClick={changeColor}
              onToggleClick={onToggleColorOpen}
              onClickOutside={closeExpandedContainer}
            />
          )}
          {layerActive && showSchemaFilters && (
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
                    filterOpen ? t((t) => t.layer.filterClose) : t((t) => t.layer.filterOpen)
                  }
                  tooltipPlacement="top"
                />
              </div>
            </ExpandedContainer>
          )}
          <InfoButton dataview={dataview} />
          <Remove
            dataview={dataview}
            loading={layerActive && !layerLoaded}
            testId={`events-layer-panel-remove-${dataview.id}`}
          />
          {!readOnly && layerActive && (layerError || showDeprecatedWarning) && (
            <IconButton
              icon="warning"
              type={showDeprecatedWarning ? 'warning-invert' : 'warning'}
              loading={showDeprecatedWarning && isMigrating}
              disabled={showDeprecatedWarning && isMigrating}
              onClick={showDeprecatedWarning ? () => onMigrateDataviewClick(dataview) : undefined}
              tooltip={
                showDeprecatedWarning
                  ? getIsDataviewMigrated(dataview)
                    ? t((t) => t.workspace.deprecatedActivityLayerMigrated)
                    : t((t) => t.workspace.deprecatedActivityLayer)
                  : isGFWUser
                    ? `${t((t) => t.errors.layerLoading)} (${layerError})`
                    : t((t) => t.errors.layerLoading)
              }
              size="small"
            />
          )}
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
        <IconButton
          icon={
            layerActive ? (layerError || showDeprecatedWarning ? 'warning' : 'more') : undefined
          }
          type={
            layerActive
              ? showDeprecatedWarning
                ? 'warning-invert'
                : layerError
                  ? 'warning'
                  : 'default'
              : 'default'
          }
          loading={!showDeprecatedWarning && layerActive && !layerLoaded}
          className={cx('print-hidden', styles.shownUntilHovered)}
          size="small"
        />
      </div>
      {layerActive && hasSchemaFilterSelection && (
        <div className={styles.properties}>
          <div className={styles.filters}>
            <div className={styles.filters}>
              {filtersAllowed.map(({ id, label }) => (
                <DatasetSchemaField key={id} dataview={dataview} field={id} label={label} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EventsLayerPanel
