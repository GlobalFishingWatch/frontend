/**
 * Renders one map screenshot per ocean area and saves it as <out>/<datasetId>/<areaId>@2x.webp
 *
 * Drives the real platform map (report route) rather than a bespoke renderer: the report route is
 * what draws the area highlight, and tile fetching dominates the per-area cost anyway. The browser
 * side lives in `lib/capture.ts`, shared with `screenshots-ports.ts`.
 *
 *   pnpm nx run ocean-areas:screenshots --args="--type eez --limit 5"
 *   pnpm nx run ocean-areas:screenshots --args="--type mpa --concurrency 6"
 *   pnpm nx run ocean-areas:screenshots --args="--type mpa --largest --limit 1000 --concurrency 6"
 *   pnpm nx run ocean-areas:screenshots --args="--type eez --upload gs://my-bucket/area-screenshots"
 *   pnpm nx run ocean-areas:screenshots --args="--type mpa --ids 400011,555672696 --force"
 *
 * Always through the nx target: it installs the ts-node hooks and builds the dataviews-client dist
 * this imports. Plain `node screenshots.ts` cannot resolve the workspace libs.
 */
import type { Geometry, Position } from 'geojson'
import { parseArgs } from 'node:util'

// Leaf subpath, not the root barrel: this pulls in the URL codec alone instead of the whole
// dataviews-client graph (api-client, redux toolkit, resolvers).
import type { BaseUrlWorkspace } from '@globalfishingwatch/dataviews-client/url-workspace'
import { stringifyWorkspace } from '@globalfishingwatch/dataviews-client/url-workspace'
import {
  AIS_DATAVIEW_INSTANCE_ID,
  DEFAULT_BASEMAP_DATAVIEW_INSTANCE_ID,
  VMS_DATAVIEW_INSTANCE_ID,
} from '@platform/config/map/dataviews'
import { getPlaceThumbnailPath } from '@platform/config/map/thumbnails'

import type { OceanAreaBBox } from '../ocean-areas'

import type { AreaType, AreaTypeId, OceanAreaFeature } from './lib/area-types.ts'
import { AREA_TYPES } from './lib/area-types.ts'
import type { CaptureJob } from './lib/capture.ts'
import { BASE_URL, CAPTURE_OPTIONS, captureAll, PATH_BASENAME } from './lib/capture.ts'
import { getAntimeridianBBox } from './lib/utils.ts'

// `nx run ... --args="--type eez,fao"` splits the comma list into positionals before the script
// ever sees it, so positionals are accepted as extra `--type` values — or, with `--ids`, as extra
// ids when they are not an area type.
const { values: opts, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    ...CAPTURE_OPTIONS,
    type: { type: 'string', default: 'eez,fao,rfmo,mpa' },
    heatmaps: { type: 'boolean', default: true },
    /** biggest `areaSize` first, so `--limit` keeps the largest areas */
    largest: { type: 'boolean', default: false },
    /** Comma list of area ids (`properties.area`) to capture, e.g. after fixing their geometry */
    ids: { type: 'string' },
  },
})

const WIDTH = Number(opts.width)
const HEIGHT = Number(opts.height)
type GeometryWithCoordinates = Exclude<Geometry, { geometries: unknown }>
type AnyPosition = Position | Position[] | Position[][] | Position[][][]

/** `east` is past 180 when the area crosses the antimeridian, see `getAntimeridianBBox` */
export function getBBox(geometry: Geometry): OceanAreaBBox {
  const collect = (coordinates: AnyPosition): Position[] =>
    typeof coordinates[0] === 'number'
      ? [coordinates as Position]
      : (coordinates as Position[]).flatMap(collect)
  const { type, coordinates } = geometry as GeometryWithCoordinates
  // Each member of a Multi* geometry is its own part; anything else is one part
  return getAntimeridianBBox(
    type.startsWith('Multi') ? (coordinates as AnyPosition[]).map(collect) : [collect(coordinates)]
  )
}

export type Viewport = { longitude: number; latitude: number; zoom: number }

/**
 * Web-mercator-ish fit of a bbox into the canvas. Zoom is clamped to 2..8 because outside that band
 * the satellite basemap does not render: below ~2 the pmtiles source has no coverage, and above 8
 * `BasemapLayer` switches to a Google tileset pinned to the dev API gateway.
 */
export function getViewport(
  [minX, minY, maxX, maxY]: OceanAreaBBox,
  width = WIDTH,
  height = HEIGHT
): Viewport {
  const spanX = Math.max(maxX - minX, 0.05)
  const spanY = Math.max(maxY - minY, 0.05)
  const zoom = Math.min(
    Math.log2((360 / spanX) * (width / 512)),
    Math.log2((180 / spanY) * (height / 512))
  )
  return {
    // Back into -180..180 for a bbox whose `east` is past the antimeridian
    longitude: (((minX + maxX) / 2 + 540) % 360) - 180,
    latitude: (minY + maxY) / 2,
    zoom: Math.max(2, Math.min(8, zoom - 0.15)),
  }
}

/** The workspace-state keys this script sets, on top of the viewport ones in `BaseUrlWorkspace`. */
type ScreenshotWorkspace = BaseUrlWorkspace & {
  screenshotMode: boolean
  sidebarOpen: boolean
  reportLoadVessels: boolean
  skipColorDomainSampling?: boolean
  dataviewInstances: { id: string; dataviewId?: string; config: Record<string, unknown> }[]
}

export function getAreaUrl(
  { datasetId, dataviewInstance }: AreaType,
  feature: OceanAreaFeature
): string {
  const areaId = String(feature.properties.area)
  const { longitude, latitude, zoom } = getViewport(getBBox(feature.geometry))
  // Written out in full and abbreviated by stringifyWorkspace, so this stays readable and cannot
  // drift from the app's own encoding.
  const workspace: ScreenshotWorkspace = {
    longitude,
    latitude,
    zoom,
    // hides the sidebar header, footer, map controls, hints and welcome modal
    screenshotMode: true,
    sidebarOpen: false,
    // without this the report keeps fetching vessel lists that never make it into the image
    reportLoadVessels: false,
    // skipColorDomainSampling: true,
    dataviewInstances: [
      { id: DEFAULT_BASEMAP_DATAVIEW_INSTANCE_ID, config: { basemap: 'satellite' } },
      dataviewInstance,
      { id: AIS_DATAVIEW_INSTANCE_ID, config: { visible: opts.heatmaps } },
      { id: VMS_DATAVIEW_INSTANCE_ID, config: { visible: opts.heatmaps } },
    ],
  }
  const path = `${PATH_BASENAME}/map/fishing-activity/default-public/report/${datasetId}/${encodeURIComponent(areaId)}`
  return `${BASE_URL}${path}?${stringifyWorkspace(workspace)}`
}

function loadQueue(): CaptureJob[] {
  const isType = (value: string) => Object.hasOwn(AREA_TYPES, value)
  const extraTypes = opts.ids ? positionals.filter(isType) : positionals
  const types = [...opts.type!.split(','), ...extraTypes]
    .map((type) => type.trim())
    .filter(Boolean) as AreaTypeId[]
  const limit = opts.limit ? Number(opts.limit) : Infinity
  const ids = opts.ids
    ? new Set(
        [...opts.ids.split(','), ...positionals.filter((value) => !isType(value))].map((id) =>
          id.trim()
        )
      )
    : undefined
  return types.flatMap((type) => {
    const areaType = AREA_TYPES[type]
    if (!areaType) {
      throw new Error(`Unknown area type "${type}". Use one of ${Object.keys(AREA_TYPES)}`)
    }
    const features = opts.largest
      ? areaType.features.toSorted(
          (a, b) => (b.properties.areaSize ?? 0) - (a.properties.areaSize ?? 0)
        )
      : areaType.features
    return features
      .filter((feature) => !ids || ids.has(String(feature.properties.area)))
      .slice(0, limit)
      .map((feature) => {
        return {
          url: getAreaUrl(areaType, feature),
          file: `${opts.out}/${getPlaceThumbnailPath(areaType.datasetId, feature.properties.area!)}`,
        }
      })
  })
}

function selftest(): void {
  const square: Geometry = {
    type: 'Polygon',
    coordinates: [
      [
        [-10, -5],
        [10, -5],
        [10, 5],
        [-10, 5],
        [-10, -5],
      ],
    ],
  }
  const bbox = getBBox(square)
  console.assert(JSON.stringify(bbox) === '[-10,-5,10,5]', 'getBBox', bbox)
  const view = getViewport(bbox)
  console.assert(view.longitude === 0 && view.latitude === 0, 'getViewport centre', view)
  console.assert(view.zoom >= 2 && view.zoom <= 8, 'getViewport zoom clamp', view)
  // Parts at 163° and -177° frame the 20° between them, not the 340° the other way round
  const crossing = getBBox({
    type: 'MultiPoint',
    coordinates: [
      [163, 16],
      [-177, -1],
    ],
  })
  console.assert(JSON.stringify(crossing) === '[163,-1,183,16]', 'antimeridian getBBox', crossing)
  console.assert(getViewport(crossing).longitude === 173, 'antimeridian centre', crossing)
  console.assert(getViewport([170, 0, 200, 10]).longitude === -175, 'centre wraps past 180')
  // A part spanning 250° between two vertices (CCSBT) must not be cut down to its vertices
  const longPart = getBBox({
    type: 'MultiPolygon',
    coordinates: [
      [
        [
          [-180, 0],
          [-170, 0],
          [-170, 1],
          [-180, 0],
        ],
      ],
      [
        [
          [-70, 0],
          [180, 0],
          [180, 1],
          [-70, 0],
        ],
      ],
    ],
  })
  console.assert(JSON.stringify(longPart) === '[-70,0,190,1]', 'long part getBBox', longPart)
  // A circumpolar ring (CCAMLR) stays the whole globe
  const ring = getBBox({
    type: 'LineString',
    coordinates: [
      [-180, -60],
      [0, -60],
      [180, -60],
    ],
  })
  console.assert(JSON.stringify(ring) === '[-180,-60,180,-60]', 'circumpolar getBBox', ring)
  // A whole-world bbox must clamp up to the minimum satellite zoom, not down to 0
  console.assert(getViewport([-180, -90, 180, 90]).zoom === 2, 'world bbox clamps to 2')

  const url = getAreaUrl(AREA_TYPES.eez, {
    type: 'Feature',
    properties: { type: 'eez', name: 'Testland', area: 1234 },
    geometry: square,
  })
  console.assert(url.includes('/report/public-eez-areas/1234'), 'report path', url)
  console.assert(url.includes('screenshotMode=true'), 'screenshotMode in url', url)
  // stringifyWorkspace abbreviates dataviewInstances -> dvIn and sidebarOpen -> sbO
  console.assert(url.includes('dvIn%5B0%5D%5Bid%5D=basemap'), 'dataview instances encoded', url)
  console.assert(url.includes('sbO=false'), 'sidebarOpen abbreviated', url)

  console.log('selftest ok')
}

if (opts.selftest) {
  selftest()
} else {
  await captureAll(loadQueue(), {
    width: WIDTH,
    height: HEIGHT,
    quality: Number(opts.quality),
    concurrency: Number(opts.concurrency),
    out: opts.out,
    force: opts.force,
    upload: opts.upload,
  })
}
