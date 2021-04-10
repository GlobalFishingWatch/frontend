import React, { useState } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Switch, IconButton, Tooltip } from '@globalfishingwatch/ui-components'
import { DatasetTypes } from '@globalfishingwatch/api-types'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import styles from 'features/workspace/shared/LayerPanel.module.css'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { selectBivariate } from 'features/app/app.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import ExpandedContainer from 'features/workspace/shared/ExpandedContainer'
import DatasetFilterSource from '../shared/DatasetSourceField'
import DatasetFlagField from '../shared/DatasetFlagsField'
import DatasetSchemaField from '../shared/DatasetSchemaField'
import Filters from './HeatmapFilters'
import HeatmapInfoModal from './HeatmapInfoModal'
import { isFishingDataview, isPresenceDataview } from './heatmaps.utils'

type LayerPanelProps = {
  index: number
  isOpen: boolean
  dataview: UrlDataviewInstance
}

function LayerPanel({ dataview, index, isOpen }: LayerPanelProps): React.ReactElement {
  const { t } = useTranslation()
  const [filterOpen, setFiltersOpen] = useState(isOpen === undefined ? false : isOpen)
  const [modalInfoOpen, setModalInfoOpen] = useState(false)

  const { upsertDataviewInstance, deleteDataviewInstance } = useDataviewInstancesConnect()
  const { dispatchQueryParams } = useLocationConnect()
  const bivariate = useSelector(selectBivariate)

  const layerActive = dataview?.config?.visible ?? true
  const onToggleLayerActive = () => {
    upsertDataviewInstance({
      id: dataview.id,
      config: {
        visible: bivariate ? true : !layerActive,
      },
    })
  }

  const onRemoveLayerClick = () => {
    if (index < 2) {
      dispatchQueryParams({ bivariate: false })
    }
    deleteDataviewInstance(dataview.id)
  }

  const onToggleFilterOpen = () => {
    setFiltersOpen(!filterOpen)
  }

  const onInfoLayerClick = () => {
    setModalInfoOpen(true)
  }

  const closeExpandedContainer = () => {
    setFiltersOpen(false)
  }

  const dataset = dataview.datasets?.find((d) => d.type === DatasetTypes.Fourwings)
  let datasetName = dataset
    ? t(`datasets:${dataset?.id?.split(':')[0]}.name` as any)
    : dataview.name || ''
  const fishingDataview = isFishingDataview(dataview)
  const presenceDataview = isPresenceDataview(dataview)
  if (fishingDataview || presenceDataview) {
    datasetName = presenceDataview
      ? t(`common.presence`, 'Fishing presence')
      : t(`common.apparentFishing`, 'Apparent Fishing Effort')
  }
  const showInfoModal = isFishingDataview(dataview)
  const TitleComponent = (
    <h3 className={cx(styles.name, { [styles.active]: layerActive })} onClick={onToggleLayerActive}>
      {datasetName}
    </h3>
  )

  return (
    <div
      className={cx(styles.LayerPanel, {
        [styles.expandedContainerOpen]: filterOpen,
        [styles.noBorder]: bivariate,
        'print-hidden': !layerActive,
      })}
    >
      <div className={styles.header}>
        <Switch
          active={layerActive}
          onClick={onToggleLayerActive}
          tooltip={t('layer.toggleVisibility', 'Toggle layer visibility')}
          tooltipPlacement="top"
          color={dataview.config?.color}
          className={styles.switch}
          disabled={bivariate}
        />
        {datasetName.length > 24 ? (
          <Tooltip content={datasetName}>{TitleComponent}</Tooltip>
        ) : (
          TitleComponent
        )}
        <div className={cx('print-hidden', styles.actions, { [styles.active]: layerActive })}>
          {layerActive && fishingDataview && (
            <ExpandedContainer
              visible={filterOpen}
              onClickOutside={closeExpandedContainer}
              component={<Filters dataview={dataview} />}
            >
              <IconButton
                icon={filterOpen ? 'filter-on' : 'filter-off'}
                size="small"
                onClick={onToggleFilterOpen}
                className={styles.actionButton}
                tooltip={
                  filterOpen
                    ? t('layer.filterClose', 'Close filters')
                    : t('layer.filterOpen', 'Open filters')
                }
                tooltipPlacement="top"
              />
            </ExpandedContainer>
          )}
          {showInfoModal ? (
            <IconButton
              icon="info"
              size="small"
              className={styles.actionButton}
              tooltip={t(`layer.seeDescription`, 'Click to see layer description')}
              tooltipPlacement="top"
              onClick={onInfoLayerClick}
            />
          ) : (
            <IconButton
              icon="info"
              size="small"
              className={styles.actionButton}
              tooltip={dataset?.id ? t(`datasets:${dataset.id}.description` as any) : ''}
              tooltipPlacement="top"
            />
          )}
          <IconButton
            icon="delete"
            size="small"
            className={styles.actionButton}
            tooltip={t('layer.remove', 'Remove layer')}
            tooltipPlacement="top"
            onClick={onRemoveLayerClick}
          />
        </div>
      </div>
      {layerActive && (
        <div className={styles.properties}>
          <div className={styles.filters}>
            <div className={styles.filters}>
              <DatasetFilterSource dataview={dataview} />
              <DatasetFlagField dataview={dataview} />
              <DatasetSchemaField
                dataview={dataview}
                field={'geartype'}
                label={t('layer.gearType_plural', 'Gear types')}
              />
              <DatasetSchemaField
                dataview={dataview}
                field={'fleet'}
                label={t('layer.fleet_plural', 'Fleets')}
              />
              <DatasetSchemaField
                dataview={dataview}
                field={'origin'}
                label={t('vessel.origin', 'Origin')}
              />
              <DatasetSchemaField
                dataview={dataview}
                field={'vessel_type'}
                label={t('vessel.vesselType_plural', 'Vessel types')}
              />
            </div>
          </div>
          <div id={`legend_${dataview.id}`}></div>
        </div>
      )}
      <HeatmapInfoModal
        dataview={dataview}
        isOpen={modalInfoOpen}
        onClose={() => setModalInfoOpen(false)}
      />
    </div>
  )
}

export default LayerPanel
