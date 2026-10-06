/**
 * Renders one map screenshot per ocean area and saves it as <out>/<datasetId>/<areaId>@2x.webp
 *
 * Drives the real platform map (report route) rather than a bespoke renderer: the report route is
 * what draws the area highlight, and tile fetching dominates the per-area cost anyway. The browser
 * side lives in `lib/capture.ts`, shared with `screenshots-ports.ts`.
 *
 *   pnpm nx run ocean-areas:screenshots --args="--type eez --limit 5"
 *   pnpm nx run ocean-areas:screenshots --args="--type mpa --concurrency 6"
 *   pnpm nx run ocean-areas:screenshots --args="--type eez --upload gs://my-bucket/area-screenshots"
 *
 * Always through the nx target: it installs the ts-node hooks and builds the dataviews-client dist
 * this imports. Plain `node screenshots.ts` cannot resolve the workspace libs.
 */
import type { Feature, Geometry, Position } from 'geojson'
import { parseArgs } from 'node:util'

// Leaf subpath, not the root barrel: this pulls in the URL codec alone instead of the whole
// dataviews-client graph (api-client, redux toolkit, resolvers).
import type { BaseUrlWorkspace } from '@globalfishingwatch/dataviews-client/url-workspace'
import { stringifyWorkspace } from '@globalfishingwatch/dataviews-client/url-workspace'
// The app owns these ids — the workspace the report route loads declares its instances with them,
// so a literal here would silently stop matching if the app ever renamed one.
import {
  AIS_DATAVIEW_INSTANCE_ID,
  DEFAULT_BASEMAP_DATAVIEW_INSTANCE_ID,
  EEZ_DATAVIEW_INSTANCE_ID,
  FAO_AREAS_DATAVIEW_INSTANCE_ID,
  FAO_AREAS_DATAVIEW_SLUG,
  MPA_DATAVIEW_INSTANCE_ID,
  RFMO_DATAVIEW_INSTANCE_ID,
  VMS_DATAVIEW_INSTANCE_ID,
} from '@platform/config/map/dataviews'

import eezs from '../data/eezs.json' with { type: 'json' }
import fao from '../data/fao.json' with { type: 'json' }
import mpas from '../data/mpas.json' with { type: 'json' }
import rfmos from '../data/rfmos.json' with { type: 'json' }
import type { OceanAreaBBox, OceanAreaProperties } from '../ocean-areas'

import type { CaptureJob } from './lib/capture.ts'
import { BASE_URL, CAPTURE_OPTIONS, captureAll, PATH_BASENAME } from './lib/capture.ts'

type OceanAreaFeature = Feature<Geometry, OceanAreaProperties>

type AreaType = {
  features: OceanAreaFeature[]
  /** dataset the report route resolves the area against */
  datasetId: string
  /** context layer that must be visible for the highlight to draw */
  dataviewInstanceId: string
  /** needed when the default workspace lacks the instance, else the URL instance resolves to nothing */
  dataviewId?: string
}

const AREA_TYPES = {
  eez: {
    features: eezs as OceanAreaFeature[],
    datasetId: 'public-eez-areas',
    dataviewInstanceId: EEZ_DATAVIEW_INSTANCE_ID,
  },
  mpa: {
    features: mpas as OceanAreaFeature[],
    datasetId: 'public-mpa-all',
    dataviewInstanceId: MPA_DATAVIEW_INSTANCE_ID,
  },
  fao: {
    features: fao as OceanAreaFeature[],
    datasetId: 'public-fao-major',
    dataviewInstanceId: FAO_AREAS_DATAVIEW_INSTANCE_ID,
    // FAO is not in BASE_CONTEXT_LAYERS_DATAVIEW_INSTANCES, so default-public has no instance to merge into
    dataviewId: FAO_AREAS_DATAVIEW_SLUG,
  },
  rfmo: {
    features: rfmos as OceanAreaFeature[],
    datasetId: 'public-rfmo',
    dataviewInstanceId: RFMO_DATAVIEW_INSTANCE_ID,
  },
} satisfies Record<string, AreaType>

type AreaTypeId = keyof typeof AREA_TYPES

// `nx run ... --args="--type eez,fao"` splits the comma list into positionals before the script
// ever sees it, so positionals are accepted as extra `--type` values.
const { values: opts, positionals: extraTypes } = parseArgs({
  allowPositionals: true,
  options: {
    ...CAPTURE_OPTIONS,
    type: { type: 'string', default: 'eez,fao,rfmo,mpa' },
    heatmaps: { type: 'boolean', default: true },
  },
})

const WIDTH = Number(opts.width)
const HEIGHT = Number(opts.height)
type GeometryWithCoordinates = Exclude<Geometry, { geometries: unknown }>
type AnyPosition = Position | Position[] | Position[][] | Position[][][]

export function getBBox(geometry: Geometry): OceanAreaBBox {
  const bbox: OceanAreaBBox = [180, 90, -180, -90]
  const walk = (coordinates: AnyPosition): void => {
    if (typeof coordinates[0] === 'number') {
      const [longitude, latitude] = coordinates as Position
      bbox[0] = Math.min(bbox[0], longitude)
      bbox[1] = Math.min(bbox[1], latitude)
      bbox[2] = Math.max(bbox[2], longitude)
      bbox[3] = Math.max(bbox[3], latitude)
    } else {
      ;(coordinates as Position[]).forEach(walk)
    }
  }
  walk((geometry as GeometryWithCoordinates).coordinates)
  return bbox
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
    longitude: (minX + maxX) / 2,
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
  { datasetId, dataviewInstanceId, dataviewId }: AreaType,
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
      { id: dataviewInstanceId, ...(dataviewId && { dataviewId }), config: { visible: true } },
      { id: AIS_DATAVIEW_INSTANCE_ID, config: { visible: opts.heatmaps } },
      { id: VMS_DATAVIEW_INSTANCE_ID, config: { visible: opts.heatmaps } },
    ],
  }
  const path = `${PATH_BASENAME}/map/fishing-activity/default-public/report/${datasetId}/${encodeURIComponent(areaId)}`
  return `${BASE_URL}${path}?${stringifyWorkspace(workspace)}`
}

function loadQueue(): CaptureJob[] {
  const types = [...opts.type!.split(','), ...extraTypes]
    .map((type) => type.trim())
    .filter(Boolean) as AreaTypeId[]
  const limit = opts.limit ? Number(opts.limit) : Infinity
  return types.flatMap((type) => {
    const areaType = AREA_TYPES[type]
    if (!areaType) {
      throw new Error(`Unknown area type "${type}". Use one of ${Object.keys(AREA_TYPES)}`)
    }
    return areaType.features.slice(0, limit).map((feature) => {
      const areaId = String(feature.properties.area).replace(/[^\w.-]/g, '_')
      return {
        url: getAreaUrl(areaType, feature),
        file: `${opts.out}/${areaType.datasetId}/${areaId}@2x.webp`,
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
