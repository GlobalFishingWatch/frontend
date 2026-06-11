import { PbfWriter as Pbf } from 'pbf'

export const createMockTileBBox = () => ({
  id: 'tile-0-0',
  bbox: {
    west: -180,
    south: -90,
    east: 180,
    north: 90,
  },
  index: { x: 0, y: 0, z: 0 },
})

export function createHeatmapPbfBuffer(
  cells: { cellNum: number; startAbs: number; endAbs: number; values: number[] }[]
) {
  const pbf = new Pbf()
  const packed = cells.flatMap((cell) => [cell.cellNum, cell.startAbs, cell.endAbs, ...cell.values])
  pbf.writePackedVarint(1, packed)
  const bytes = pbf.finish()
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)
}

export function createVectorsPbfBuffer(
  temporalAggregation: boolean,
  cells: {
    cellNum: number
    u: number
    v: number
    startAbs?: number
    endAbs?: number
    pairs?: { u: number; v: number }[]
  }[]
) {
  const pbf = new Pbf()
  if (temporalAggregation) {
    const values = cells.flatMap((c) => [c.cellNum, c.u, c.v])
    pbf.writePackedVarint(1, values)
  } else {
    const values: number[] = []
    for (const c of cells) {
      const startAbs = c.startAbs ?? 0
      const endAbs = c.endAbs ?? startAbs
      const pairs = c.pairs ?? [{ u: c.u, v: c.v }]
      values.push(c.cellNum, startAbs, endAbs, ...pairs.flatMap((pair) => [pair.u, pair.v]))
    }
    pbf.writePackedVarint(1, values)
  }
  const bytes = pbf.finish()
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)
}
