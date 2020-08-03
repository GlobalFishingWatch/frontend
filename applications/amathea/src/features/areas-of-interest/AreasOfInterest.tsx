import React from 'react'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import Button from '@globalfishingwatch/ui-components/dist/button'
// import { useModalConnect } from 'features/modal/modal.hooks'
import styles from './AreasOfInterest.module.css'
import { useAOIConnect } from './areas-of-interest.hook'

function AreasOfInterest(): React.ReactElement {
  // const { showModal } = useModalConnect()
  const { aoiList } = useAOIConnect()
  return (
    <div className={styles.container}>
      <h1 className="screen-reader-only">Areas of interest</h1>
      <label>Your Areas of interest</label>
      {aoiList &&
        aoiList.map((aoi) => (
          <div className={styles.listItem} key={aoi.id}>
            <button className={styles.titleLink}>{aoi.label}</button>
            {/* <IconButton icon="edit" tooltip="Edit Area of Interest (Cooming soon)" /> */}
            <IconButton disabled icon="delete" type="warning" tooltip="Delete Area of Interest" />
          </div>
        ))}
      <Button
        // onClick={() => {
        //   showModal('newAOI')
        // }}
        className={styles.rightSide}
        tooltip="Cooming soon"
        tooltipPlacement="top"
      >
        Create new area of interest
      </Button>
    </div>
  )
}

export default AreasOfInterest
