import React, { Fragment, useState } from 'react'
import cx from 'classnames'
import { MultiSelect, SelectOption, Switch, IconButton } from '@globalfishingwatch/ui-components'
import styles from './LayerPanel.module.css'

const sources: SelectOption[] = [
  {
    id: 'ais',
    label: 'AIS',
  },
  {
    id: 'vms-all',
    label: 'VMS (X COUNTRIES)',
  },
  {
    id: 'vms-chile',
    label: 'VMS Chile',
  },
  {
    id: 'vms-indonesia',
    label: 'VMS Indonesia',
  },
  {
    id: 'vms-panama',
    label: 'VMS Panama',
  },
]

function LayerPanel(): React.ReactElement {
  const [layerActive, setLayerActive] = useState(Math.random() >= 0.5 ? true : false)
  const [filterOpen, setFiltersOpen] = useState(false)
  const [sourcesSelected, setSourcesSelected] = useState<SelectOption[]>([
    {
      id: 'ais',
      label: 'AIS',
    },
    {
      id: 'vms-all',
      label: 'VMS (X COUNTRIES)',
    },
  ])
  const onToggleLayerActive = () => {
    setLayerActive(!layerActive)
  }

  const onToggleFilterOpen = () => {
    setFiltersOpen(!filterOpen)
  }

  return (
    <div className={cx(styles.LayerPanel, { [styles.expandedContainerOpen]: filterOpen })}>
      <div className={styles.header}>
        <Switch active={layerActive} onClick={onToggleLayerActive} />
        <h3 className={cx(styles.name, { [styles.active]: layerActive })}>Layer name</h3>
        <div className={cx(styles.actions, { [styles.active]: layerActive })}>
          {layerActive && <IconButton icon="download" size="small" />}
          {layerActive && (
            <IconButton
              icon={filterOpen ? 'filter-on' : 'filter-off'}
              size="small"
              onClick={onToggleFilterOpen}
            />
          )}
          <IconButton icon="info" size="small" />
          <IconButton icon="delete" size="small" />
        </div>
      </div>
      <div className={styles.expandedContainer}>
        {filterOpen && (
          <Fragment>
            <label className={styles.selectLabel}>Sources</label>
            <MultiSelect
              options={sources}
              selectedOptions={sourcesSelected}
              onSelect={(e) => {
                console.log(e)
              }}
              onRemove={(e) => {
                console.log(e)
              }}
            />
            <label className={styles.selectLabel}>Flag States</label>
            <MultiSelect
              options={sources}
              selectedOptions={sourcesSelected}
              onSelect={(e) => {
                console.log(e)
              }}
              onRemove={(e) => {
                console.log(e)
              }}
            />
          </Fragment>
        )}
      </div>
    </div>
  )
}

export default LayerPanel
