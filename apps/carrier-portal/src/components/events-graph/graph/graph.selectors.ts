import { createSelector } from 'reselect'
import groupBy from 'lodash/groupBy'
import orderBy from 'lodash/orderBy'
import flatMap from 'lodash/flatMap'
import { getEncounterAuthRisk } from 'utils'
import {
  EVENT_TYPES,
  OTHERS_GROUP_KEY,
  NUMBER_OF_GRAPH_GROUPS,
  ALL_GRAPH_OPTIONS,
} from 'data/constants'
import {
  getStartDate,
  getEndDate,
  getCurrentGraph,
  getRfmos,
} from 'redux-modules/router/route.selectors'
import { getCurrentEventsListFiltered } from 'redux-modules/events/events.selectors'
import { getPortsConfig, getEezsConfig, getRfmosConfig } from 'redux-modules/app/app.selectors'

export const getGraphType = createSelector([getCurrentGraph], (currentGraph) => {
  let type = currentGraph || 'rfmo'
  type = type.includes(EVENT_TYPES.loitering) ? type.replace('loitering-', '') : type
  return type === 'flag-carrier' || type === 'flag-vessel' ? 'flag' : type
})

export const getFlagType = createSelector([getCurrentGraph], (currentGraph) => {
  const type = currentGraph || 'rfmo'
  return type === 'flag-carrier' || type === 'flag-vessel' ? type : null
})

export const getGraphNoDataMsg = createSelector([getCurrentGraph], (currentGraph) => {
  const type = currentGraph || 'rfmo'
  const graphOption = ALL_GRAPH_OPTIONS.find((option) => option.value === type)
  return graphOption ? graphOption.noDataMsg : ''
})

export const getGraphData = createSelector(
  [getCurrentEventsListFiltered, getCurrentGraph, getPortsConfig, getEezsConfig],
  (events, graph, portsData, eezsData) => {
    if (!events || !portsData || !eezsData) return null

    return events.map((event) => {
      const vessel =
        graph === 'flag-vessel' && event.encounter ? event.encounter.vessel : event.vessel
      const risk =
        event.encounter !== undefined
          ? getEncounterAuthRisk(event.encounter.authorizationStatus)
          : null
      const eezData = eezsData.find((eez) => event.eezs?.includes(eez.id))
      const eez = eezData && { id: eezData.id, label: eezData.iso, tooltip: eezData.label }
      const portData = portsData.find((p) => event.nextPort && p.id === event.nextPort.id)
      const port = portData && {
        id: portData.id,
        label: portData.label.substring(0, 3),
        tooltip: portData.label,
      }
      return {
        eez,
        risk,
        port,
        vessel,
        id: event.id,
        t: event.start,
        flag: vessel && { id: vessel.flag, label: vessel.flag },
        rfmo: event.rfmos,
      }
    })
  }
)

export const getGraphDataByType = createSelector(
  [getGraphData, getGraphType, getRfmos, getRfmosConfig],
  (events, graphType, rfmos, rfmosConfig) => {
    if (!events || !graphType) return []

    if (graphType === 'flag' || graphType === 'port' || graphType === 'eez') {
      const eventsByTypeOrdered = orderBy(groupBy(events, `${graphType}.id`), 'length', 'desc')
      const eventsGrouped = flatMap(eventsByTypeOrdered, (eventGroup, index) => {
        return eventGroup.map((event) => {
          return index <= NUMBER_OF_GRAPH_GROUPS
            ? event
            : { ...event, [graphType]: { id: OTHERS_GROUP_KEY, label: OTHERS_GROUP_KEY } }
        })
      })
      return eventsGrouped
    } else if (graphType === 'rfmo') {
      const eventsDuplicatedByRfmo = flatMap(events, (event) => {
        if (!event.rfmo || !event.rfmo.length || event.eez) return []
        return event.rfmo.map((rfmo) => {
          if (rfmos && !rfmos.includes(rfmo)) return []
          const rfmoConfig = rfmosConfig?.find((rfmoConfig) => rfmoConfig.id === rfmo)
          return {
            ...event,
            rfmo: {
              id: rfmo,
              label: rfmo,
              ...(rfmoConfig?.description && { tooltip: rfmoConfig.description }),
            },
          }
        })
      })
      return eventsDuplicatedByRfmo
    }
    return events
  }
)

export const getTimeBaseUnit = createSelector(
  [getStartDate, getEndDate, getGraphType],
  (startDate, endDate, type) => {
    if (type !== 'time') return null

    const deltaMs = new Date(endDate).getTime() - new Date(startDate).getTime()
    if (deltaMs === 0) {
      return null
    }

    const deltaDays = deltaMs / 1000 / 60 / 60 / 24

    let baseUnit = 'day'
    if (deltaDays > 366) baseUnit = 'year'
    else if (deltaDays > 60) baseUnit = 'month'
    else if (deltaDays > 10) baseUnit = 'week'
    else if (deltaDays < 1) baseUnit = 'hour'
    return baseUnit
  }
)
