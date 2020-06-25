import React from 'react'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import Button from '@globalfishingwatch/ui-components/dist/button'
import { DatasetConfig } from 'types'
import { useModalConnect } from 'features/modal/modal.hooks'
import { USER_DATA } from 'data/user-data'
import styles from './Datasets.module.css'

function Datasets(): React.ReactElement {
  const { showModal } = useModalConnect()
  const userDatasets: DatasetConfig[] = USER_DATA.datasets.user
  const sharedDatasets: DatasetConfig[] = USER_DATA.datasets.shared
  return (
    <div className={styles.container}>
      <h1 className="screen-reader-only">Datasets</h1>
      <label>Your Datasets</label>
      {userDatasets.map((dataset) => (
        <div className={styles.listItem} key={dataset.id}>
          <button className={styles.titleLink}>{dataset.label}</button>
          <IconButton icon="edit" tooltip="Edit Dataset" />
          <IconButton icon="share" tooltip="Share Dataset" />
          <IconButton icon="delete" type="warning" tooltip="Delete Dataset" />
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
      {sharedDatasets.map((dataset) => (
        <div className={styles.listItem} key={dataset.id}>
          <button className={styles.titleLink}>{dataset.label}</button>
          <IconButton icon="edit" tooltip="Edit Dataset" />
        </div>
      ))}
    </div>
  )
}

export default Datasets
