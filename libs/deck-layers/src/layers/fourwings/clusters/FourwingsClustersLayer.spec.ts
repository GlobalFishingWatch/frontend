import { describe, expect, it } from 'vitest'

import type { FourwingsPointFeature } from './fourwings-clusters.types'
import { FourwingsClustersLayer } from './FourwingsClustersLayer'

const startTime = Date.UTC(2023, 0, 1)
const endTime = Date.UTC(2023, 5, 1)

const baseProps = {
  id: 'fourwings-clusters-test',
  startTime,
  endTime,
  category: 'events',
  color: '#FF5E5E',
  datasetId: 'public-global-encounters-events:v3.0',
  tilesUrl: 'https://example.com/{z}/{x}/{y}',
  visible: true,
  maxZoom: 12,
} as any

const point = (
  id: string,
  lon: number,
  lat: number,
  properties: Record<string, unknown> = {}
): FourwingsPointFeature => ({
  type: 'Feature',
  geometry: { type: 'Point', coordinates: [lon, lat] },
  properties: {
    id,
    value: 1,
    cellNum: Number(id),
    cellBounds: [lon - 0.05, lat - 0.05, lon + 0.05, lat + 0.05],
    ...properties,
  },
})

const clusteredPoints: FourwingsPointFeature[] = [
  point('1', 0.001, 0.001),
  point('2', 0.002, 0.001),
  point('3', 0.001, 0.002),
  point('4', 0.002, 0.002),
  point('5', 12, -8, { value: 3 }),
]

const makeLayer = (zoom = 3) => {
  const layer = new FourwingsClustersLayer(baseProps)
  layer.initializeState({ viewport: { zoom } } as any)
  ;(layer as any).context = { viewport: { zoom } }
  return layer
}

describe('FourwingsClustersLayer Supercluster contract', () => {
  it('loads points without retaining the input GeoJSON array as .points', () => {
    const { clusterIndex } = makeLayer().state
    clusterIndex.load(clusteredPoints)
    expect((clusterIndex as any).points).toBeUndefined()
    expect((clusterIndex as any).numPoints).toBe(clusteredPoints.length)
  })

  it('sums values with reduce and preserves leaf properties used for expansion', () => {
    const { clusterIndex } = makeLayer().state
    clusterIndex.load(clusteredPoints)
    const clusters = clusterIndex.getClusters([-180, -85, 180, 85], 0)
    const cluster = clusters.find((feature) => feature.properties.cluster)

    expect(cluster).toBeDefined()
    expect(cluster!.properties.value).toBeGreaterThan(1)
    expect(cluster!.properties.cluster_id).toBeDefined()

    const leaves = clusterIndex.getLeaves(cluster!.properties.cluster_id, Infinity)
    expect(leaves.length).toBeGreaterThan(1)
    leaves.forEach((leaf) => {
      expect(leaf.properties.cellNum).toEqual(expect.any(Number))
      expect(leaf.properties.cellBounds).toHaveLength(4)
      expect(leaf.geometry.coordinates).toHaveLength(2)
    })

    expect(clusterIndex.getClusterExpansionZoom(cluster!.properties.cluster_id)).toBeGreaterThan(0)
  })

  it('returns clusters after load even though v9 dropped Supercluster.points', () => {
    const layer = makeLayer(2)
    layer.state.clusterIndex.load(clusteredPoints)

    const { clusters, points, radiusScale } = layer._getClustersByZoom(2)

    expect((clusters?.length ?? 0) + (points?.length ?? 0)).toBeGreaterThan(0)
    expect(radiusScale).toBeDefined()
    clusters?.forEach((feature) => {
      expect(feature.properties.value).toBeGreaterThan(1)
      expect(feature.geometry.coordinates).toHaveLength(2)
    })
  })

  it('computes expansion zoom from getLeaves after picking a cluster', () => {
    const layer = makeLayer(2)
    layer.state.clusterIndex.load(clusteredPoints)
    const { clusters } = layer._getClustersByZoom(2)
    const cluster = clusters?.find((feature) => feature.properties.cluster_id)

    expect(cluster).toBeDefined()

    const info = layer.getPickingInfo({
      info: { object: cluster, x: 0, y: 0, coordinate: [0, 0] } as any,
    })

    expect(info.object?.expansionZoom).toEqual(expect.any(Number))
    expect(info.object?.expansionBounds).toHaveLength(4)
  })
})
