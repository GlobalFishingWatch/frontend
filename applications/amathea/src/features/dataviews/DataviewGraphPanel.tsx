import React from 'react'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import { Dataview } from '@globalfishingwatch/dataviews-client'
import { DataviewGraphConfig } from 'data/data'
import styles from './DataviewGraphPanel.module.css'
import DataviewGraph from './DataviewGraph'
import { useDataviewsConnect } from './dataviews.hook'

interface DataviewGraphPanelProps {
  dataview: Dataview
  graphConfig: DataviewGraphConfig
}

const DataviewGraphPanel: React.FC<DataviewGraphPanelProps> = (props) => {
  const { dataview, graphConfig } = props
  const { deleteDataview } = useDataviewsConnect()
  return (
    dataview && (
      <div className={styles.container} id={dataview.id.toString()}>
        <div className={styles.header}>
          <p className={styles.title}>
            {dataview.name}
            <span className={styles.unit}>{graphConfig.unit && ` (${graphConfig.unit})`}</span>
          </p>
          <IconButton icon="info" tooltip={dataview.description} />
          <IconButton icon="edit" tooltip="Edit dataview" />
          <IconButton icon="download" tooltip="Download time series data (Cooming soon)" />
          <IconButton
            icon="delete"
            type="warning"
            tooltip="Remove dataview"
            onClick={() => deleteDataview(dataview.id)}
          />
          <IconButton icon="view-on-map" tooltip="Show on map" />
        </div>
        <DataviewGraph dataview={dataview} graphConfig={graphConfig} />
      </div>
    )
  )
}

export default DataviewGraphPanel
