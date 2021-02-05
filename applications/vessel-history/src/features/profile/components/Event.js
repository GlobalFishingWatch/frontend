import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
import cx from 'classnames'
import dayjs from 'dayjs'
import { ReactComponent as EncounterEventIcon } from 'assets/icons/encounterEvent.svg'
import { ReactComponent as FishingEventIcon } from 'assets/icons/fishingEvent.svg'
import { ReactComponent as PortEventIcon } from 'assets/icons/portEvent.svg'
import { ReactComponent as GapEventIcon } from 'assets/icons/gapEvent.svg'
import MapButtton from './MapButtton'
import styles from './Event.module.css'

class Event extends Component {
  constructor(props) {
    super(props)

    this.state = {
      infoHiddenOnMobile: false,
    }
  }

  getEventDuration = (_start, _end) => {
    if (_start === null || _end === null) return '---'
    const start = dayjs(_start)
    const end = dayjs(_end)
    const duration = dayjs(end).diff(start, 'hours', true)
    if (duration >= 1) return `${Math.round(duration)} h`
    else return `${dayjs(end).diff(start, 'minutes')} min`
  }

  toggleInfo = () => {
    this.setState((prevState) => ({
      infoHiddenOnMobile: !prevState.infoHiddenOnMobile,
    }))
  }

  seeEventOnGFWMap = () => {
    const { event } = this.props
    const GFWMapUrl = process.env.REACT_APP_GFW_VESSEL_MAP
    const tileSet = process.env.REACT_APP_GFW_TILESET
    const zoom = 6
    const parameters = {
      vessels: [[event.id, tileSet]],
      view: [zoom, event.position.lon, event.position.lat],
      innerExtent: [event.start, event.end || ''],
    }
    if (event.vessels && event.vessels.encounter && event.vessels.encounter.id !== undefined) {
      parameters.vessels.push([event.vessels.encounter.id, tileSet])
    }
    const paramsPlainText = JSON.stringify(parameters)
    window.open(`${GFWMapUrl}?paramsPlainText=${paramsPlainText}`, '_blank')
  }

  render() {
    const { event } = this.props
    let eventIcon = <FishingEventIcon />
    let eventTitle = `${event.position.lat} / ${event.position.lon}`
    if (event.type === 'encounter' && event.encounter) {
      const carrierVessel = event.encounter.vessel
      eventIcon = <EncounterEventIcon />
    } else if (event.type === 'port') {
      eventIcon = <PortEventIcon />
      eventTitle = event.port.name || event.port.id
    } else if (event.type === 'gap') {
      eventIcon = <GapEventIcon />
    }

    return (
      <li className={styles.Event}>
        {eventIcon}
        <div className={styles.column}>
          <span className={styles.label}>{event.type}</span>
          <span className={styles.data}>{eventTitle}</span>
        </div>
        <div
          className={cx(styles.secondaryInfo, { [styles.hidden]: this.state.infoHiddenOnMobile })}
        >
          <div className={styles.column}>
            <span className={styles.label}>Date</span>
            <span className={styles.data}>{dayjs(event.start).format('MMM D YYYY h:mm a')}</span>
          </div>
          <div className={styles.column}>
            <span className={styles.label}>Duration</span>
            <span className={styles.data}>{this.getEventDuration(event.start, event.end)}</span>
          </div>
        </div>
        <MapButtton secondary link={this.seeEventOnGFWMap} />
      </li>
    )
  }
}

export default Event
