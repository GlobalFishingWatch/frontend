import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@globalfishingwatch/ui-components'
import { VesselWithHistory } from 'types'
import styles from './Info.module.css'
import InfoField, { VesselFieldLabel } from './InfoField'

interface InfoProps {
  vessel: VesselWithHistory | null
  lastPosition: any
  lastPortVisit: any
}

const Info: React.FC<InfoProps> = (props): React.ReactElement => {
  const vessel = props.vessel
  const { t } = useTranslation()

  return (
    <Fragment>
      <div className={styles.infoContainer}>
        {vessel && (
          <div className={styles.identifiers}>
            <InfoField
              vesselName={vessel.shipname ?? ''}
              label={VesselFieldLabel.name}
              value={vessel.shipname}
              valuesHistory={vessel.history.shipname.byDate}
            ></InfoField>
            <InfoField
              vesselName={vessel.shipname ?? ''}
              label={VesselFieldLabel.type}
              value={vessel.type ?? ''}
              valuesHistory={vessel.history.vesselType.byDate}
            ></InfoField>
            <InfoField
              vesselName={vessel.shipname ?? ''}
              label={VesselFieldLabel.flag}
              value={vessel.flag}
              valuesHistory={vessel.history.flag.byDate}
            ></InfoField>
            <InfoField
              vesselName={vessel.shipname ?? ''}
              label={VesselFieldLabel.mmsi}
              value={vessel.mmsi ?? ''}
              valuesHistory={vessel.history.mmsi.byDate}
            ></InfoField>
            <InfoField
              vesselName={vessel.shipname ?? ''}
              label={VesselFieldLabel.imo}
              value={vessel.imo ?? ''}
              valuesHistory={vessel.history.imo.byDate}
            ></InfoField>
            <InfoField
              vesselName={vessel.shipname ?? ''}
              label={VesselFieldLabel.callsign}
              value={vessel.callsign ?? ''}
              valuesHistory={vessel.history.callsign.byDate}
            ></InfoField>
            <InfoField
              vesselName={vessel.shipname ?? ''}
              label={VesselFieldLabel.gearType}
              value={vessel.gearType ?? ''}
              valuesHistory={vessel.history.gearType.byDate}
            ></InfoField>
            <InfoField
              vesselName={vessel.shipname ?? ''}
              label={VesselFieldLabel.length}
              value={vessel.length ?? ''}
              valuesHistory={vessel.history.length.byDate}
            ></InfoField>
            <InfoField
              vesselName={vessel.shipname ?? ''}
              label={VesselFieldLabel.grossTonnage}
              value={vessel.grossTonnage ?? ''}
              valuesHistory={vessel.history.grossTonnage.byDate}
            ></InfoField>
            <InfoField
              vesselName={vessel.shipname ?? ''}
              label={VesselFieldLabel.depth}
              value={vessel.depth ?? ''}
              valuesHistory={vessel.history.depth.byDate}
            ></InfoField>
            <div className={styles.identifierField}>
              <label>{t('vessel.authorizationPlural', 'authorizations')}</label>
              {vessel.authorizations?.map((auth) => (
                <p key={auth}>{auth}</p>
              ))}
              {!vessel.authorizations?.length && (
                <p>{t('vessel.noAuthorizations', 'No authorizations found')}</p>
              )}
            </div>
            <InfoField
              vesselName={vessel.shipname ?? ''}
              label={VesselFieldLabel.builtYear}
              value={vessel.builtYear ?? ''}
            ></InfoField>
            <InfoField
              vesselName={vessel.shipname ?? ''}
              label={VesselFieldLabel.owner}
              value={vessel.owner ?? ''}
              valuesHistory={vessel.history.owner.byDate}
            ></InfoField>
            <InfoField
              vesselName={vessel.shipname ?? ''}
              label={VesselFieldLabel.operator}
              value={vessel.operator ?? ''}
              valuesHistory={vessel.history.operator.byDate}
            ></InfoField>
          </div>
        )}
        <br />
        {vessel && (
          <Button className={styles.saveButton} type="secondary">
            {t('vessel.saveForOfflineView', 'SAVE VESSEL FOR OFFLINE VIEW')}
          </Button>
        )}
      </div>
    </Fragment>
  )
}

export default Info
