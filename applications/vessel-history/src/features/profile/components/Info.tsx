import React, { Fragment } from 'react'
import { Button } from '@globalfishingwatch/ui-components'
// eslint-disable-next-line import/order
import { VesselInfo } from 'classes/vessel.class'
import styles from './Info.module.css'
import InfoField from './InfoField'

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
            <InfoField label={'Name'} field={vessel.getName()}></InfoField>
            <InfoField label={'Type'} field={vessel.getType()}></InfoField>
            <InfoField label={'FLAG'} field={vessel.getFlag()}></InfoField>
            <InfoField label={'MMSI'} field={vessel.getMMSI()}></InfoField>
            <InfoField label={'CALLSIGN'} field={vessel.getCallsign()}></InfoField>
            <InfoField label={'GEAR TYPE'} field={vessel.getGearType()}></InfoField>
            <InfoField label={'LENGTH'} field={vessel.getLength()}></InfoField>
            <InfoField label={'GROSS TONNAGE'} field={vessel.getGrossTonnage()}></InfoField>
            <InfoField label={'DEPTH'} field={vessel.getDepth()}></InfoField>
            <div className={styles.identifierField}>
              <label>AUTHORIZATIONS</label>
              {vessel.getAuthorisations().map((auth) => (
                <p key={auth}>{auth}</p>
              ))}
              {!vessel.getAuthorisations().length && <p>No authorizations found</p>}
            </div>
            <InfoField label={'BUILT'} field={vessel.getBuiltYear()}></InfoField>
            <InfoField label={'OWNER'} field={vessel.getOwner()}></InfoField>
            <InfoField label={'OPERATOR'} field={vessel.getOperator()}></InfoField>
          </div>
        )}
        <br />
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
