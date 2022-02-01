import React from 'react'
import { EventType, EncounterTypes } from 'types/app.types'
import { EVENT_TYPES } from 'data/constants'
import styles from './events-graph.module.css'
import GraphSelect from './graph-select/graph-select.container'
import EncounterEventsLegend from './encounters-legend/encounters-legend.container'
import Graph from './graph/graph.container'

interface EventsGraphProps {
  eventType: EventType
  encounterTypes: EncounterTypes[]
}

const EventsGraph: React.FC<EventsGraphProps> = (props): React.ReactElement => {
  const { eventType } = props
  return (
    <div className={styles.Graph}>
      <div className={styles.selectContainer}>
        <GraphSelect />
        {eventType.includes(EVENT_TYPES.encounter) && <EncounterEventsLegend />}
      </div>
      <Graph />
    </div>
  )
}

export default EventsGraph
