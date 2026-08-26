/**
 * Renders one map screenshot per ocean area and saves it as <out>/<datasetId>/<areaId>@2x.webp
 *
 * Drives the real platform map (report route) rather than a bespoke renderer: the report route is
 * what draws the area highlight, and tile fetching dominates the per-area cost anyway. Page setup
 * mirrors `apps/platform-e2e` (same popup/hint localStorage seed, same env-driven base URL).
 *
 *   pnpm nx run ocean-areas:screenshots --args="--type eez --limit 5"
 *   pnpm nx run ocean-areas:screenshots --args="--type mpa --concurrency 6"
 *   pnpm nx run ocean-areas:screenshots --args="--type eez --upload gs://my-bucket/area-screenshots"
 *
 * Always through the nx target: it installs the ts-node hooks and builds the dataviews-client dist
 * this imports. Plain `node screenshots.ts` cannot resolve the workspace libs.
 */
import type { Feature, Geometry, Position } from 'geojson'
import { existsSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { parseArgs } from 'node:util'
import type { Browser, BrowserContext, Page } from 'playwright/test'
import { chromium } from 'playwright/test'
import sharp from 'sharp'

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
  MPA_DATAVIEW_INSTANCE_ID,
  RFMO_DATAVIEW_INSTANCE_ID,
  VMS_DATAVIEW_INSTANCE_ID,
} from '@platform/config/map/dataviews'

import eezs from '../data/eezs.json' with { type: 'json' }
import fao from '../data/fao.json' with { type: 'json' }
import mpas from '../data/mpas.json' with { type: 'json' }
import rfmos from '../data/rfmos.json' with { type: 'json' }
import type { OceanAreaBBox, OceanAreaProperties } from '../ocean-areas'

import { resolveGsUri, uploadFolder } from './lib/storage.ts'

/** Origin only, like `apps/platform-e2e/playwright.config.mts` — the app path is added below. */
const BASE_URL = new URL(process.env.PLAYWRIGHT_BASE_URL || 'https://globalfishingwatch.org').origin
/** Matches platform `VITE_PUBLIC_URL` / router basename, as in `apps/platform-e2e/src/paths.ts`. */
const PATH_BASENAME = (process.env.PLAYWRIGHT_PATH_BASENAME || '/platform').replace(/\/$/, '')

const TIMEOUTS = {
  /** how long the map may keep requesting tiles before we give up and shoot anyway */
  TILES: 90_000,
  /** no tile request for this long counts as "the map has finished drawing" */
  TILES_QUIET: 2_500,
  NAVIGATION: 120_000,
  CANVAS: 60_000,
} as const

type OceanAreaFeature = Feature<Geometry, OceanAreaProperties>

type AreaType = {
  features: OceanAreaFeature[]
  /** dataset the report route resolves the area against */
  datasetId: string
  /** context layer that must be visible for the highlight to draw */
  dataviewInstanceId: string
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
    type: { type: 'string', default: 'eez,fao,rfmo,mpa' },
    out: { type: 'string', default: '.screenshots' },
    width: { type: 'string', default: '500' },
    height: { type: 'string', default: '400' },
    limit: { type: 'string' },
    concurrency: { type: 'string', default: '1' },
    quality: { type: 'string', default: '50' },
    /**
     * Mirror `--out` into a bucket once the run finishes. Either a full `gs://bucket/prefix` or a
     * path relative to `GOOGLE_BUCKET_ID`. Omit to stay local.
     */
    upload: { type: 'string' },
    heatmaps: { type: 'boolean', default: true },
    force: { type: 'boolean', default: false },
    selftest: { type: 'boolean', default: false },
  },
})

const WIDTH = Number(opts.width)
const HEIGHT = Number(opts.height)
// The browser viewport is larger than the map canvas: screenshotMode collapses the sidebar to 0 but
// keeps the left rail and the timebar. Starting guess only — each session calibrates it for real
// against the canvas it measures, so a layout change here costs one extra capture, not wrong sizes.
const RAIL_WIDTH = 48
const TIMEBAR_HEIGHT = 176

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
  dataviewInstances: { id: string; config: Record<string, unknown> }[]
}

export function getAreaUrl(
  { datasetId, dataviewInstanceId }: AreaType,
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
      { id: dataviewInstanceId, config: { visible: true } },
      { id: AIS_DATAVIEW_INSTANCE_ID, config: { visible: opts.heatmaps } },
      { id: VMS_DATAVIEW_INSTANCE_ID, config: { visible: opts.heatmaps } },
    ],
  }
  const path = `${PATH_BASENAME}/map/fishing-activity/default-public/report/${datasetId}/${encodeURIComponent(areaId)}`
  return `${BASE_URL}${path}?${stringifyWorkspace(workspace)}`
}

type CanvasBox = { x: number; y: number; width: number; height: number }

/** Runs in the page: drops every map overlay and reports where the deck canvas ended up. */
const hideOverlaysAndMeasure = (): CanvasBox => {
  document
    .querySelectorAll<HTMLElement>('a[href="https://globalfishingwatch.org"]')
    .forEach((logo) => logo.style.setProperty('display', 'none', 'important'))
  const container = document.getElementById('map-container') as HTMLElement
  container.querySelectorAll<HTMLElement>(':scope > *').forEach((child) => {
    if (child.tagName !== 'CANVAS' && !child.querySelector('canvas')) {
      child.style.setProperty('display', 'none', 'important')
    }
  })
  const { x, y, width, height } = container.querySelector('canvas')!.getBoundingClientRect()
  return { x, y, width, height }
}

/** Same seed as `apps/platform-e2e/src/helpers/modals.ts`, so both start from the same app state. */
async function disableWelcomePopups(context: BrowserContext) {
  await context.addInitScript(() => {
    const hidden = JSON.stringify({ visible: false, showAgain: false })
    const hints = JSON.stringify({
      fishingEffortHeatmap: true,
      filterActivityLayers: true,
      clickingOnAGridCellToShowVessels: true,
      changingTheTimeRange: true,
      areaSearch: true,
      periodComparisonBaseline: true,
      userContextLayers: true,
    })
    window.localStorage.setItem('WelcomePopup', hidden)
    window.localStorage.setItem('VesselProfilePopup', hidden)
    window.localStorage.setItem('MarineManagerPopup', hidden)
    window.localStorage.setItem('DeepSeaMiningPopup', hidden)
    window.localStorage.setItem('HighlightPopup', '"sentinel2"')
    window.localStorage.setItem('i18nextLng', '"en"')
    window.localStorage.setItem('hints', hints)
  })
}

/**
 * Every request the map makes to draw itself. `BasemapLayer` serves satellite from two sources —
 * a pmtiles archive (range requests) up to zoom 8, a raster tileset above it — and both have to be
 * in here or the wait can end before the basemap has even asked for its tiles.
 */
const TILE_URL_PATTERNS = ['4wings/tile', 'context-layers', '.pmtiles', '/tileset/']
const SATELLITE_URL_PATTERNS = ['satellite.pmtiles', '/tileset/sat']

const matches = (url: string, patterns: string[]) => patterns.some((p) => url.includes(p))

type SettleResult = { settled: boolean; satelliteTiles: number }

type Session = {
  page: Page
  context: BrowserContext
  settle: () => Promise<SettleResult>
  calibrated: boolean
}

async function createSession(browser: Browser): Promise<Session> {
  const context = await browser.newContext({
    viewport: { width: WIDTH + RAIL_WIDTH, height: HEIGHT + TIMEBAR_HEIGHT },
  })
  await disableWelcomePopups(context)
  const page = await context.newPage()

  // Waiting on "nothing in flight" rather than "nothing started recently": the satellite layers
  // debounce their requests by 800ms and only start once the viewport settles, so a purely
  // time-since-last-request check can fire while the basemap is still fetching.
  const tiles = { inFlight: 0, started: 0, satellite: 0, lastChange: 0 }
  const tileRequests = new WeakSet<object>()
  page.on('request', (request) => {
    if (!matches(request.url(), TILE_URL_PATTERNS)) return
    tileRequests.add(request)
    tiles.inFlight++
    tiles.started++
    tiles.lastChange = Date.now()
  })
  const settleRequest = (request: object) => {
    if (!tileRequests.has(request)) return
    tiles.inFlight--
    tiles.lastChange = Date.now()
  }
  page.on('requestfinished', settleRequest)
  page.on('requestfailed', settleRequest)
  page.on('response', (response) => {
    if (response.ok() && matches(response.url(), SATELLITE_URL_PATTERNS)) tiles.satellite++
  })

  async function settle(): Promise<SettleResult> {
    const start = Date.now()
    tiles.inFlight = 0
    tiles.started = 0
    tiles.satellite = 0
    tiles.lastChange = 0
    await page.waitForSelector('#map-container canvas', { timeout: TIMEOUTS.CANVAS })
    while (Date.now() - start < TIMEOUTS.TILES) {
      await page.waitForTimeout(250)
      const quiet = tiles.started > 0 && tiles.inFlight <= 0
      if (quiet && Date.now() - tiles.lastChange > TIMEOUTS.TILES_QUIET && tiles.satellite > 0) {
        return { settled: true, satelliteTiles: tiles.satellite }
      }
    }
    return { settled: false, satelliteTiles: tiles.satellite }
  }

  return { page, context, settle, calibrated: false }
}

async function capture(session: Session, url: string, file: string): Promise<SettleResult> {
  const { page, settle } = session
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: TIMEOUTS.NAVIGATION })
  let result = await settle()
  let box = await page.evaluate(hideOverlaysAndMeasure)

  // The chrome around the canvas is measured, not assumed: pad the viewport by whatever it turned
  // out to be and take this one area again. Later areas in the session are already right.
  if (!session.calibrated) {
    session.calibrated = true
    const dx = Math.round(WIDTH - box.width)
    const dy = Math.round(HEIGHT - box.height)
    if (dx !== 0 || dy !== 0) {
      const { width, height } = page.viewportSize()!
      await page.setViewportSize({ width: width + dx, height: height + dy })
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: TIMEOUTS.NAVIGATION })
      result = await settle()
      box = await page.evaluate(hideOverlaysAndMeasure)
    }
  }

  // A shot with no satellite response behind it is the default blue basemap, not a map of the area.
  // One reload usually fixes it; a second failure is reported rather than silently written.
  if (result.satelliteTiles === 0) {
    await page.reload({ waitUntil: 'domcontentloaded', timeout: TIMEOUTS.NAVIGATION })
    result = await settle()
    box = await page.evaluate(hideOverlaysAndMeasure)
  }

  // A clipped or element-scoped screenshot hangs on "waiting for element to be stable" — deck never
  // stops animating. Full-viewport capture plus a crop is the only reliable path.
  const image = await page.screenshot()
  await sharp(image)
    .extract({
      left: Math.round(box.x),
      top: Math.round(box.y),
      width: Math.round(box.width),
      height: Math.round(box.height),
    })
    .webp({ quality: Number(opts.quality) })
    .toFile(file)
  return result
}

type QueuedArea = { areaType: AreaType; feature: OceanAreaFeature; file: string }

function loadQueue(): { queue: QueuedArea[]; total: number } {
  const types = [...opts.type!.split(','), ...extraTypes]
    .map((type) => type.trim())
    .filter(Boolean) as AreaTypeId[]
  const limit = opts.limit ? Number(opts.limit) : Infinity
  const areas = types.flatMap((type) => {
    const areaType = AREA_TYPES[type]
    if (!areaType) {
      throw new Error(`Unknown area type "${type}". Use one of ${Object.keys(AREA_TYPES)}`)
    }
    return areaType.features.slice(0, limit).map((feature) => {
      const areaId = String(feature.properties.area).replace(/[^\w.-]/g, '_')
      return { areaType, feature, file: `${opts.out}/${areaType.datasetId}/${areaId}@2x.webp` }
    })
  })
  return { queue: areas.filter(({ file }) => opts.force || !existsSync(file)), total: areas.length }
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

async function run(): Promise<void> {
  // Resolve the destination before rendering anything: a missing GOOGLE_BUCKET_ID should not
  // surface only after a run that can take hours.
  if (opts.upload) {
    console.log(`Will upload to ${resolveGsUri(opts.upload)} when done`)
  }

  const { queue, total } = loadQueue()
  console.log(`${queue.length}/${total} areas to render into ${opts.out}`)
  new Set(queue.map(({ file }) => dirname(file))).forEach((dir) =>
    mkdirSync(dir, { recursive: true })
  )

  const browser = await chromium.launch()
  let next = 0
  let done = 0
  const noSatellite: string[] = []
  const workers = Array.from({ length: Number(opts.concurrency) }, async () => {
    const session = await createSession(browser)
    while (next < queue.length) {
      const { areaType, feature, file } = queue[next++]
      const started = Date.now()
      try {
        const { settled, satelliteTiles } = await capture(
          session,
          getAreaUrl(areaType, feature),
          file
        )
        let warning = ''
        if (satelliteTiles === 0) {
          noSatellite.push(file)
          warning = ' — NO SATELLITE TILES, image shows the default basemap'
        } else if (!settled) {
          warning = ' (timed out waiting for tiles)'
        }
        console.log(`[${++done}/${queue.length}] ${file} ${Date.now() - started}ms${warning}`)
      } catch (error) {
        console.error(`[${++done}/${queue.length}] ${file} FAILED: ${(error as Error).message}`)
      }
    }
    await session.context.close()
  })
  await Promise.all(workers)
  await browser.close()

  if (opts.upload) {
    await uploadFolder(opts.out!, opts.upload)
  }

  if (noSatellite.length) {
    console.error(
      `\n${noSatellite.length}/${queue.length} images have no satellite basemap. Re-run them with --force:`
    )
    noSatellite.forEach((file) => console.error(`  ${file}`))
    process.exitCode = 1
  }
}

if (opts.selftest) {
  selftest()
} else {
  await run()
}
