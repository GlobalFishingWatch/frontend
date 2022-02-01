import { connect } from 'react-redux'
import startCase from 'lodash/startCase'
import { createSelector } from 'reselect'
import { parseVesselType, formatUTCDate } from 'utils'
import {
  getVesselDetailsData,
  getVesselEventsLoaded,
  getVesselDetailsLoaded,
  getVesselDetailsError,
} from 'redux-modules/vessel/vessel.selectors'
import { AppState } from 'types/redux.types'
import { getFlagStatesConfig } from 'redux-modules/app/app.selectors'
import { TOOLTIPS, DATE_FORMAT } from 'data/constants'
import SidebarVessel from './sidebar-vessel'

const GEAR_TYPE_READY = process.env.REACT_APP_GEAR_TYPE_READY !== 'false'
const VESSEL_WIDTH_READY = process.env.REACT_APP_VESSEL_WIDTH_READY !== 'false'

const getInfoFields = createSelector(
  [getVesselDetailsData, getFlagStatesConfig],
  (vesselData, flagsData) => {
    if (!vesselData) return null
    const flag =
      vesselData.flags &&
      flagsData !== null &&
      flagsData.find((flag) => flag.id === vesselData.flags[0].value)
    const flagLabel = flag ? flag.label : ''
    const baseFields = [
      {
        label: 'Type',
        value: parseVesselType(vesselData.type),
        key: 'type',
      },
      { label: 'Flag state', value: flagLabel, key: 'flag', tooltip: TOOLTIPS.flagStates },
      {
        label: 'Authorizations',
        value: vesselData.authorizations,
        key: 'authorizations',
        grouped: true,
      },
      { label: 'MMSI', value: vesselData.mmsi, key: 'mmsi' },
      {
        label: 'IMO',
        value:
          vesselData.imo !== null && vesselData.imo !== '0' && vesselData.imo !== 'null'
            ? vesselData.imo
            : ' ',
        key: 'imo',
      },
      { label: 'IRCS', value: vesselData.callsign, key: 'callsign' },
    ]
    if (vesselData.firstTransmissionDate && vesselData.lastTransmissionDate) {
      baseFields.push({
        label: 'Transmission dates',
        value: `${formatUTCDate(vesselData.firstTransmissionDate, DATE_FORMAT)} - ${formatUTCDate(
          vesselData.lastTransmissionDate,
          DATE_FORMAT
        )}`,
        key: 'transmission-dates',
      })
    }

    const extraFieldsConfig = [
      { id: 'gear_type', unit: '', transform: startCase },
      { id: 'gross_tonnage', unit: 'GT' },
      { id: 'length', unit: 'm', transform: parseInt },
    ]
    if (VESSEL_WIDTH_READY) {
      extraFieldsConfig.push({ id: 'width', unit: 'm', transform: parseInt })
    }
    extraFieldsConfig.forEach(({ id, unit, transform }) => {
      const extraField = vesselData.extra && vesselData.extra.find((d) => d.id === id)
      if (id === 'gear_type' && !GEAR_TYPE_READY) return

      if (extraField && extraField.value) {
        const value = transform ? transform(extraField.value) : extraField.value
        baseFields.push({
          label: extraField.label,
          value: `${value} ${unit}`,
          key: extraField.id,
        })
      }
    })
    return baseFields
  }
)

const mapStateToProps = (state: AppState) => ({
  vessel: getVesselDetailsData(state),
  infoFields: getInfoFields(state),
  detailsLoaded: getVesselDetailsLoaded(state),
  eventsLoaded: getVesselEventsLoaded(state),
  vesselDetailsError: getVesselDetailsError(state),
})

export default connect(mapStateToProps, null)(SidebarVessel)
