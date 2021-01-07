import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import countryflag from 'countryflag'
import GFWAPI from '@globalfishingwatch/api-client'
import MiniGlobe from '@globalfishingwatch/map-components/components/miniglobe'
import CountryFlag from '@globalfishingwatch/map-components/components/countryflag'
import { ReactComponent as LocationIcon } from 'assets/icons/location.svg'
import { ReactComponent as SpeedIcon } from 'assets/icons/speed.svg'
import { ReactComponent as BearingIcon } from 'assets/icons/bearing.svg'
import { ReactComponent as PortIcon } from 'assets/icons/port.svg'
import MapButtton from './MapButtton'
import styles from './Info.module.css'

const getVesselFlagLabel = (vesselData) => {
  const flag = vesselData && vesselData.flags && vesselData.flags[0] && vesselData.flags[0].value
  return flag ? countryflag(flag).name : {}
}
const EMPTY_FIELD = '---'
function InfoFields({ vesselData }) {
  if (!vesselData) return null

  const flag = getVesselFlagLabel(vesselData)
  const infofields = [
    {
      label: 'Type',
      newLine: true,
      value: vesselData.type === 'vessel' ? 'Fishing vessel' : 'Carrier',
      id: 'type',
    },
    { label: 'Flag state', value: flag || EMPTY_FIELD, id: 'flag' },
    {
      label: 'MMSI',
      value: vesselData.mmsi[0] ? vesselData.mmsi[0].value : EMPTY_FIELD,
      id: 'mmsi',
      newLine: true,
    },
    {
      label: 'Callsign',
      value: vesselData.callsign[0] ? vesselData.callsign[0].value : EMPTY_FIELD,
      id: 'callsign',
    },
    { label: 'IMO', value: vesselData.imo || EMPTY_FIELD, id: 'imo' },
    { label: 'UVI', value: vesselData.vesselId || EMPTY_FIELD, id: 'UVI' },
    { label: 'Gear Type', value: EMPTY_FIELD, id: 'gearTypeEng', newLine: true },
  ]

  const extraFields = [
    { label: 'Length', id: 'length', unit: 'm' },
    { label: 'Wength', id: 'width', unit: 'm' },
    { label: 'Gross tonnage', id: 'gross_tonnage', unit: 'GT' },
  ]
  extraFields.forEach(({ id, label, unit }) => {
    const extraField = vesselData.extra && vesselData.extra.find((d) => d.id === id)
    infofields.push({
      id,
      label,
      value: extraField && extraField.value ? `${extraField.value} ${unit}` : EMPTY_FIELD,
    })
  })

  return (
    <ul className={styles.properties}>
      {infofields.map((field) => {
        return (
          <li className={cx(styles.property, { [styles.__newLine]: field.newLine })} key={field.id}>
            <span className={styles.label}>{field.label}</span>
            <span>{field.value}</span>
          </li>
        )
      })}
    </ul>
  )
}

InfoFields.propTypes = {
  vesselData: PropTypes.object,
}

InfoFields.defaultProps = {
  vesselData: null,
}

class Info extends Component {
  constructor(props) {
    super(props)
    this.vesselID = this.props.vesselID
    this.state = {
      vessel: null,
    }
  }

  componentDidMount() {
    this.fetchData()
  }

  componentDidUpdate() {
    if (this.props.vesselID !== this.vesselID) {
      this.fetchData()
      this.vesselID = this.props.vesselID
    }
  }

  fetchData = () => {
    GFWAPI.fetch(`/vessels/${this.props.vesselID}`)
      .then((json) => {
        this.setState({
          vessel: json,
        })
      })
      .catch((error) => console.log(error))
  }

  seeEventOnGFWMap = () => {
    const { vessel } = this.state
    const GFWMapUrl = process.env.REACT_APP_GFW_VESSEL_MAP
    const tileSet = process.env.REACT_APP_GFW_TILESET
    const zoom = 6
    const parameters = {
      zoom,
      vessels: [[vessel.id, tileSet]],
    }
    const paramsPlainText = JSON.stringify(parameters)
    window.open(`${GFWMapUrl}?paramsPlainText=${paramsPlainText}`, '_blank')
  }

  render() {
    const { vessel } = this.state
    const { lastPosition, lastPortVisit } = this.props
    const vesselFlag = vessel && vessel.flags && vessel.flags[0] && vessel.flags[0].value
    return (
      <div className={styles.Info}>
        <div className={styles.generalInfo}>
          <div className={styles.title}>
            {vesselFlag && <CountryFlag iso={vesselFlag} size="3.2rem" />}
            {vessel && <h1>{vessel.name}</h1>}
            <MapButtton link={this.seeEventOnGFWMap} />
          </div>
          <InfoFields vesselData={vessel} />
        </div>
        <div className={styles.latestData}>
          <div className={styles.latestPosition}>
            <MiniGlobe
              size={60}
              viewportThickness={2}
              bounds={{
                north: lastPosition ? lastPosition[1] + 0.5 : 0,
                south: lastPosition ? lastPosition[1] - 0.5 : 0,
                east: lastPosition ? lastPosition[0] + 0.5 : 0,
                west: lastPosition ? lastPosition[0] - 0.5 : 0,
              }}
            />
            <span className={styles.info}>
              <h2>Latest Position</h2>
              <span className={styles.data}>
                <span className={styles.icon}>
                  <LocationIcon />
                </span>
                {lastPosition ? (
                  <span>
                    {lastPosition[0]}, {lastPosition[1]}
                  </span>
                ) : (
                  EMPTY_FIELD
                )}
              </span>
              <span className={styles.data}>
                <span className={styles.icon}>
                  <SpeedIcon />
                </span>
                --- knots
              </span>
              <span className={styles.data}>
                <span className={styles.icon}>
                  <BearingIcon />
                </span>
                --- degrees
              </span>
            </span>
          </div>
          <div className={styles.latestPort}>
            <MiniGlobe
              size={60}
              viewportThickness={2}
              bounds={{
                north:
                  lastPortVisit && lastPortVisit.coordinates
                    ? lastPortVisit.coordinates[1] + 0.1
                    : 0,
                south:
                  lastPortVisit && lastPortVisit.coordinates
                    ? lastPortVisit.coordinates[1] - 0.1
                    : 0,
                east:
                  lastPortVisit && lastPortVisit.coordinates
                    ? lastPortVisit.coordinates[0] + 0.1
                    : 0,
                west:
                  lastPortVisit && lastPortVisit.coordinates
                    ? lastPortVisit.coordinates[0] - 0.1
                    : 0,
              }}
            />
            <span className={styles.info}>
              <h2>Latest Port Visit</h2>
              <span className={styles.data}>
                <span className={styles.icon}>
                  <PortIcon />
                </span>
                {lastPortVisit && lastPortVisit.label !== '' && lastPortVisit.label}{' '}
                {lastPortVisit && lastPortVisit.coordinates ? (
                  <span>
                    ({lastPortVisit.coordinates[0]}, {lastPortVisit.coordinates[1]})
                  </span>
                ) : (
                  EMPTY_FIELD
                )}
              </span>
            </span>
          </div>
        </div>
      </div>
    )
  }
}

Info.propTypes = {
  vesselID: PropTypes.string.isRequired,
  lastPosition: PropTypes.arrayOf(PropTypes.number),
  lastPortVisit: PropTypes.shape({
    label: PropTypes.string,
    coordinates: PropTypes.arrayOf(PropTypes.number),
  }),
}

Info.defaultProps = {
  lastPosition: null,
  lastPortVisit: {
    label: '',
    coordinates: null,
  },
}

export default Info
