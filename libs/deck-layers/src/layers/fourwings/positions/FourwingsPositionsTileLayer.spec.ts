import { afterEach, describe, expect, it, vi } from 'vitest'

import { FourwingsPositionsTileLayer } from './FourwingsPositionsTileLayer'

const startTime = Date.UTC(2023, 0, 1)
const endTime = Date.UTC(2023, 5, 1)

const baseProps = {
  id: 'fourwings-positions-test',
  startTime,
  endTime,
  category: 'activity',
  sublayers: [{ id: 'ais', visible: true, datasets: ['ds-a'], colorRamp: 'teal', color: '#ff0000' }],
} as any

// identity projection, so a tile-local coordinate lerps straight into the bbox range
const viewport = {
  projectFlat: ([x, y]: [number, number]) => [x, y],
  unprojectFlat: ([x, y]: [number, number]) => [x, y],
  getBounds: () => [-180, -90, 180, 90],
  zoom: 4,
} as any

// bare instance: enough for every method that only reads props/state/context
const makeLayer = () => {
  const layer = new FourwingsPositionsTileLayer(baseProps)
  ;(layer as any).context = { viewport }
  layer.state = {
    error: '',
    viewportDirty: false,
    viewportLoaded: false,
    lastViewport: '',
    positions: [],
    lastPositions: [],
    lastPositionsData: [],
    vesselTracks: [],
    lastPositionFeatures: new Set(),
    highlightedFeatureIds: new Set<string>(),
    highlightedVesselIds: new Set<string>(),
  } as any
  return layer
}

const position = (id: string, stime: number, lon: number) => ({
  geometry: { type: 'Point', coordinates: [lon, 0.5] },
  properties: { id, stime, layer: 0, value: stime, shipname: `VESSEL ${id}` },
})

const makeTile = (contents: any[]) => ({
  content: contents,
  bbox: { west: 0, east: 1, north: 1, south: 0 },
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('FourwingsPositionsTileLayer', () => {
  // TileLayer fires onViewportLoad on every tileset frame change, not only on new data. Rebuilding
  // then gives every layer a new data identity, which reuploads all attributes and — before
  // `transitions: {}` on the label layer — animated the labels across the map.
  it('does not rebuild state when the tiles carry the same parsed content', () => {
    vi.stubGlobal('requestAnimationFrame', (cb: () => void) => cb())
    const layer = makeLayer()
    const tile = makeTile([position('a', 10, 0.2), position('a', 20, 0.4), position('b', 30, 0.6)])

    layer._onViewportLoad([tile] as any)
    const { positions, lastPositions, vesselTracks, colorScale } = layer.state
    expect(positions).toHaveLength(3)
    expect(vesselTracks).toHaveLength(1)
    expect(lastPositions).toHaveLength(2)

    layer._onViewportLoad([tile] as any)
    expect(layer.state.positions).toBe(positions)
    expect(layer.state.lastPositions).toBe(lastPositions)
    expect(layer.state.vesselTracks).toBe(vesselTracks)
    expect(layer.state.colorScale).toBe(colorScale)

    layer._onViewportLoad([makeTile([position('a', 10, 0.2)])] as any)
    expect(layer.state.positions).not.toBe(positions)
    expect(layer.state.positions).toHaveLength(1)
  })

  it('still reports the viewport as loaded when a redundant load is skipped', () => {
    vi.stubGlobal('requestAnimationFrame', (cb: () => void) => cb())
    const layer = makeLayer()
    const tile = makeTile([position('a', 10, 0.2)])

    layer._onViewportLoad([tile] as any)
    layer.setState({ viewportLoaded: false })
    layer._onViewportLoad([tile] as any)

    expect(layer.state.viewportLoaded).toBe(true)
  })
})
