import React, { useState } from 'react'
import cx from 'classnames'
import useClickedOutside from 'hooks/useClickedOutside'
import { Switch, IconButton } from '@globalfishingwatch/ui-components'
import styles from './LayerPanel.module.css'
import Filters from './Filters'

function LayerPanel(): React.ReactElement {
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

  return (
    <div className={cx(styles.LayerPanel, { [styles.expandedContainerOpen]: filterOpen })}>
      <div className={styles.header}>
        <Switch
          active={layerActive}
          onClick={onToggleLayerActive}
          tooltip="Toggle layer visibility"
          tooltipPlacement="top"
        />
        <h3 className={cx(styles.name, { [styles.active]: layerActive })}>
          Apparent Fishing Effort
        </h3>
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
      <div className={styles.expandedContainer} ref={expandedContainerRef}>
        {filterOpen && <Filters />}
      </div>
    </div>
  )
}

export default LayerPanel
