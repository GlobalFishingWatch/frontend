import React, { useEffect, Fragment } from 'react'
import cx from 'classnames'
import Graph from 'components/events-graph/events-graph.container'
import ActorsList from 'components/actorslist/actorslist.container'
import { EventType, LayerTypes } from 'types/app.types'
import { ReactComponent as IconEncounter } from 'assets/icons/encounter.svg'
import { ReactComponent as IconLoitering } from 'assets/icons/loitering.svg'
import Loader from 'components/loader/loader'
import EventsSummary from 'components/events-summary/events-summary.container'
import { EVENT_TYPES, EventTypeConfig } from 'data/constants'
import styles from './sidebar-home.module.css'

const icons = {
  [EVENT_TYPES.encounter]: <IconEncounter />,
  [EVENT_TYPES.loitering]: <IconLoitering />,
}

interface SidebarProps {
  layers: LayerTypes[]
  eventType: EventType
  eventTypesConfig: EventTypeConfig[]
  eventsError: string
  eventsLoaded: boolean
  numberOfEvents: number
  setEventType: (type: EventType, layers: LayerTypes[]) => void
  onRefreshClick: (type: EventType) => void
  onReady: () => void
}

const Sidebar: React.FC<SidebarProps> = (props): React.ReactElement => {
  const {
    layers,
    eventType,
    eventTypesConfig,
    eventsError,
    eventsLoaded,
    numberOfEvents,
    setEventType,
    onReady,
    onRefreshClick,
  } = props

  useEffect(() => {
    onReady()
  }, [onReady])

  let placeholderComponent = null
  if (eventsLoaded === false) {
    placeholderComponent = <Loader />
  } else if (eventsError) {
    placeholderComponent = (
      <div className={styles.placeholderContainer}>
        <h2>Something went wrong</h2>
        <button className={styles.errorButton} onClick={() => onRefreshClick(eventType)}>
          Refresh
        </button>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h1 className="sr-only">{`${eventType} events dashboard`}</h1>
      <div className={styles.eventTypeSwitcher}>
        {eventTypesConfig.map((eventTypeConfig) => (
          <button
            key={eventTypeConfig.id}
            className={cx(styles.eventType, {
              [styles.disabled]: !eventTypeConfig.active,
              [styles.active]: eventType === eventTypeConfig.id,
            })}
            id={eventTypeConfig.id}
            onClick={() => {
              setEventType(
                eventTypeConfig.id,
                (layers || []).filter((layer) => layer !== eventType)
              )
            }}
            data-tip-pos="bottom-left"
            aria-label={
              eventTypeConfig.active ? `Switch to ${eventTypeConfig.label} events dashboard` : ''
            }
          >
            {icons[eventTypeConfig.id]}
            {eventTypeConfig.label}
          </button>
        ))}
      </div>
      <div className={styles.content}>
        {placeholderComponent || (
          <Fragment>
            <div className={styles.contentHeader}>
              <h2>
                <EventsSummary />
              </h2>
            </div>
            {numberOfEvents > 0 && (
              <Fragment>
                <Graph />
                <ActorsList />
              </Fragment>
            )}
          </Fragment>
        )}
      </div>
    </div>
  )
}

export default Sidebar
