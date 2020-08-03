import React from 'react'
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
    dataview && (
      <div className={styles.container} id={dataview.id as string}>
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
      </div>
    )
  )
}

export default DataviewGraphPanel
