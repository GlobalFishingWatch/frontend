import React from 'react'
import Link from 'redux-first-router-link'
import { IconButton } from '@globalfishingwatch/ui-components'
import { Vessel } from 'types'
import { getFlagById } from 'utils/flags'
import { getVesselAPISource } from 'utils/vessel'
import { SHOW_VESSEL_API_SOURCE } from 'data/constants'
import styles from './VesselListItem.module.css'

interface ListItemProps {
  saved?: boolean
  vessel: Vessel
}

const VesselListItem: React.FC<ListItemProps> = (props): React.ReactElement => {
  const vessel = props.vessel
  if (!vessel) {
    return <div></div>
  }

  const flagLabel = getFlagById(vessel.flag)?.label
  const sourceAPI = getVesselAPISource(vessel)
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
      <Link
        to={['profile', vessel.dataset ?? 'NA', vessel.id ?? 'NA', vessel.vesselMatchId ?? 'NA']}
      >
        <h3>{vessel?.shipname}</h3>
      </Link>
      <div className={styles.identifiers}>
        <div>
          <label>FLAG</label>
          {flagLabel}
        </div>
        {vessel.mmsi && (
          <div>
            <label>MMSI</label>
            {vessel.mmsi}
          </div>
        )}
        {vessel.imo && vessel.imo !== '0' && (
          <div>
            <label>IMO</label>
            {vessel.imo}
          </div>
        )}
        {vessel.callsign && (
          <div>
            <label>CALLSIGN</label>
            {vessel.callsign}
          </div>
        )}
        {SHOW_VESSEL_API_SOURCE && (
          <div>
            <label>SOURCE</label>
            {sourceAPI.join('+')}
          </div>
        )}
        <div>
          <label>TRANSMISSIONS</label>
          from {vessel.firstTransmissionDate} to {vessel.lastTransmissionDate}
        </div>
        {props.saved && (
          <div>
            <label>SAVED ON</label>
            2020/08/01
          </div>
        )}
      </div>
    </div>
  )
}

export default VesselListItem
