import React, { useState } from 'react'
import cx from 'classnames'
import useClickedOutside from 'hooks/useClickedOutside'
import { Switch, IconButton, TagList, Tooltip } from '@globalfishingwatch/ui-components'
import { Dataview } from '@globalfishingwatch/dataviews-client'
import { getDatasetsByDataview } from 'features/workspace/workspace.selectors'
import styles from './LayerPanel.module.css'
import Filters from './Filters'

type LayerPanelProps = {
  dataview: Dataview
}

function LayerPanel({ dataview }: LayerPanelProps): React.ReactElement {
  const [layerActive, setLayerActive] = useState(true)
  const [filterOpen, setFiltersOpen] = useState(false)

  const onToggleLayerActive = () => {
    setLayerActive(!layerActive)
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

  const sources = getDatasetsByDataview(dataview)
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
            tooltip="Info"
            tooltipPlacement="top"
          />
          <IconButton
            icon="delete"
            size="small"
            className={styles.actionButton}
            tooltip="Delete"
            tooltipPlacement="top"
          />
        </div>
      </div>
      {layerActive && dataview.datasetsConfig && (
        <div className={styles.properties}>
          <label>Sources</label>
          <TagList tags={sources} color={dataview.config.color} className={styles.tagList} />
        </div>
      )}
      <div className={styles.expandedContainer} ref={expandedContainerRef}>
        {filterOpen && <Filters />}
      </div>
    </div>
  )
}

export default LayerPanel
