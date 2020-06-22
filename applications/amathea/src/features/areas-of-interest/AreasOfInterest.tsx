import React from 'react'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import Button from '@globalfishingwatch/ui-components/dist/button'
import { useModalConnect } from 'features/modal/modal.hooks'
import styles from './AreasOfInterest.module.css'

function AreasOfInterest(): React.ReactElement {
  const { showModal } = useModalConnect()
  const aois = [
    { id: 'user-id-plus-hash-1', label: 'Area of Interest Name 1' },
    { id: 'user-id-plus-hash-2', label: 'Area of Interest Name 2' },
    { id: 'user-id-plus-hash-3', label: 'Area of Interest Name 3' },
  ]
  return (
    <div className={styles.container}>
      <h1 className="sr-only">Areas of interest</h1>
      <label>Your Areas of interest</label>
      {aois.map((aoi) => (
        <div className={styles.listItem} key={aoi.id}>
          <button className={styles.titleLink}>{aoi.label}</button>
          <IconButton icon="edit" />
          <IconButton icon="delete" type="warning" />
        </div>
      ))}
      <Button
        onClick={() => {
          showModal('newAOI')
        }}
        className={styles.rightSide}
      >
        Create new area of interest
      </Button>
    </div>
  )
}

export default AreasOfInterest
