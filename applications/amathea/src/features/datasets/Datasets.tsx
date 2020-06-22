import React from 'react'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import Button from '@globalfishingwatch/ui-components/dist/button'
import { useModalConnect } from 'features/modal/modal.hooks'
import styles from './Datasets.module.css'

function Datasets(): React.ReactElement {
  const { showModal } = useModalConnect()
  const datasets = {
    user: [
      { id: 'user-id-plus-hash-1', label: 'Dataset Name 1' },
      { id: 'user-id-plus-hash-2', label: 'Dataset Name 2' },
      { id: 'user-id-plus-hash-3', label: 'Dataset Name 3' },
      { id: 'user-id-plus-hash-4', label: 'Dataset Name 4' },
      { id: 'user-id-plus-hash-5', label: 'Dataset Name 5' },
    ],
    shared: [{ id: 'user-id-plus-hash-6', name: 'Shared Dataset Name 1' }],
  }
  return (
    <div className={styles.container}>
      <h1 className="sr-only">Datasets</h1>
      <label>Your Datasets</label>
      {datasets.user.map((dataset) => (
        <div className={styles.listItem} key={dataset.id}>
          <button className={styles.titleLink}>{dataset.label}</button>
          <IconButton icon="edit" />
          <IconButton icon="share" />
          <IconButton icon="delete" type="warning" />
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
      {datasets.shared.map((dataset) => (
        <div className={styles.listItem} key={dataset.id}>
          <button className={styles.titleLink}>{dataset.name}</button>
          <IconButton icon="edit" />
        </div>
      ))}
    </div>
  )
}

export default Datasets
