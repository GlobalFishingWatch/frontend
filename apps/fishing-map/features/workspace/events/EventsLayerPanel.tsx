import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { DatasetTypes } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { useDeckLayerLoadedState, useGetDeckLayer } from '@globalfishingwatch/deck-layer-composer'
import type { FourwingsClustersLayer } from '@globalfishingwatch/deck-layers'
import { IconButton } from '@globalfishingwatch/ui-components'

import { selectReadOnly } from 'features/app/selectors/app.selectors'
import { getDatasetLabel, getSchemaFiltersInDataview } from 'features/datasets/datasets.utils'
import { selectHasDeprecatedDataviewInstances } from 'features/dataviews/selectors/dataviews.instances.selectors'
import { selectIsGFWUser } from 'features/user/selectors/user.selectors'
import Remove from 'features/workspace/common/Remove'
import DatasetSchemaField from 'features/workspace/shared/DatasetSchemaField'
import ExpandedContainer from 'features/workspace/shared/ExpandedContainer'
import { useLayerPanelDataviewSort } from 'features/workspace/shared/layer-panel-sort.hook'
import styles from 'features/workspace/shared/LayerPanel.module.css'

import InfoModal from '../common/InfoModal'
import Filters from '../common/LayerFilters'
import LayerSwitch from '../common/LayerSwitch'
import Title from '../common/Title'
import DatasetNotFound from '../shared/DatasetNotFound'

type EventsLayerPanelProps = {
  dataview: UrlDataviewInstance
}

function EventsLayerPanel({ dataview }: EventsLayerPanelProps): React.ReactElement<any> {
  const { t } = useTranslation()
  const layerActive = dataview?.config?.visible ?? true
  const layerLoaded = useDeckLayerLoadedState()[dataview.id]?.loaded
  const [filterOpen, setFiltersOpen] = useState(false)
  const { filtersAllowed } = getSchemaFiltersInDataview(dataview)
  const isGFWUser = useSelector(selectIsGFWUser)
  const readOnly = useSelector(selectReadOnly)
  const showSchemaFilters = filtersAllowed.length > 0
  const hasSchemaFilterSelection = filtersAllowed.some(
    (schema) => schema.optionsSelected?.length > 0
  )
  const eventLayer = useGetDeckLayer<FourwingsClustersLayer>(dataview?.id)
  const hasDeprecatedDataviewInstances = useSelector(selectHasDeprecatedDataviewInstances)
  const layerError = eventLayer?.instance?.getError?.()
  const { items, attributes, listeners, setNodeRef, setActivatorNodeRef, style } =
    useLayerPanelDataviewSort(dataview.id)

  const dataset = dataview.datasets?.find(
    (d) => d.type === DatasetTypes.Events || d.type === DatasetTypes.Fourwings
  )

  const closeExpandedContainer = () => {
    setFiltersOpen(false)
  }

  const onToggleFilterOpen = () => {
    setFiltersOpen(!filterOpen)
  }

  if (!dataset || dataset.status === 'deleted') {
    return <DatasetNotFound dataview={dataview} />
  }

  const title = getDatasetLabel(dataset)

  return (
    <div
      className={cx(styles.LayerPanel, {
        [styles.expandedContainerOpen]: filterOpen,
        'print-hidden': !layerActive,
      })}
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      <div className={styles.header}>
        <LayerSwitch
          active={layerActive && !hasDeprecatedDataviewInstances}
          className={styles.switch}
          disabled={hasDeprecatedDataviewInstances}
          dataview={dataview}
        />
        <Title
          title={title}
          className={styles.name}
          classNameActive={styles.active}
          dataview={dataview}
          toggleVisibility={!hasDeprecatedDataviewInstances}
        />
        <div
          className={cx(
            'print-hidden',
            styles.actions,
            { [styles.active]: layerActive },
            styles.hideUntilHovered
          )}
        >
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
                    filterOpen
                      ? t('layer.filterClose', 'Close filters')
                      : t('layer.filterOpen', 'Open filters')
                  }
                  tooltipPlacement="top"
                />
              </div>
            </ExpandedContainer>
          )}
          <InfoModal dataview={dataview} />
          <Remove
            dataview={dataview}
            loading={layerActive && !layerLoaded && !hasDeprecatedDataviewInstances}
          />
          {!readOnly && layerActive && layerError && (
            <IconButton
              icon={'warning'}
              type={'warning'}
              tooltip={
                isGFWUser
                  ? `${t(
                      'errors.layerLoading',
                      'There was an error loading the layer'
                    )} (${layerError})`
                  : t('errors.layerLoading', 'There was an error loading the layer')
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
          icon={layerActive ? 'more' : undefined}
          type="default"
          loading={layerActive && !layerLoaded && !hasDeprecatedDataviewInstances}
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
