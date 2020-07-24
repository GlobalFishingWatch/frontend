import React, { Fragment } from 'react'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import { DataviewGraphConfig } from 'data/data'
import styles from './DataviewGraphPanel.module.css'
import DataviewGraph from './DataviewGraph'

interface DataviewGraphPanelProps {
  dataview: DataviewGraphConfig
}

const DataviewGraphPanel: React.FC<DataviewGraphPanelProps> = (props) => {
  const { dataview } = props
  return (
    <div className={styles.container}>
      {dataview && (
        <Fragment>
          <div className={styles.header}>
            <p className={styles.title}>
              {dataview.name}
              <span className={styles.unit}>{dataview.unit && ` (${dataview.unit})`}</span>
            </p>
            <IconButton icon="info" tooltip={dataview.description} />
            <IconButton icon="edit" tooltip="Edit dataview" />
            <IconButton icon="download" tooltip="Download time series data" />
            <IconButton icon="delete" type="warning" tooltip="Remove dataview" />
            <IconButton icon="view-on-map" tooltip="Show on map" />
          </div>
          <DataviewGraph dataview={dataview} />
        </Fragment>
      )}
    </div>
  )
}

export default DataviewGraphPanel
