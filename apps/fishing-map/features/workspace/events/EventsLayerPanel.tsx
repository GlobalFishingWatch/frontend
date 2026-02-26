import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { DatasetTypes } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { useDeckLayerLoadedState, useGetDeckLayer } from '@globalfishingwatch/deck-layer-composer'
import type { FourwingsClustersLayer } from '@globalfishingwatch/deck-layers'
import type { ColorBarOption } from '@globalfishingwatch/ui-components'
import { IconButton } from '@globalfishingwatch/ui-components'

import { selectReadOnly } from 'features/app/selectors/app.selectors'
import {
  getDatasetLabel,
  getSchemaFiltersInDataview,
  isPrivateDataset,
} from 'features/datasets/datasets.utils'
import { useMigrateToLatestDataview } from 'features/dataviews/dataviews.hooks'
import { selectIsGFWUser, selectIsGuestUser } from 'features/user/selectors/user.selectors'
import { useVesselGroupsOptions } from 'features/vessel-groups/vessel-groups.hooks'
import DatasetLoginRequired from 'features/workspace/shared/DatasetLoginRequired'
import DatasetSchemaField from 'features/workspace/shared/DatasetSchemaField'
import ExpandedContainer from 'features/workspace/shared/ExpandedContainer'
import { useLayerPanelDataviewSort } from 'features/workspace/shared/layer-panel-sort.hook'
import Remove from 'features/workspace/shared/Remove'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { selectIsWorkspaceOwner } from 'features/workspace/workspace.selectors'

import DatasetNotFound from '../shared/DatasetNotFound'
import InfoModal from '../shared/InfoModal'
import Filters from '../shared/LayerFilters'
import LayerProperties from '../shared/LayerProperties'
import LayerSwitch from '../shared/LayerSwitch'
import Title from '../shared/Title'

import styles from 'features/workspace/shared/LayerPanel.module.css'

type EventsLayerPanelProps = {
  dataview: UrlDataviewInstance
  onToggle?: () => void
}

function EventsLayerPanel({ dataview, onToggle }: EventsLayerPanelProps): React.ReactElement<any> {
  const { t } = useTranslation()
  const layerActive = dataview?.config?.visible ?? true
  const layerLoaded = useDeckLayerLoadedState()[dataview.id]?.loaded
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const [filterOpen, setFiltersOpen] = useState(false)
  const [colorOpen, setColorOpen] = useState(false)
  const vesselGroupsOptions = useVesselGroupsOptions()
  const { filtersAllowed } = getSchemaFiltersInDataview(dataview, {
    vesselGroups: vesselGroupsOptions,
  })
  const { migrateToLatestDataviewInstance } = useMigrateToLatestDataview()
  const isGFWUser = useSelector(selectIsGFWUser)
  const readOnly = useSelector(selectReadOnly)
  const isWorkspaceOwner = useSelector(selectIsWorkspaceOwner)
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

  const onUpdateDeprecatedLayerClick = () => {
    migrateToLatestDataviewInstance(dataview)
  }

  if (!dataset || dataset.status === 'deleted') {
    const dataviewHasPrivateDataset = dataview.datasetsConfig?.some((d) =>
      isPrivateDataset({ id: d.datasetId })
    )
    return guestUser && dataviewHasPrivateDataset ? (
      <DatasetLoginRequired dataview={dataview} />
    ) : (
      <DatasetNotFound dataview={dataview} />
    )
    return <DatasetNotFound dataview={dataview} />
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
          <InfoModal dataview={dataview} />
          <Remove dataview={dataview} loading={layerActive && !layerLoaded} />
          {!readOnly && layerActive && (layerError || showDeprecatedWarning) && (
            <IconButton
              icon="warning"
              type="warning-invert"
              onClick={showDeprecatedWarning ? onUpdateDeprecatedLayerClick : undefined}
              tooltip={
                showDeprecatedWarning
                  ? t((t) => t.workspace.deprecatedActivityLayer)
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
          type={layerActive && (layerError || showDeprecatedWarning) ? 'warning-invert' : 'default'}
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
