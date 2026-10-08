import { describe, expect, it } from 'vitest'

import type { DeckLayerAtom } from '@globalfishingwatch/deck-layer-composer'
import { FourwingsLayer, VesselLayer } from '@globalfishingwatch/deck-layers'

import type { SliceInteractionEvent } from 'features/_map/map/map.slice'

import { getMapView } from './chat-map-view'

// cell polygon ring [minX, minY, maxX, minY, maxX, maxY, minX, maxY, minX, minY]
const cell = (x: number, y: number, aggregatedValues: (number | undefined)[]) => ({
  coordinates: [x, y, x + 1, y, x + 1, y + 1, x, y + 1, x, y],
  properties: {},
  aggregatedValues,
})

const heatmapLayer = (loaded: boolean) => {
  const instance = Object.assign(Object.create(FourwingsLayer.prototype), {
    id: 'activity',
    props: { category: 'activity', visible: true },
    getMode: () => 'heatmap',
    getAggregationOperation: () => 'sum',
    getFourwingsLayers: () => [
      { id: 'ais', unit: 'hours', datasets: ['ais-effort'], filter: "flag IN ('FRA')" },
      { id: 'vms', unit: 'hours', datasets: ['vms-effort'] },
    ],
    getViewportData: () => [cell(0, 0, [2, undefined]), cell(10, 5, [8, undefined])],
  })
  return { id: 'activity', instance, loaded, ready: true } as unknown as DeckLayerAtom
}

describe('getMapView', () => {
  it('summarizes the heatmap cells in view per sublayer', () => {
    const view = getMapView({
      deckLayers: [heatmapLayer(true)],
      bounds: { west: -20, south: -10, east: 20, north: 10 },
      viewport: { latitude: 0, longitude: 0, zoom: 3 },
      datasets: [],
      clicked: null,
    })
    expect(view.layers).toEqual([
      {
        category: 'activity',
        mode: 'heatmap',
        dataviewIds: ['ais', 'vms'],
        sublayers: [
          {
            dataviewId: 'ais',
            datasets: ['ais-effort'],
            filter: "flag IN ('FRA')",
            unit: 'hours',
            cellsWithData: 2,
            min: 2,
            max: 8,
            total: 10,
            maxValueAt: [10.5, 5.5],
            dataBbox: [0.5, 0.5, 10.5, 5.5],
          },
          { dataviewId: 'vms', datasets: ['vms-effort'], unit: 'hours', cellsWithData: 0 },
        ],
      },
    ])
  })

  it('flags layers still loading', () => {
    const view = getMapView({
      deckLayers: [heatmapLayer(false)],
      bounds: { west: -20, south: -10, east: 20, north: 10 },
      viewport: { latitude: 0, longitude: 0, zoom: 3 },
      datasets: [],
      clicked: null,
    })
    expect(view.layers[0]).toMatchObject({ loaded: false })
  })

  it('counts only the track points drawn inside the viewport, across the antimeridian', () => {
    const instance = Object.assign(Object.create(VesselLayer.prototype), {
      id: 'vessel-1',
      props: { category: 'vessels', visible: true, startTime: 0, endTime: 10_000 },
      getVesselName: () => 'NAUTILUS',
      getVesselTrackBounds: () => [170, -5, 200, 5],
      getVesselEventsData: () => [
        { type: 'fishing', start: 1000, end: 2000, coordinates: [-179, 0] },
        { type: 'fishing', start: 1000, end: 2000, coordinates: [0, 0] },
      ],
      // like getSegmentsFromData: points only carry coordinates with includeCoordinates
      getVesselTrackSegments: ({ includeCoordinates }: { includeCoordinates?: boolean }) => [
        [
          { longitude: 170, latitude: 0, timestamp: 1000, speed: 2 },
          { longitude: -179, latitude: 1, timestamp: 2000, speed: 4 },
          { longitude: 0, latitude: 0, timestamp: 3000, speed: 9 },
        ].map(({ longitude, latitude, ...point }) =>
          includeCoordinates ? { longitude, latitude, ...point } : point
        ),
      ],
    })
    const view = getMapView({
      deckLayers: [{ id: 'vessel-1', instance, loaded: true } as unknown as DeckLayerAtom],
      // wrapped viewport centered on the antimeridian
      bounds: { west: 160, south: -10, east: 200, north: 10 },
      viewport: { latitude: 0, longitude: 180, zoom: 3 },
      datasets: [],
      clicked: null,
    })
    expect(view.layers[0]).toMatchObject({
      name: 'NAUTILUS',
      pointsInView: 2,
      firstInView: new Date(1000).toISOString(),
      lastInView: new Date(2000).toISOString(),
      speedKnotsInView: [2, 4],
      eventsInView: { fishing: 1 },
    })
  })

  it('summarizes the clicked cell with its vessels', () => {
    const clicked = {
      type: 'click',
      longitude: 1.23456,
      latitude: 2.34567,
      point: { x: 0, y: 0 },
      features: [
        {
          ...cell(0, 0, [5]),
          category: 'activity',
          layerId: 'activity',
          startTime: 0,
          endTime: 1000,
          interval: 'DAY',
          sublayers: [
            {
              id: 'ais',
              unit: 'hours',
              value: 5,
              vessels: [{ id: 'v1', shipname: 'A', flag: 'ESP', hours: 5, dataset: {} }],
            },
          ],
        },
      ],
    } as unknown as SliceInteractionEvent
    const view = getMapView({
      deckLayers: [],
      bounds: { west: -20, south: -10, east: 20, north: 10 },
      viewport: { latitude: 0, longitude: 0, zoom: 3 },
      datasets: [],
      clicked,
    })
    expect(view.clicked).toEqual({
      longitude: 1.23,
      latitude: 2.35,
      features: [
        {
          category: 'activity',
          layerId: 'activity',
          cellCenter: [0.5, 0.5],
          startTime: new Date(0).toISOString(),
          endTime: new Date(1000).toISOString(),
          interval: 'DAY',
          sublayers: [
            {
              dataviewId: 'ais',
              unit: 'hours',
              value: 5,
              totalVessels: 1,
              vessels: [
                {
                  id: 'v1',
                  name: 'A',
                  flag: 'ESP',
                  hours: 5,
                  detections: undefined,
                  events: undefined,
                },
              ],
            },
          ],
        },
      ],
    })
  })
})
