import React, { useState, Fragment } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Switch, IconButton, TagList, Tooltip } from '@globalfishingwatch/ui-components'
import useClickedOutside from 'hooks/use-clicked-outside'
import { getFlagsByIds } from 'utils/flags'
import { UrlDataviewInstance } from 'types'
import styles from 'features/sidebar/LayerPanel.module.css'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { FISHING_DATASET_TYPE } from 'data/datasets'
import { selectBivariate } from 'features/app/app.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import Filters from './HeatmapFilters'
import { getSourcesSelectedInDataview } from './heatmaps.utils'
import HeatmapInfoModal from './HeatmapInfoModal'

type LayerPanelProps = {
  dataview: UrlDataviewInstance
}

function LayerPanel({ dataview }: LayerPanelProps): React.ReactElement {
  const { t } = useTranslation()
  const [filterOpen, setFiltersOpen] = useState(false)
  const [modalInfoOpen, setModalInfoOpen] = useState(false)
  const sourcesOptions = getSourcesSelectedInDataview(dataview)
  const fishingFiltersOptions = getFlagsByIds(dataview.config?.filters || [])
  const { upsertDataviewInstance, deleteDataviewInstance } = useDataviewInstancesConnect()
  const { dispatchQueryParams } = useLocationConnect()
  const bivariate = useSelector(selectBivariate)

  const layerActive = bivariate ? true : dataview?.config?.visible ?? true
  const onToggleLayerActive = () => {
    upsertDataviewInstance({
      id: dataview.id,
      config: {
        visible: bivariate ? true : !layerActive,
      },
    })
  }
  const onRemoveLayerClick = () => {
    dispatchQueryParams({ bivariate: false })
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
  const expandedContainerRef = useClickedOutside(closeExpandedContainer)

  const dataset = dataview.datasets?.find((d) => d.type === FISHING_DATASET_TYPE)
  const datasetName = t(`datasets:${dataset?.id}.name`)
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
          tooltip={t('layer.toggle_visibility', 'Toggle layer visibility')}
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
          {layerActive && (
            <IconButton
              icon={filterOpen ? 'filter-on' : 'filter-off'}
              size="small"
              onClick={onToggleFilterOpen}
              className={cx(styles.actionButton, styles.expandable, {
                [styles.expanded]: filterOpen,
              })}
              tooltip={
                filterOpen
                  ? t('layer.filter_close', 'Close filters')
                  : t('layer.filter_open', 'Open filters')
              }
              tooltipPlacement="top"
            />
          )}
          <IconButton
            icon="info"
            size="small"
            className={styles.actionButton}
            tooltip={t(`layer.seeDescription`, 'Click to see layer description')}
            tooltipPlacement="top"
            onClick={onInfoLayerClick}
          />
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
          {sourcesOptions?.length > 0 && (
            <Fragment>
              <label>{t('layer.source_plural', 'Sources')}</label>
              <TagList
                tags={sourcesOptions}
                color={dataview.config?.color}
                className={styles.tagList}
              />
            </Fragment>
          )}
          {fishingFiltersOptions.length > 0 && (
            <Fragment>
              <label>{t('layer.flag_state_plural', 'Flag States')}</label>
              <TagList
                tags={fishingFiltersOptions}
                color={dataview.config?.color}
                className={styles.tagList}
              />
            </Fragment>
          )}
          <div id={`legend_${dataview.id}`}></div>
        </div>
      )}
      <div className={styles.expandedContainer} ref={expandedContainerRef}>
        {filterOpen && <Filters dataview={dataview} />}
      </div>
      <HeatmapInfoModal
        dataview={dataview}
        isOpen={modalInfoOpen}
        onClose={() => setModalInfoOpen(false)}
      />
    </div>
  )
}

export default LayerPanel
