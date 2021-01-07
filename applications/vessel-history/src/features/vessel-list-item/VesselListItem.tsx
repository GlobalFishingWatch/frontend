import React from 'react'
import Logo from '@globalfishingwatch/ui-components/src/logo'
import IconButton from '@globalfishingwatch/ui-components/src/icon-button/IconButton'
import styles from './VesselListItem.module.css'
import '@globalfishingwatch/ui-components/dist/base.css'

interface LoaderProps {
  saved?: boolean
  vessel: any
}

const VesselListItem: React.FC<LoaderProps> = (props): React.ReactElement => {
  return (
    <div className={styles.vesselItem}>
      {props.saved && (
        <IconButton
          type="default"
          size="default"
          icon="delete"
          className={styles.deleteSaved}
        ></IconButton>
      )}
      <h3>Don Ying Gang 8003</h3>
      <div className={styles.identifiers}>
        <div>
          <label>FLAG</label>
          Chinese Taipei
        </div>
        <div>
          <label>MMSI</label>
          31306526
        </div>
        <div>
          <label>IMO</label>
          12345
        </div>
        <div>
          <label>CALLSIGN</label>
          407201
        </div>
        <div>
          <label>TRANSMISSIONS</label>
          from 2015-07-21 to 2020/04/13
        </div>
        <div>
          <label>IMO</label>
          12345
        </div>
        <div>
          <label>SAVED ON</label>
          2020/08/01
        </div>
      </div>
    </div>
  )
}

export default VesselListItem
