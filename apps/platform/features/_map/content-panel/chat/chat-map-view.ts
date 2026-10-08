import type { ApiEvent, Dataset, TrackSegment } from '@globalfishingwatch/api-types'
import type { DeckLayerAtom } from '@globalfishingwatch/deck-layer-composer'
import type {
  ContextFeature,
  ContextPickingObject,
  FourwingsDeckSublayer,
  UserLayerPickingObject,
  VesselEventPickingObject,
} from '@globalfishingwatch/deck-layers'
import {
  ContextLayer,
  FourwingsClustersLayer,
  FourwingsLayer,
  POSITIONS_ID,
  UserContextTileLayer,
  UserTracksLayer,
  VesselLayer,
} from '@globalfishingwatch/deck-layers'
import type {
  FourwingsFeature,
  FourwingsPointFeature,
  FourwingsPositionFeature,
} from '@globalfishingwatch/deck-loaders'
import type { MiniglobeBounds } from '@globalfishingwatch/ui-components'

import type {
  ExtendedFeatureByVesselEvent,
  ExtendedFeatureEvent,
  SliceExtendedClusterPickingObject,
  SliceExtendedFeature,
  SliceExtendedFourwingsPickingObject,
  SliceInteractionEvent,
} from 'features/_map/map/map.slice'
import { getContextValue } from 'features/_map/map/popups/map-popups.utils'
import { filterFeaturesByDistance } from 'features/_map/workspace/context-areas/context.utils'
import type { MapCoordinates } from 'types'

/**
 * Summary of what the user sees on the map right now, read from the deck layers
 * already loaded for the viewport. Sent to the agent with each chat message so it
 * can answer "is there any vessel here?", "what areas are visible?" or "where is
 * the activity?". Only what is rendered in the viewport for the current time range:
 * tiles outside the view are not loaded, so this is never a global answer.
 */

type Bbox = [number, number, number, number]

const MAX_ITEMS = 10

const round = (n: number) => Math.round(n * 100) / 100
const roundValue = (n: number) => Number(n.toPrecision(4))

function isPointInBounds([lon, lat]: number[], bounds: MiniglobeBounds) {
  if (lat < bounds.south || lat > bounds.north) return false
  const width = bounds.east - bounds.west
  if (width >= 360) return true
  // the viewport longitudes can go past ±180 when the map wraps around the antimeridian
  return (((lon - bounds.west) % 360) + 360) % 360 <= width
}

function extendBbox(bbox: Bbox | undefined, [lon, lat]: number[]): Bbox {
  if (!bbox) return [lon, lat, lon, lat]
  return [
    Math.min(bbox[0], lon),
    Math.min(bbox[1], lat),
    Math.max(bbox[2], lon),
    Math.max(bbox[3], lat),
  ]
}

const roundBbox = (bbox?: number[] | null) => (bbox?.length ? bbox.map(round) : undefined)

/** Center of a fourwings cell: coordinates are its polygon ring [minX, minY, maxX, minY, maxX, maxY, ...] */
const getCellCenter = (c: number[]) => [(c[0] + c[4]) / 2, (c[1] + c[5]) / 2]

/** What tells sublayers of the same layer apart, e.g. two AIS effort layers with different flags */
const getSublayerInfo = (sublayer: FourwingsDeckSublayer) => ({
  dataviewId: sublayer.id,
  datasets: sublayer.datasets,
  // SQL resolved from the dataview filters, e.g. "flag IN ('FRA')"
  ...(sublayer.filter && { filter: sublayer.filter }),
  ...(sublayer.vesselGroups?.length && { vesselGroups: sublayer.vesselGroups }),
  unit: sublayer.unit,
})

function getFourwingsSummary(layer: FourwingsLayer) {
  const sublayers = layer.getFourwingsLayers()
  const base = {
    category: layer.props.category,
    mode: layer.getMode(),
    dataviewIds: sublayers.map((s) => s.id),
  }

  if (layer.getMode() === POSITIONS_ID) {
    const positions = (layer.getViewportData() || []) as FourwingsPositionFeature[]
    const vessels: Record<string, { id: string; name?: string; value: number }> = {}
    for (const { properties } of positions) {
      const id = properties.vessel_id || properties.id
      if (!id) continue
      vessels[id] ??= { id, name: properties.shipname, value: 0 }
      vessels[id].value += properties.value || 0
    }
    const sorted = Object.values(vessels).sort((a, b) => b.value - a.value)
    return {
      ...base,
      positionsInView: positions.length,
      vesselsInView: sorted.length,
      topVessels: sorted.slice(0, MAX_ITEMS).map((v) => ({ ...v, value: roundValue(v.value) })),
    }
  }

  const cells = (layer.getViewportData() || []) as FourwingsFeature[]
  const isAverage = layer.getAggregationOperation() === 'avg'
  return {
    ...base,
    sublayers: sublayers.map((sublayer, index) => {
      let count = 0
      let sum = 0
      let min = Infinity
      let max = -Infinity
      let peak: number[] | undefined
      let dataBbox: Bbox | undefined
      for (const cell of cells) {
        // undefined = no data in this cell, 0 is a measured value
        const value = cell.aggregatedValues?.[index]
        if (value === undefined || !Number.isFinite(value)) continue
        const center = getCellCenter(cell.coordinates)
        count++
        sum += value
        min = Math.min(min, value)
        if (value > max) {
          max = value
          peak = center
        }
        dataBbox = extendBbox(dataBbox, center)
      }
      return {
        ...getSublayerInfo(sublayer),
        cellsWithData: count,
        ...(count && {
          min: roundValue(min),
          max: roundValue(max),
          ...(isAverage ? { mean: roundValue(sum / count) } : { total: roundValue(sum) }),
          maxValueAt: peak?.map(round),
          dataBbox: roundBbox(dataBbox),
        }),
      }
    }),
  }
}

function getClustersSummary(layer: FourwingsClustersLayer) {
  const clusters = (layer.getViewportData() || []) as FourwingsPointFeature[]
  return {
    category: layer.props.category,
    dataviewId: layer.id,
    eventType: layer.props.eventType,
    clustersInView: clusters.length,
    eventsInView: clusters.reduce((acc, c) => acc + (c.properties.value || 0), 0),
  }
}

function getContextSummary(
  layer: ContextLayer | UserContextTileLayer,
  viewport: MapCoordinates,
  datasets: Dataset[]
) {
  const features = layer.getRenderedFeatures() as ContextFeature[]
  const closest = filterFeaturesByDistance(features, {
    viewport,
    limit: MAX_ITEMS,
  }) as unknown as ContextPickingObject[]
  return {
    category: layer.props.category,
    dataviewIds: layer.props.layers.flatMap((l) => l.sublayers.map((s) => s.dataviewId)),
    areasInView: features.length,
    closestToCenter: closest.map((feature) => ({
      id: feature.id,
      label: getContextValue(
        feature,
        datasets.find((d) => d.id === feature.datasetId)
      ),
    })),
  }
}

const toISO = (t?: number | string) => (t === undefined ? undefined : new Date(t).toISOString())

/** Track points actually drawn inside the viewport, not just the track bbox overlapping it */
function getTrackInView(segments: TrackSegment[], bounds: MiniglobeBounds) {
  let pointsInView = 0
  let first = Infinity
  let last = -Infinity
  let minSpeed = Infinity
  let maxSpeed = -Infinity
  let bbox: Bbox | undefined
  for (const segment of segments) {
    for (const { longitude, latitude, timestamp, speed } of segment) {
      if (typeof longitude !== 'number' || typeof latitude !== 'number') continue
      if (!isPointInBounds([longitude, latitude], bounds)) continue
      pointsInView++
      bbox = extendBbox(bbox, [longitude, latitude])
      if (typeof timestamp === 'number') {
        first = Math.min(first, timestamp)
        last = Math.max(last, timestamp)
      }
      if (typeof speed === 'number') {
        minSpeed = Math.min(minSpeed, speed)
        maxSpeed = Math.max(maxSpeed, speed)
      }
    }
  }
  return {
    pointsInView,
    ...(pointsInView && {
      bboxInView: roundBbox(bbox),
      ...(Number.isFinite(first) && { firstInView: toISO(first), lastInView: toISO(last) }),
      ...(Number.isFinite(minSpeed) && { speedKnotsInView: [round(minSpeed), round(maxSpeed)] }),
    }),
  }
}

function getVesselSummary(layer: VesselLayer, bounds: MiniglobeBounds) {
  const { startTime, endTime } = layer.props
  const eventsInView: Record<string, number> = {}
  for (const event of layer.getVesselEventsData()) {
    const inTimeRange =
      (!endTime || (event.start as number) < endTime) &&
      (!startTime || (event.end as number) > startTime)
    if (inTimeRange && event.coordinates && isPointInBounds(event.coordinates, bounds)) {
      eventsInView[event.type] = (eventsInView[event.type] || 0) + 1
    }
  }
  return {
    category: layer.props.category,
    dataviewId: layer.id,
    name: layer.getVesselName(),
    // whole track, any time: to frame "zoom to this vessel's track"
    trackBbox: roundBbox(layer.getVesselTrackBounds()),
    // current time range only, what the map draws
    ...getTrackInView(
      layer.getVesselTrackSegments({
        includeMiddlePoints: true,
        includeCoordinates: true,
        startTime,
        endTime,
      }),
      bounds
    ),
    eventsInView,
  }
}

function getUserTracksSummary(layer: UserTracksLayer, bounds: MiniglobeBounds) {
  return {
    category: layer.props.category,
    dataviewId: layer.id,
    trackBbox: roundBbox(layer.getBbox()),
    ...getTrackInView(layer.getSegments({ includeMiddlePoints: true }), bounds),
  }
}

function getLayerSummary(instance: DeckLayerAtom['instance'], params: GetMapViewParams) {
  const { bounds, viewport, datasets } = params
  if (instance instanceof FourwingsLayer) return getFourwingsSummary(instance)
  if (instance instanceof FourwingsClustersLayer) return getClustersSummary(instance)
  if (instance instanceof ContextLayer || instance instanceof UserContextTileLayer) {
    return getContextSummary(instance, viewport, datasets)
  }
  if (instance instanceof VesselLayer) return getVesselSummary(instance, bounds)
  if (instance instanceof UserTracksLayer) return getUserTracksSummary(instance, bounds)
  return undefined
}

type GetMapViewParams = {
  deckLayers: DeckLayerAtom[]
  bounds: MiniglobeBounds
  viewport: MapCoordinates
  datasets: Dataset[]
  areaName?: string
  clicked: SliceInteractionEvent | null
}

export function getMapView(params: GetMapViewParams) {
  const { deckLayers, bounds, areaName, clicked, datasets } = params
  return {
    areaName,
    clicked: getClickedSummary(clicked, datasets),
    bounds: roundBbox([bounds.west, bounds.south, bounds.east, bounds.north]),
    layers: deckLayers.flatMap((layer) => {
      if (layer.instance.props.visible === false) return []
      try {
        const summary = getLayerSummary(layer.instance, params)
        if (!summary) return []
        // still loading its tiles: what it has is partial
        return layer.loaded ? summary : { ...summary, loaded: false }
      } catch (e) {
        // a layer in a transitional state must not block the message
        console.warn('chat map view: could not summarize layer', layer.id, e)
        return []
      }
    }),
  }
}

type VesselLike = { id?: string; name?: string; shipname?: string; flag?: string }
const pickVessel = (vessel?: VesselLike) =>
  vessel && { id: vessel.id, name: vessel.name ?? vessel.shipname, flag: vessel.flag }

function getEventSummary(apiEvent: ExtendedFeatureEvent | VesselEventPickingObject) {
  if ('vessels' in apiEvent) {
    // events grouped by vessel (e.g. port visits in one port)
    const event = apiEvent as ExtendedFeatureByVesselEvent
    return {
      id: event.id,
      type: event.type,
      port: event.port?.name,
      totalVessels: event.vessels.length,
      vessels: event.vessels
        .slice(0, MAX_ITEMS)
        .map((v) => ({ ...pickVessel(v), events: v.events })),
    }
  }
  const event = apiEvent as ApiEvent
  return {
    id: event.id,
    type: event.type,
    start: toISO(event.start),
    end: toISO(event.end),
    position: event.position && [round(event.position.lon), round(event.position.lat)],
    vessel: pickVessel(event.vessel),
    encounteredVessel: pickVessel(event.encounter?.vessel),
    port: event.port_visit?.intermediateAnchorage?.name ?? event.port?.name,
    durationHrs: event.port_visit?.durationHrs,
  }
}

function getClickedFeatureSummary(feature: SliceExtendedFeature, datasets: Dataset[]) {
  const base = { category: feature.category, layerId: feature.layerId }
  if ('clusterMode' in feature) {
    const cluster = feature as SliceExtendedClusterPickingObject
    return {
      ...base,
      eventType: cluster.eventType,
      eventsInCluster: cluster.count ?? cluster.properties?.value,
      ...(cluster.event && { event: getEventSummary(cluster.event) }),
    }
  }
  if ('vesselId' in feature && 'start' in feature) {
    return { ...base, event: getEventSummary(feature) }
  }
  if ('sublayers' in feature && 'coordinates' in feature) {
    // activity / detections / environment cell, with the vessels the API returned for it
    const cell = feature as SliceExtendedFourwingsPickingObject
    return {
      ...base,
      cellCenter: getCellCenter(cell.coordinates).map(round),
      startTime: toISO(cell.startTime),
      endTime: toISO(cell.endTime),
      interval: cell.interval,
      sublayers: cell.sublayers.map((sublayer) => ({
        ...getSublayerInfo(sublayer),
        value: sublayer.value === undefined ? undefined : roundValue(sublayer.value),
        ...(sublayer.vessels && {
          totalVessels: sublayer.vessels.length,
          vessels: sublayer.vessels.slice(0, MAX_ITEMS).map((v) => ({
            ...pickVessel(v),
            hours: v.hours,
            detections: v.detections,
            events: v.events,
          })),
        }),
      })),
    }
  }
  if (
    'geometry' in feature &&
    feature.geometry?.type === 'Point' &&
    'stime' in feature.properties
  ) {
    // positions mode: one vessel position
    const { properties } = feature
    return {
      ...base,
      vessel: { id: properties.vessel_id || properties.id, name: properties.shipname },
      value: properties.value,
    }
  }
  // context or user area
  const area = feature as ContextPickingObject | UserLayerPickingObject
  return {
    ...base,
    id: area.id,
    label: getContextValue(
      area,
      datasets.find((d) => d.id === area.datasetId)
    ),
  }
}

/** The last place the user clicked on the map and what the popup showed there */
function getClickedSummary(clicked: SliceInteractionEvent | null, datasets: Dataset[]) {
  if (!clicked) return undefined
  return {
    longitude: round(clicked.longitude),
    latitude: round(clicked.latitude),
    features: clicked.features.flatMap((feature) => {
      try {
        return getClickedFeatureSummary(feature, datasets)
      } catch (e) {
        console.warn('chat map view: could not summarize clicked feature', e)
        return []
      }
    }),
  }
}
