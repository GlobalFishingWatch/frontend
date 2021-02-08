import React from 'react'
import Logo from '@globalfishingwatch/ui-components/src/logo'
import { IconButton } from '@globalfishingwatch/ui-components'
import { Extra, Vessel } from 'types'
import { getFlagById } from 'utils/flags'
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
  const getGearType = (vessel: Vessel): string => {
    if (vessel.extra) {
      const foundGearType = vessel.extra.find((extraData: Extra) => {
        if (extraData.id === 'gear_type') {
          return true
        }
        return false
      })
      if (foundGearType) {
        return foundGearType.value
      }
    }
    return ''
  }
  const flagLabel = getFlagById(vessel.flags[0]?.value)?.label
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
      <h3>{vessel?.name}</h3>
      <div className={styles.identifiers}>
        <div>
          <label>FLAG</label>
          {flagLabel}
        </div>
        {vessel.mmsi && vessel.mmsi.length && (
          <div>
            <label>MMSI</label>
            {vessel.mmsi[0].value}
          </div>
        )}
        {vessel.imo && vessel.imo !== '0' && (
          <div>
            <label>IMO</label>
            {vessel.imo}
          </div>
        )}
        {vessel.callsign && vessel.callsign.length && (
          <div>
            <label>CALLSIGN</label>
            {vessel.callsign[0].value}
          </div>
        )}
        <div>
          <label>TYPE</label>
          {vessel.type || 'Unknown'}
        </div>
        {getGearType(vessel) && (
          <div>
            <label>GEAR TYPE</label>
            {getGearType(vessel)}
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
