import React from 'react'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import Button from '@globalfishingwatch/ui-components/dist/button'
import { AOI } from '@globalfishingwatch/dataviews-client/dist/types'
import Spinner from '@globalfishingwatch/ui-components/dist/spinner'
import { useModalConnect } from 'features/modal/modal.hooks'
import styles from './AreasOfInterest.module.css'
import { useAOIConnect, useAOIAPI } from './areas-of-interest.hook'

function AreasOfInterest(): React.ReactElement {
  const { showModal } = useModalConnect()
  const { aoiStatus, aoiList } = useAOIConnect()
  const { deleteAOI } = useAOIAPI()
  const onDeleteClick = (aoi: AOI) => {
    const confirmation = window.confirm(
      `Are you sure you want to permanently delete this area of interest?\n${aoi.label}`
    )
    if (confirmation) {
      deleteAOI(aoi.id)
    }
  }

  if (aoiStatus === 'loading') {
    return <Spinner />
  }

  return (
    <div className={styles.container}>
      <h1 className="screen-reader-only">Areas of interest</h1>
      <label>Your Areas of interest</label>
      {aoiList &&
        aoiList.map((aoi) => (
          <div className={styles.listItem} key={aoi.id}>
            <button className={styles.titleLink}>{aoi.label}</button>
            {/* <IconButton icon="edit" tooltip="Edit Area of Interest (Coming soon)" /> */}
            <IconButton
              disabled
              icon="delete"
              type="warning"
              tooltip="Delete Area of Interest"
              onClick={() => onDeleteClick(aoi)}
            />
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
