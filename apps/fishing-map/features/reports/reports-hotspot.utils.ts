import { area } from '@turf/turf'
import type { Feature, Polygon } from 'geojson'
import { around } from 'geokdbush'
import KDBush from 'kdbush'

import { FourwingsLayer } from '@globalfishingwatch/deck-layers'
import type { FourwingsFeature } from '@globalfishingwatch/deck-loaders'

import type { FilteredPolygons } from 'features/reports/reports-geo.utils'
import type { ReportDeckLayer } from 'features/reports/reports-timeseries.utils'

type CellEntry = { cell: FourwingsFeature; total: number }

// Max aspect ratio for the ellipse — prevents needle-like shapes for near-linear distributions.
const MAX_ASPECT = 10

type EllipseParams = {
  cx: number
  cy: number
  a: number // semi-major axis in km
  b: number // semi-minor axis in km
  angle: number // rotation of semi-major axis from east, radians
  kmPerDegLng: number
  kmPerDegLat: number
}

export function formatArea(km2: number): string {
  if (km2 >= 1000) return `${(km2 / 1000).toFixed(0)}k`
  return `${km2}`
}

// Finds the circle of area = maxAreaKm2 that maximizes total activity inside it.
// Returns the cells within the winning circle — used as input for PCA ellipse fitting.
function circularWindowSweep(cellTotals: CellEntry[], maxAreaKm2: number): CellEntry[] {
  const r = Math.sqrt(maxAreaKm2 / Math.PI)

  const lngs = cellTotals.map((e) => (e.cell.coordinates[0] + e.cell.coordinates[4]) / 2)
  const lats = cellTotals.map((e) => (e.cell.coordinates[1] + e.cell.coordinates[5]) / 2)

  const index = new KDBush(cellTotals.length)
  for (let i = 0; i < cellTotals.length; i++) index.add(lngs[i], lats[i])
  index.finish()

  let bestCells: CellEntry[] = []
  let bestTotal = -1

  for (let i = 0; i < cellTotals.length; i++) {
    const indices = around(index as any, lngs[i], lats[i], Infinity, r) as number[]
    let total = 0
    for (const j of indices) total += cellTotals[j].total
    if (total > bestTotal) {
      bestTotal = total
      bestCells = indices.map((j) => cellTotals[j])
    }
  }

  return bestCells
}

// Fits a PCA ellipse to the given cells, scaled so area = maxAreaKm2.
// Center and orientation come from activity-weighted statistics of the cells,
// so the ellipse is positioned on the dense area and oriented along its main axis.
function computeEllipseParams(cells: CellEntry[], maxAreaKm2: number): EllipseParams {
  const totalWeight = cells.reduce((s, e) => s + e.total, 0)

  let cx = 0
  let cy = 0
  for (const e of cells) {
    const c = e.cell.coordinates
    const w = e.total / totalWeight
    cx += w * ((c[0] + c[4]) / 2)
    cy += w * ((c[1] + c[5]) / 2)
  }

  const kmPerDegLng = 111.32 * Math.cos((cy * Math.PI) / 180)
  const kmPerDegLat = 110.574

  let Cxx = 0
  let Cyy = 0
  let Cxy = 0
  for (const e of cells) {
    const c = e.cell.coordinates
    const dx = ((c[0] + c[4]) / 2 - cx) * kmPerDegLng
    const dy = ((c[1] + c[5]) / 2 - cy) * kmPerDegLat
    const w = e.total / totalWeight
    Cxx += w * dx * dx
    Cyy += w * dy * dy
    Cxy += w * dx * dy
  }

  const trace = Cxx + Cyy
  const disc = Math.sqrt(Math.max(0, (trace / 2) ** 2 - (Cxx * Cyy - Cxy * Cxy)))
  const lambda1 = trace / 2 + disc
  const lambda2 = trace / 2 - disc

  let angle: number
  if (Math.abs(Cxy) < 1e-10) {
    angle = Cxx >= Cyy ? 0 : Math.PI / 2
  } else {
    angle = Math.atan2(lambda1 - Cxx, Cxy)
  }

  const MIN_VARIANCE = 1e-4
  let a: number
  let b: number
  if (lambda1 < MIN_VARIANCE) {
    a = b = Math.sqrt(maxAreaKm2 / Math.PI)
    angle = 0
  } else {
    const safeL2 = Math.max(lambda2, lambda1 / (MAX_ASPECT * MAX_ASPECT))
    const k = Math.sqrt(maxAreaKm2 / (Math.PI * Math.sqrt(lambda1 * safeL2)))
    a = k * Math.sqrt(lambda1)
    b = k * Math.sqrt(safeL2)
  }

  return { cx, cy, a, b, angle, kmPerDegLng, kmPerDegLat }
}

function buildEllipsePolygon(params: EllipseParams, steps = 36): Polygon {
  const { cx, cy, a, b, angle, kmPerDegLng, kmPerDegLat } = params
  const coords: [number, number][] = []

  for (let i = 0; i <= steps; i++) {
    const t = (2 * Math.PI * i) / steps
    const lx = a * Math.cos(t)
    const ly = b * Math.sin(t)
    const rx = lx * Math.cos(angle) - ly * Math.sin(angle)
    const ry = lx * Math.sin(angle) + ly * Math.cos(angle)
    coords.push([cx + rx / kmPerDegLng, cy + ry / kmPerDegLat])
  }

  return { type: 'Polygon', coordinates: [coords] }
}

function cellsInsideEllipse(cells: CellEntry[], params: EllipseParams): CellEntry[] {
  const { cx, cy, a, b, angle, kmPerDegLng, kmPerDegLat } = params
  return cells.filter((e) => {
    const c = e.cell.coordinates
    const dx = ((c[0] + c[4]) / 2 - cx) * kmPerDegLng
    const dy = ((c[1] + c[5]) / 2 - cy) * kmPerDegLat
    const rx = dx * Math.cos(-angle) - dy * Math.sin(-angle)
    const ry = dx * Math.sin(-angle) + dy * Math.cos(-angle)
    return (rx / a) ** 2 + (ry / b) ** 2 <= 1
  })
}

export type HotspotProperties = {
  areaKm2: number
  totalHours: number
  percentOfTotal: number
}

export function computeHotspotGeometry(
  filteredFeatures: FilteredPolygons[][],
  instances: ReportDeckLayer[],
  maxAreaKm2: number
): Feature<Polygon, HotspotProperties> | null {
  const cellTotals: CellEntry[] = []

  for (let i = 0; i < instances.length; i++) {
    const instance = instances[i]
    if (!(instance instanceof FourwingsLayer)) continue
    if ((instance as FourwingsLayer).props.static) continue

    const features = filteredFeatures[i]?.[0]
    if (!features?.contained?.length) continue

    for (const f of features.contained as FourwingsFeature[]) {
      if (!f.coordinates) continue
      const total = f.aggregatedValues?.reduce((acc: number, v: number) => acc + v, 0) ?? 0
      if (total > 0) {
        cellTotals.push({ cell: f, total })
      }
    }
  }

  if (!cellTotals.length) return null

  const grandTotal = cellTotals.reduce((acc, e) => acc + e.total, 0)

  // Step 1: circular sweep finds the densest area — gives correct center regardless of background activity
  // Step 2: Principal Component Analysis (PCA) on those cells only — fits ellipse orientation to the local shape (strip vs blob)
  // Step 3: activity inside final ellipse reported (may include cells outside the original circle)
  const t0 = performance.now()
  const denseCells = circularWindowSweep(cellTotals, maxAreaKm2)
  const t1 = performance.now()
  const params = computeEllipseParams(denseCells, maxAreaKm2)
  const t2 = performance.now()
  const ellipse = buildEllipsePolygon(params)
  const regionTotal = cellsInsideEllipse(cellTotals, params).reduce((acc, e) => acc + e.total, 0)
  const t3 = performance.now()
  console.debug(
    `[hotspot] sweep=${(t1 - t0).toFixed(1)}ms pca=${(t2 - t1).toFixed(1)}ms ellipse+filter=${(t3 - t2).toFixed(1)}ms total=${(t3 - t0).toFixed(1)}ms`
  )

  return {
    type: 'Feature',
    geometry: ellipse,
    properties: {
      areaKm2: Math.round(area(ellipse) / 1e6),
      totalHours: regionTotal,
      percentOfTotal: grandTotal > 0 ? (regionTotal / grandTotal) * 100 : 0,
    },
  }
}
