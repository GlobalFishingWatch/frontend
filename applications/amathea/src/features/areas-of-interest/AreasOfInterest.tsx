import React from 'react'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import Button from '@globalfishingwatch/ui-components/dist/button'
import { AOIConfig } from 'types'
import { useModalConnect } from 'features/modal/modal.hooks'
import { USER_DATA } from 'data/user-data'
import styles from './AreasOfInterest.module.css'

function AreasOfInterest(): React.ReactElement {
  const { showModal } = useModalConnect()
  const aois: AOIConfig[] = USER_DATA.aois
  return (
    <div className={styles.container}>
      <h1 className="sr-only">Areas of interest</h1>
      <label>Your Areas of interest</label>
      {aois.map((aoi) => (
        <div className={styles.listItem} key={aoi.id}>
          <button className={styles.titleLink}>{aoi.label}</button>
          <IconButton icon="edit" tooltip="Edit Area of Interest" />
          <IconButton icon="delete" type="warning" tooltip="Delete Area of Interest" />
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
