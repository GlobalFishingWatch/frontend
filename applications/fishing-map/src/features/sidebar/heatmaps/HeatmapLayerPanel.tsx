import React, { useState } from 'react'
import cx from 'classnames'
import useClickedOutside from 'hooks/useClickedOutside'
import { useSelector } from 'react-redux'
import { WorkspaceDataview } from 'types'
import { Switch, IconButton, TagList, Tooltip } from '@globalfishingwatch/ui-components'
import { selectFishingFilters } from 'routes/routes.selectors'
import styles from 'features/sidebar/common/LayerPanel.module.css'
import { useDataviewsConfigConnect } from 'features/workspace/workspace.hook'
import Filters from './HeatmapFilters'

type LayerPanelProps = {
  dataview: WorkspaceDataview
}

function LayerPanel({ dataview }: LayerPanelProps): React.ReactElement {
  const [filterOpen, setFiltersOpen] = useState(false)
  const fishingFilters = useSelector(selectFishingFilters)
  const { updateDataviewConfig, removeDataviewConfig } = useDataviewsConfigConnect()

  const layerActive = dataview?.config?.visible ?? true
  const onToggleLayerActive = () => {
    updateDataviewConfig({
      id: dataview.configId,
      config: { visible: !layerActive },
    })
  }
  const onRemoveLayerClick = () => {
    removeDataviewConfig(dataview.configId)
  }

  const onToggleFilterOpen = () => {
    setFiltersOpen(!filterOpen)
  }

  const closeExpandedContainer = () => {
    setFiltersOpen(false)
  }
  const expandedContainerRef = useClickedOutside(closeExpandedContainer)
  const TitleComponent = (
    <h3 className={cx(styles.name, { [styles.active]: layerActive })} onClick={onToggleLayerActive}>
      {dataview.name}
    </h3>
  )

  return (
    <div className={cx(styles.LayerPanel, { [styles.expandedContainerOpen]: filterOpen })}>
      <div className={styles.header}>
        <Switch
          active={layerActive}
          onClick={onToggleLayerActive}
          tooltip="Toggle layer visibility"
          tooltipPlacement="top"
          color={dataview.config.color}
        />
        {dataview.name.length > 30 ? (
          <Tooltip content={dataview.name}>{TitleComponent}</Tooltip>
        ) : (
          TitleComponent
        )}
        <div className={cx(styles.actions, { [styles.active]: layerActive })}>
          {layerActive && (
            <IconButton
              icon={filterOpen ? 'filter-on' : 'filter-off'}
              size="small"
              onClick={onToggleFilterOpen}
              className={cx(styles.actionButton, styles.expandable, {
                [styles.expanded]: filterOpen,
              })}
              tooltip="Filter"
              tooltipPlacement="top"
            />
          )}
          <IconButton
            icon="info"
            size="small"
            className={styles.actionButton}
            tooltip={dataview.description}
            tooltipPlacement="top"
          />
          <IconButton
            icon="delete"
            size="small"
            className={styles.actionButton}
            tooltip="Delete"
            tooltipPlacement="top"
            onClick={onRemoveLayerClick}
          />
        </div>
      </div>
      {layerActive && fishingFilters.length > 0 && (
        <div className={styles.properties}>
          <label>Filters</label>
          <TagList tags={fishingFilters} color={dataview.config.color} className={styles.tagList} />
        </div>
      )}
      <div className={styles.expandedContainer} ref={expandedContainerRef}>
        {filterOpen && <Filters dataview={dataview} />}
      </div>
    </div>
  )
}

export default LayerPanel
