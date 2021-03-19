import React, { Fragment } from 'react'
import { Button } from '@globalfishingwatch/ui-components'
// eslint-disable-next-line import/order
import { VesselWithHistory } from 'types'
import styles from './Info.module.css'
import InfoField from './InfoField'

interface InfoProps {
  vessel: VesselWithHistory | null
  lastPosition: any
  lastPortVisit: any
}

const Info: React.FC<InfoProps> = (props): React.ReactElement => {
  const vessel = props.vessel

  return (
    <Fragment>
      <div className={styles.infoContainer}>
        {vessel && (
          <div className={styles.identifiers}>
            <InfoField
              vesselName={vessel.shipname ?? ''}
              label={'Name'}
              value={vessel.shipname}
              valuesHistory={vessel.history.shipname.byDate}
            ></InfoField>
            <InfoField
              vesselName={vessel.shipname ?? ''}
              label={'Type'}
              value={vessel.type ?? ''}
              valuesHistory={[]}
            ></InfoField>
            <InfoField
              vesselName={vessel.shipname ?? ''}
              label={'FLAG'}
              value={vessel.flag}
              valuesHistory={vessel.history.flag.byDate}
            ></InfoField>
            <InfoField
              vesselName={vessel.shipname ?? ''}
              label={'MMSI'}
              value={vessel.mmsi ?? ''}
              valuesHistory={vessel.history.mmsi.byDate}
            ></InfoField>
            <InfoField
              vesselName={vessel.shipname ?? ''}
              label={'CALLSIGN'}
              value={vessel.callsign ?? ''}
              valuesHistory={vessel.history.callsign.byDate}
            ></InfoField>
            <InfoField
              vesselName={vessel.shipname ?? ''}
              label={'GEAR TYPE'}
              value={vessel.gearType ?? ''}
              valuesHistory={[]}
            ></InfoField>
            <InfoField
              vesselName={vessel.shipname ?? ''}
              label={'LENGTH'}
              value={vessel.length ?? ''}
              valuesHistory={[]}
            ></InfoField>
            <InfoField
              vesselName={vessel.shipname ?? ''}
              label={'GROSS TONNAGE'}
              value={vessel.grossTonnage ?? ''}
              valuesHistory={[]}
            ></InfoField>
            <InfoField
              vesselName={vessel.shipname ?? ''}
              label={'DEPTH'}
              value={vessel.depth ?? ''}
              valuesHistory={[]}
            ></InfoField>
            <div className={styles.identifierField}>
              <label>AUTHORIZATIONS</label>
              {vessel.authorizations.map((auth) => (
                <p key={auth}>{auth}</p>
              ))}
              {!vessel.authorizations.length && <p>No authorizations found</p>}
            </div>
            <InfoField
              vesselName={vessel.shipname ?? ''}
              label={'BUILT'}
              value={vessel.builtYear ?? ''}
              valuesHistory={[]}
            ></InfoField>
            <InfoField
              vesselName={vessel.shipname ?? ''}
              label={'OWNER'}
              value={vessel.owner ?? ''}
              valuesHistory={vessel.history.owner.byDate}
            ></InfoField>
            <InfoField
              vesselName={vessel.shipname ?? ''}
              label={'OPERATOR'}
              value={vessel.operator ?? ''}
              valuesHistory={[]}
            ></InfoField>
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
