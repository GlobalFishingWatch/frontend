import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import { Dataview } from '@globalfishingwatch/dataviews-client'
import {
  DataviewGraphConfig,
  DatasetSources,
  DATASET_SOURCE_IDS,
  DATASET_SOURCE_OPTIONS,
} from 'data/data'
import { useModalConnect } from 'features/modal/modal.hooks'
import { selectDatasetById } from 'features/datasets/datasets.slice'
import styles from './DataviewGraphPanel.module.css'
import DataviewGraph from './DataviewGraph'
import { useDataviewsConnect, useDraftDataviewConnect } from './dataviews.hook'

interface DataviewGraphPanelProps {
  dataview: Dataview
  graphConfig: DataviewGraphConfig
}

const DataviewGraphPanel: React.FC<DataviewGraphPanelProps> = (props) => {
  const { dataview, graphConfig } = props
  const { deleteDataview } = useDataviewsConnect()
  const { showModal } = useModalConnect()
  const { setDraftDataview } = useDraftDataviewConnect()
  const datasetId = dataview.datasets?.length ? dataview.datasets[0].id : ''
  const dataset = useSelector(selectDatasetById(datasetId))
  const onEditClick = useCallback(() => {
    if (dataset) {
      const sourceLabelId = DATASET_SOURCE_IDS[dataset.source as DatasetSources]
      const sourceLabel = DATASET_SOURCE_OPTIONS.find((d) => d.id === sourceLabelId)?.label || ''
      const draftDataview = {
        id: dataview.id,
        label: dataview.name,
        color: dataview.defaultView?.color as string,
        source: { id: dataset.source, label: sourceLabel },
        dataset: {
          id: dataset?.id,
          label: dataset?.name,
          type: dataset?.type,
          description: dataset?.description,
        },
      }
      setDraftDataview(draftDataview)
      showModal('newDataview')
    }
  }, [dataset, dataview, setDraftDataview, showModal])
  return (
    dataview && (
      <div className={styles.container} id={dataview.id.toString()}>
        <div className={styles.header}>
          <p className={styles.title}>
            {dataview.name}
            <span className={styles.unit}>{graphConfig.unit && ` (${graphConfig.unit})`}</span>
          </p>
          <IconButton icon="info" tooltip={dataview.description} />
          <IconButton icon="edit" tooltip="Edit dataview" onClick={onEditClick} />
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
