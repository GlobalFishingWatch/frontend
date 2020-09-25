import React, { useCallback } from 'react'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import Button from '@globalfishingwatch/ui-components/dist/button'
import { Dataset } from '@globalfishingwatch/dataviews-client'
import Spinner from '@globalfishingwatch/ui-components/dist/spinner'
import { useModalConnect } from 'features/modal/modal.hooks'
import styles from './Datasets.module.css'
import { useDatasetsConnect, useDatasetsAPI, useDraftDatasetConnect } from './datasets.hook'

function Datasets(): React.ReactElement {
  const { showModal } = useModalConnect()
  const { deleteDataset } = useDatasetsAPI()
  const { dispatchDraftDatasetData } = useDraftDatasetConnect()
  const {
    datasetStatus,
    datasetStatusId,
    datasetsUserList,
    datasetsSharedList,
  } = useDatasetsConnect()

  const onEditClick = useCallback(
    (dataset: Dataset) => {
      showModal('editDataset')
      dispatchDraftDatasetData({
        id: dataset.id,
        name: dataset.name,
        description: dataset.description,
      })
    },
    [dispatchDraftDatasetData, showModal]
  )

  const onDeleteClick = useCallback(
    (dataset: Dataset) => {
      const confirmation = window.confirm(
        `Are you sure you want to permanently delete this dataset?\n${dataset.name}`
      )
      if (confirmation) {
        deleteDataset(dataset.id)
      }
    },
    [deleteDataset]
  )

  if (datasetStatus === 'loading') {
    return <Spinner />
  }

  return (
    <div className={styles.container}>
      <h1 className="screen-reader-only">Datasets</h1>
      <label>Your Datasets</label>
      {datasetsUserList.map((dataset) => (
        <div className={styles.listItem} key={dataset.id}>
          <span className={styles.titleLink}>{dataset.name}</span>
          {dataset.status === 'error' && <IconButton icon="warning" tooltip={dataset.importLogs} />}
          <IconButton icon="info" tooltip={dataset.description} />
          <IconButton icon="edit" tooltip="Edit Dataset" onClick={() => onEditClick(dataset)} />
          <IconButton icon="share" tooltip="Share Dataset" />
          <IconButton
            icon="delete"
            type="warning"
            tooltip="Delete Dataset"
            loading={datasetStatus === 'loading.delete' && datasetStatusId === dataset.id}
            onClick={() => onDeleteClick(dataset)}
          />
        </div>
      ))}
      <Button
        onClick={() => {
          showModal('newDataset')
        }}
        className={styles.rightSide}
      >
        Create new dataset
      </Button>
      <label>Datasets shared with you</label>
      {datasetsSharedList.map((dataset) => (
        <div className={styles.listItem} key={dataset.id}>
          <button className={styles.titleLink}>{dataset.description}</button>
          <IconButton icon="edit" tooltip="Edit Dataset" />
        </div>
      ))}
    </div>
  )
}

export default Datasets
