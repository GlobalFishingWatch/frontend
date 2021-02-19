import React, { useState } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Switch, IconButton, TagList, Tooltip } from '@globalfishingwatch/ui-components'
import { TagItem } from '@globalfishingwatch/ui-components/dist/tag-list'
import { DatasetTypes } from '@globalfishingwatch/api-types'
import { getFlagsByIds } from 'utils/flags'
import { UrlDataviewInstance } from 'types'
import styles from 'features/workspace/shared/LayerPanel.module.css'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { selectBivariate } from 'features/app/app.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import { getSchemaFieldsSelectedInDataview } from 'features/datasets/datasets.utils'
import ExpandedContainer from 'features/workspace/shared/ExpandedContainer'
import Filters from './HeatmapFilters'
import HeatmapInfoModal from './HeatmapInfoModal'
import {
  getSourcesSelectedInDataview,
  isFishingDataview,
  isPresenceDataview,
} from './heatmaps.utils'

type LayerPanelProps = {
  index: number
  isOpen: boolean
  dataview: UrlDataviewInstance
}

function LayerPanel({ dataview, index, isOpen }: LayerPanelProps): React.ReactElement {
  const { t } = useTranslation()
  const [filterOpen, setFiltersOpen] = useState(isOpen === undefined ? false : isOpen)
  const [modalInfoOpen, setModalInfoOpen] = useState(false)
  let sourcesOptions: TagItem[] = getSourcesSelectedInDataview(dataview)
  const nonVmsSources = sourcesOptions.filter((source) => !source.label.includes('VMS'))
  const vmsSources = sourcesOptions.filter((source) => source.label.includes('VMS'))
  if (vmsSources?.length > 1) {
    sourcesOptions = [
      ...nonVmsSources,
      {
        id: 'vms-grouped',
        label: `VMS (${vmsSources.length} ${t('common.country_plural', 'countries')})`,
        tooltip: vmsSources.map((source) => source.label).join(', '),
      },
    ]
  }

  const fishingFiltersOptions = getFlagsByIds(dataview.config?.filters?.flag || [])
  const gearTypesSelected = getSchemaFieldsSelectedInDataview(dataview, 'geartype')
  const fleetsSelected = getSchemaFieldsSelectedInDataview(dataview, 'fleet')
  const vesselsSelected = getSchemaFieldsSelectedInDataview(dataview, 'vessel_type')
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
  let datasetName = dataset ? t(`datasets:${dataset?.id}.name`) : dataview.name || ''
  const fishignDataview = isFishingDataview(dataview)
  const presenceDataview = isPresenceDataview(dataview)
  if (fishignDataview || presenceDataview) {
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
          {layerActive && fishignDataview && (
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
              tooltip={dataset?.id ? t(`datasets:${dataset.id}.description`) : ''}
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
            {sourcesOptions?.length > 0 && (
              <div className={styles.filter}>
                <label>{t('layer.source_plural', 'Sources')}</label>
                <TagList
                  tags={sourcesOptions}
                  color={dataview.config?.color}
                  className={styles.tagList}
                />
              </div>
            )}
            {fishingFiltersOptions.length > 0 && (
              <div className={styles.filter}>
                <label>{t('layer.flagState_plural', 'Flag States')}</label>
                <TagList
                  tags={fishingFiltersOptions}
                  color={dataview.config?.color}
                  className={styles.tagList}
                />
              </div>
            )}
            {gearTypesSelected.length > 0 && (
              <div className={styles.filter}>
                <label>{t('layer.gearType_plural', 'Gear types')}</label>
                <TagList
                  tags={gearTypesSelected}
                  color={dataview.config?.color}
                  className={styles.tagList}
                />
              </div>
            )}
            {fleetsSelected.length > 0 && (
              <div className={styles.filter}>
                <label>{t('layer.fleet_plural', 'Fleets')}</label>
                <TagList
                  tags={fleetsSelected}
                  color={dataview.config?.color}
                  className={styles.tagList}
                />
              </div>
            )}
            {vesselsSelected.length > 0 && (
              <div className={styles.filter}>
                <label>{t('vessel.vesselType_plural', 'Vessel types')}</label>
                <TagList
                  tags={vesselsSelected}
                  color={dataview.config?.color}
                  className={styles.tagList}
                />
              </div>
            )}
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
