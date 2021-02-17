import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import maxBy from 'lodash/maxBy'
import GFWAPI from '@globalfishingwatch/api-client'
import { Spinner } from '@globalfishingwatch/ui-components'
import styles from './RecentActivity.module.css'
import Event from './Event'

class RecentActivity extends Component {
  constructor(props) {
    super(props)

    this.eventsPerPage = 10
    this.totalEvents = []
    this.vesselID = this.props.vesselID

    this.state = {
      state: '',
      eventTypes: 'all',
      totalPages: 0,
      currentPage: 0,
      eventsFiltered: [],
      eventsShown: [],
    }
  }

  componentDidMount() {
    this.fetchData()
  }

  componentDidUpdate() {
    if (this.props.vesselID !== this.vesselID) {
      this.totalEvents = []
      this.setState(
        {
          eventTypes: 'all',
          totalPages: 0,
          currentPage: 0,
          eventsFiltered: [],
          eventsShown: [],
        },
        this.fetchData
      )
      this.vesselID = this.props.vesselID
    }
  }

  fetchData = () => {
    this.setState({
      state: 'loading',
    })
    GFWAPI.fetch(`/events?vessels=${this.props.vesselID}&sortOrder=desc`)
      .then((response) => {
        if (response.length === 0) {
          this.setState({
            state: 'no-results',
          })
          return
        }
        this.totalEvents = response
        this.eventNumbers = { fishing: 0, port: 0, encounter: 0, gap: 0, loitering: 0 }
        this.totalEvents.forEach((event) => {
          this.eventNumbers[event.type]++
        })
        this.setState(
          {
            state: 'loaded',
            eventsFiltered: this.totalEvents,
            totalPages: Math.ceil(this.totalEvents.length / this.eventsPerPage),
          },
          this.getCurrentEventPage
        )
        const lastPortVisit = maxBy(
          response.filter((event) => event.type === 'port'),
          'start'
        )

        if (lastPortVisit && lastPortVisit.port) {
          this.props.setLastPortVisit({
            label: lastPortVisit.port.name,
            coordinates: [lastPortVisit.port.position.lon, lastPortVisit.port.position.lat],
          })
        }
      })
      .catch((error) => {
        this.setState({
          state: 'no-results',
        })
      })
  }

  setEventsFilter = (e) => {
    const filterValue = e.currentTarget.value
    const eventsFiltered =
      filterValue === 'all'
        ? this.totalEvents
        : this.totalEvents.filter((a) => a.type === filterValue)
    this.setState(
      {
        eventsFiltered: eventsFiltered,
        totalPages: Math.ceil(eventsFiltered.length / this.eventsPerPage),
        currentPage: 0,
      },
      this.getCurrentEventPage
    )
  }

  getCurrentEventPage = () => {
    const currentIndex = this.state.currentPage * this.eventsPerPage
    this.setState({
      eventsShown: this.state.eventsFiltered.slice(currentIndex, currentIndex + this.eventsPerPage),
    })
  }

  previousPage = () => {
    this.setState(
      (prevState) => ({
        currentPage:
          prevState.currentPage > 0 ? prevState.currentPage - 1 : prevState.totalPages - 1,
      }),
      this.getCurrentEventPage
    )
  }

  nextPage = () => {
    this.setState(
      (prevState) => ({
        currentPage: (prevState.currentPage + 1) % prevState.totalPages,
      }),
      this.getCurrentEventPage
    )
  }

  render() {
    const { currentPage, eventsShown, eventTypes, state } = this.state
    const { vesselID } = this.props

    let content

    if (state === 'loaded') {
      content = (
        <Fragment>
          <div className={styles.header}>
            <h2>Recent Activity</h2>
            <div className={styles.eventTypeSelector}>
              <label htmlFor="eventTypeSelect" className={styles.label}>
                Event types
              </label>
              <select
                id="eventTypeSelect"
                defaultValue={eventTypes}
                onChange={this.setEventsFilter}
              >
                <option value="all">{`All (${this.totalEvents.length})`}</option>
                <option value="fishing" disabled={this.eventNumbers.fishing === 0 ? true : null}>
                  {`Fishing (${this.eventNumbers.fishing})`}
                </option>
                <option value="port" disabled={this.eventNumbers.port === 0 ? true : null}>
                  {`Port (${this.eventNumbers.port})`}
                </option>
                <option
                  value="encounter"
                  disabled={this.eventNumbers.encounter === 0 ? true : null}
                >
                  {`Encounter (${this.eventNumbers.encounter})`}
                </option>
                <option value="gap" disabled={this.eventNumbers.gap === 0 ? true : null}>
                  {`Gap (${this.eventNumbers.gap})`}
                </option>
                <option
                  value="loitering"
                  disabled={this.eventNumbers.loitering === 0 ? true : null}
                >
                  {`Loitering (${this.eventNumbers.loitering})`}
                </option>
              </select>
            </div>
          </div>
          <ul className={styles.eventList}>
            {eventsShown.map((event, i) => (
              <Event vesselID={vesselID} event={event} key={i} />
            ))}
          </ul>
          <div className={styles.pagination}>
            <button
              title="Newer Activity"
              className={styles.previousPage}
              onClick={this.previousPage}
            ></button>
            {currentPage + 1} / {this.state.totalPages}
            <button
              title="Older Activity"
              className={styles.nextPage}
              onClick={this.nextPage}
            ></button>
          </div>
        </Fragment>
      )
    } else if (state === 'loading') {
      content = <Spinner />
    } else if (state === 'no-results') {
      content = 'No recent activity found'
    }

    return <div className={styles.RecentActivity}>{content}</div>
  }
}

RecentActivity.propTypes = {
  vesselID: PropTypes.string.isRequired,
  setLastPortVisit: PropTypes.func.isRequired,
}

export default RecentActivity
