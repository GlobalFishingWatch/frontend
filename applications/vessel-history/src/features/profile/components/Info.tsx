import React, { Fragment } from 'react'
import { Button } from '@globalfishingwatch/ui-components'
import { VesselInfo } from 'types'
import styles from './Info.module.css'

interface InfoProps {
  vessel: VesselInfo | null
  lastPosition: any
  lastPortVisit: any
}

const Info: React.FC<InfoProps> = (props): React.ReactElement => {
  const vessel = props.vessel

  const { lastPosition, lastPortVisit } = props

  return (
    <Fragment>
      <div className={styles.infoContainer}>
        {vessel && (
          <div className={styles.identifiers}>
            <div>
              <label>Type</label>
              <span>Fishing Vessel</span>
            </div>
            <div>
              <label>FLAG</label>
              <span>Chinese Taipei</span>
            </div>
            <div>
              <label>MMSI</label>
              <span>31306526</span>
            </div>
            <div>
              <label>CALLSIGN</label>
              <span>407201</span>
            </div>
            <div>
              <label>GEAR TYPE</label>
              <span>Longline Tuna</span>
            </div>
            <div>
              <label>LENGTH</label>
              <span>19.4</span>
            </div>
            <div>
              <label>GROSS TONNAGE</label>
              <span>68</span>
            </div>
            <div>
              <label>DEPTH</label>
              <span>6</span>
            </div>
            <div>
              <label>AUTORIZATIONS</label>
              <span>CCSBT</span>
              <br />
              <span>ICCAT</span>
              <br />
              <span>IOTC</span>
              <br />
            </div>
            <div>
              <label>BUILT</label>
              <span>Ulsan, 1996</span>
            </div>
            <div>
              <label>OWNER</label>
              <span>NENG DE OCEAN COMPANY LTD</span>
            </div>
            <div>
              <label>OPERATOR</label>
              <span>NENG DE OCEAN COMPANY LTD</span>
            </div>
          </div>
        )}
        {vessel && (
          <Button className={styles.saveButton} type="secondary">
            SAVE VESSEL FOR OFFLINE VIEW
          </Button>
        )}
      </div>
    </Fragment>
  )
}

export default Info
