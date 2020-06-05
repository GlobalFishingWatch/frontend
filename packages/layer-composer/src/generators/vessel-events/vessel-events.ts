import { FeatureCollection } from 'geojson'
import { GeoJSONSourceRaw } from 'mapbox-gl'
import memoizeOne from 'memoize-one'
import { Group, Dictionary } from '../../types'
import { Type, VesselEventsGeneratorConfig, RawEvent, AuthorizationOptions } from '../types'
import { DEFAULT_LANDMASS_COLOR } from '../basemap/basemap-layers'
import { memoizeByLayerId, memoizeCache } from '../../utils'

const EVENTS_COLORS: Dictionary<string> = {
  encounter: '#FAE9A0',
  partially: '#F59E84',
  unmatched: '#CE2C54',
  loitering: '#cfa9f9',
  port: '#99EEFF',
}

class VesselsEventsGenerator {
  type = Type.VesselEvents

  _setActiveEvent = (data: FeatureCollection, currentEventId: string): FeatureCollection => {
    const featureCollection = { ...data }
    featureCollection.features = featureCollection.features.map((feature) => {
      const newFeature = { ...feature }
      newFeature.properties = newFeature.properties || {}
      newFeature.properties.active = currentEventId && newFeature.properties.id === currentEventId
      return newFeature
    })
    featureCollection.features.sort((a, b) => {
      if (a.properties && a.properties.active) return 1
      else if (b.properties && b.properties.active) return -1
      else return 0
    })
    return featureCollection
  }

  _getStyleSources = (config: VesselEventsGeneratorConfig) => {
    const { id, data } = config

    if (!data) {
      // console.warn(`${VESSEL_EVENTS_TYPE} source generator needs geojson data`, config)
      return []
    }

    const geojson = memoizeCache[config.id].getVesselEventsGeojson(data) as FeatureCollection

    let newData: FeatureCollection = { ...geojson }
    if (config.currentEventId) {
      newData = this._setActiveEvent(newData, config.currentEventId)
    }

    if (config.start && config.end) {
      const startMs = new Date(config.start).getTime()
      const endMs = new Date(config.end).getTime()
      newData.features = newData.features.filter((feature) => {
        return (
          feature.properties &&
          feature.properties.timestamp > startMs &&
          feature.properties.timestamp < endMs
        )
      })
    }

    const source: GeoJSONSourceRaw = {
      type: 'geojson',
      data: newData,
    }
    return [{ id, ...source }]
  }

  _getStyleLayers = (config: VesselEventsGeneratorConfig) => {
    if (!config.data) {
      // console.warn(`${VESSEL_EVENTS_TYPE} source generator needs geojson data`, config)
      return []
    }

    const activeFilter = ['case', ['==', ['get', 'active'], true]]
    const layers: any[] = [
      {
        id: `${config.id}_background`,
        type: 'circle',
        source: config.id,
        paint: {
          'circle-color': ['get', 'color'],
          'circle-stroke-width': 2,
          'circle-stroke-color': [...activeFilter, 'rgba(0, 193, 231, 1)', DEFAULT_LANDMASS_COLOR],
          'circle-radius': [...activeFilter, 12, 5],
        },
        metadata: {
          group: Group.Point,
        },
      },
      {
        id: `${config.id}_outline`,
        source: config.id,
        type: 'symbol',
        layout: {
          'icon-allow-overlap': true,
          'icon-image': ['get', 'icon'],
          'icon-size': [...activeFilter, 1, 0],
        },
        metadata: {
          group: Group.Point,
        },
      },
    ]
    return layers
  }

  getStyle = (config: VesselEventsGeneratorConfig) => {
    memoizeByLayerId(config.id, {
      getVesselEventsGeojson: memoizeOne(getVesselEventsGeojson),
    })
    return {
      id: config.id,
      sources: this._getStyleSources(config),
      layers: this._getStyleLayers(config),
    }
  }
}

export default VesselsEventsGenerator

const getEncounterAuthColor = (authorizationStatus: AuthorizationOptions) => {
  switch (authorizationStatus) {
    case 'authorized':
      return EVENTS_COLORS.encounter
    case 'partially':
      return EVENTS_COLORS.partially
    case 'unmatched':
      return EVENTS_COLORS.unmatched
    default:
      return ''
  }
}

export const getVesselEventsGeojson = (trackEvents: RawEvent[] | null): FeatureCollection => {
  const featureCollection: FeatureCollection = {
    type: 'FeatureCollection',
    features: [],
  }

  if (!trackEvents) return featureCollection
  const trackEventsSorted = [...trackEvents].sort((a, b) => (a.type === 'encounter' ? 1 : -1))
  featureCollection.features = trackEventsSorted.map((event: RawEvent) => {
    const authorized = event.encounter && event.encounter.authorized === true
    const authorizationStatus = event.encounter
      ? event.encounter.authorizationStatus
      : ('unmatched' as AuthorizationOptions)

    const lng = event.position.lng || event.position.lon || 0
    return {
      type: 'Feature',
      properties: {
        id: event.id,
        type: event.type,
        timestamp: event.start,
        authorized,
        authorizationStatus,
        icon: `carrier_portal_${event.type}`,
        color:
          event.type === 'encounter'
            ? getEncounterAuthColor(authorizationStatus)
            : EVENTS_COLORS[event.type],
      },
      geometry: {
        type: 'Point',
        coordinates: [lng, event.position.lat],
      },
    }
  })

  return featureCollection
}
