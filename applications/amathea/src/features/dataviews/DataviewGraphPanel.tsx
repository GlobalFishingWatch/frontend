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
import Circle from 'common/Circle'
import styles from './DataviewGraphPanel.module.css'
import DataviewGraph from './DataviewGraph'
import { useDraftDataviewConnect, useDataviewsAPI, useDataviewsConnect } from './dataviews.hook'

interface DataviewGraphPanelProps {
  dataview: Dataview
  graphConfig: DataviewGraphConfig
}

const DataviewGraphPanel: React.FC<DataviewGraphPanelProps> = (props) => {
  const { dataview, graphConfig } = props
  const { deleteDataview } = useDataviewsAPI()
  const { showModal } = useModalConnect()
  const { setDraftDataview } = useDraftDataviewConnect()
  const { dataviewsStatus, dataviewsStatusId } = useDataviewsConnect()
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

  const onDeleteClick = useCallback(
    (dataview: Dataview) => {
      const confirmation = window.confirm(
        `Are you sure you want to permanently delete this dataview?\n${dataview.name}`
      )
      if (confirmation) {
        deleteDataview(dataview.id)
      }
    },
    [deleteDataview]
  )
  const isUserContextLayer = dataset?.type === 'user-context-layer:v1'
  return (
    dataview && (
      <div className={styles.container} id={dataview.id.toString()}>
        <div className={styles.header}>
          {isUserContextLayer && <Circle className={styles.circleMargin} />}
          <p className={styles.title}>
            {dataview.name}
            {!isUserContextLayer && (
              <span className={styles.unit}>{graphConfig.unit && ` (${graphConfig.unit})`}</span>
            )}
          </p>
          <IconButton icon="info" tooltip={dataview.description} />
          <IconButton icon="edit" tooltip="Edit dataview" onClick={onEditClick} />
          {!isUserContextLayer && (
            <IconButton icon="download" tooltip="Download time series data (Coming soon)" />
          )}
          <IconButton
            icon="delete"
            type="warning"
            tooltip="Remove dataview"
            loading={dataviewsStatus === 'loading.delete' && dataviewsStatusId === dataview.id}
            onClick={() => onDeleteClick(dataview)}
          />
          <IconButton icon="view-on-map" tooltip="Show on map" />
        </div>
        {!isUserContextLayer && (
          <div className={styles.graph}>
            <DataviewGraph dataview={dataview} graphConfig={graphConfig} />
          </div>
        )}
      </div>
    )
  )
}

export default DataviewGraphPanel
