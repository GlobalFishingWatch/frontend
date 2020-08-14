import React from 'react'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import Button from '@globalfishingwatch/ui-components/dist/button'
import { useModalConnect } from 'features/modal/modal.hooks'
import styles from './Datasets.module.css'
import { useDatasetsConnect, useDatasetsAPI } from './datasets.hook'

function Datasets(): React.ReactElement {
  const { showModal } = useModalConnect()
  const { deleteDataset } = useDatasetsAPI()
  const { datasetStatus, datasetsList, datasetsSharedList } = useDatasetsConnect()
  return (
    <div className={styles.container}>
      <h1 className="screen-reader-only">Datasets</h1>
      <label>Your Datasets</label>
      {datasetsList.map((dataset) => (
        <div className={styles.listItem} key={dataset.id}>
          <button className={styles.titleLink}>{dataset.description}</button>
          <IconButton icon="edit" tooltip="Edit Dataset" />
          <IconButton icon="share" tooltip="Share Dataset" />
          <IconButton
            icon="delete"
            type="warning"
            tooltip="Delete Dataset"
            disabled={datasetStatus === 'loading'}
            onClick={() => deleteDataset(dataset.id)}
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
