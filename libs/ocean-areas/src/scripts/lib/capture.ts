/**
 * Browser side shared by `screenshots.ts` (areas) and `screenshots-ports.ts`: drives the real
 * platform map, waits for the tiles to settle and writes one cropped webp per job. Page setup
 * mirrors `apps/platform-e2e` (same popup/hint localStorage seed, same env-driven base URL).
 */
import { existsSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import type { ParseArgsConfig } from 'node:util'
import type { Browser, BrowserContext, Page } from 'playwright/test'
import { chromium } from 'playwright/test'
import sharp from 'sharp'

import { resolveGsUri, uploadFolder } from './storage.ts'

/** Origin only, like `apps/platform-e2e/playwright.config.mts` — the app path is added below. */
export const BASE_URL = new URL(process.env.PLAYWRIGHT_BASE_URL || 'https://globalfishingwatch.org')
  .origin
/** Matches platform `VITE_PUBLIC_URL` / router basename, as in `apps/platform-e2e/src/paths.ts`. */
export const PATH_BASENAME = (process.env.PLAYWRIGHT_PATH_BASENAME || '/platform').replace(
  /\/$/,
  ''
)

/** CLI options every screenshot script accepts; each script spreads its own on top. */
export const CAPTURE_OPTIONS = {
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
  force: { type: 'boolean', default: false },
  selftest: { type: 'boolean', default: false },
} as const satisfies NonNullable<ParseArgsConfig['options']>

export type CaptureSettings = {
  width: number
  height: number
  quality: number
  concurrency: number
  out: string
  force: boolean
  upload?: string
}

export type CaptureJob = { url: string; file: string }

const TIMEOUTS = {
  /** how long the map may keep requesting tiles before we give up and shoot anyway */
  TILES: 90_000,
  /** same, after an in-app navigation; past it the job falls back to a full page load */
  TILES_NAVIGATED: 20_000,
  /** no tile request for this long counts as "the map has finished drawing" */
  TILES_QUIET: 1_000,
  NAVIGATION: 120_000,
  CANVAS: 60_000,
} as const

// The browser viewport is larger than the map canvas: screenshotMode collapses the sidebar to 0 but
// keeps the left rail and the timebar. Starting guess only — each session calibrates it for real
// against the canvas it measures, so a layout change here costs one extra capture, not wrong sizes.
const RAIL_WIDTH = 48
const TIMEBAR_HEIGHT = 176

// Booting the app costs ~3.5s of every ~10s capture, so later jobs in a session navigate inside the
// already-loaded app instead. ponytail: a full reload every N jobs caps whatever state a long-lived
// SPA accumulates (tile caches, report data); lower it if memory grows during long runs.
const RELOAD_EVERY = 100

/** Analytics and error reporting would otherwise log every capture as a real production visit. */
const BLOCKED_URLS =
  /analytics\.google\.com|googletagmanager\.com|google\.com\/ccm|sentry\.io|cdn-cgi\/rum/

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
export async function disableWelcomePopups(context: BrowserContext) {
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
  /** runs `go` and waits for the tiles it triggers */
  settle: (go: () => Promise<unknown>, timeout?: number) => Promise<SettleResult>
  calibrated: boolean
  jobs: number
}

async function createSession(browser: Browser, settings: CaptureSettings): Promise<Session> {
  const context = await browser.newContext({
    viewport: { width: settings.width + RAIL_WIDTH, height: settings.height + TIMEBAR_HEIGHT },
    // Basic auth for the dev/staging deploys, scoped to their origin so API requests stay
    // uncredentialed (same as platform-e2e)
    ...(process.env.BASIC_AUTH_USER && {
      httpCredentials: {
        username: process.env.BASIC_AUTH_USER,
        password: process.env.BASIC_AUTH_PASS || '',
        origin: BASE_URL,
      },
    }),
  })
  await disableWelcomePopups(context)
  await context.route(BLOCKED_URLS, (route) => route.abort())
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

  async function settle(
    go: () => Promise<unknown>,
    timeout: number = TIMEOUTS.TILES
  ): Promise<SettleResult> {
    const start = Date.now()
    tiles.inFlight = 0
    tiles.started = 0
    tiles.satellite = 0
    tiles.lastChange = 0
    await go()
    await page.waitForSelector('#map-container canvas', { timeout: TIMEOUTS.CANVAS })
    while (Date.now() - start < timeout) {
      await page.waitForTimeout(100)
      const quiet = tiles.started > 0 && tiles.inFlight <= 0
      if (quiet && Date.now() - tiles.lastChange > TIMEOUTS.TILES_QUIET && tiles.satellite > 0) {
        return { settled: true, satelliteTiles: tiles.satellite }
      }
    }
    return { settled: false, satelliteTiles: tiles.satellite }
  }

  return { page, context, settle, calibrated: false, jobs: 0 }
}

async function capture(
  session: Session,
  { url, file }: CaptureJob,
  settings: CaptureSettings
): Promise<SettleResult> {
  const { page, settle } = session
  const load = () => page.goto(url, { waitUntil: 'domcontentloaded', timeout: TIMEOUTS.NAVIGATION })
  // TanStack Router follows popstate, so this is an in-app route change: no reload, no re-boot.
  const navigate = () =>
    page.evaluate(
      (path) => {
        window.history.pushState(window.history.state, '', path)
        window.dispatchEvent(new PopStateEvent('popstate', { state: window.history.state }))
      },
      new URL(url).pathname + new URL(url).search
    )
  // Some areas never let the tiles go quiet after an in-app navigation (seen on MPA 166) although a
  // fresh load of the same URL settles, so a slow navigation is retried as a full load.
  let result: SettleResult
  if (session.jobs++ % RELOAD_EVERY === 0) {
    result = await settle(load)
  } else {
    result = await settle(navigate, TIMEOUTS.TILES_NAVIGATED)
    if (!result.settled) result = await settle(load)
  }
  let box = await page.evaluate(hideOverlaysAndMeasure)

  // The chrome around the canvas is measured, not assumed: pad the viewport by whatever it turned
  // out to be and take this one area again. Later areas in the session are already right.
  if (!session.calibrated) {
    session.calibrated = true
    const dx = Math.round(settings.width - box.width)
    const dy = Math.round(settings.height - box.height)
    if (dx !== 0 || dy !== 0) {
      const { width, height } = page.viewportSize()!
      await page.setViewportSize({ width: width + dx, height: height + dy })
      result = await settle(load)
      box = await page.evaluate(hideOverlaysAndMeasure)
    }
  }

  // A shot with no satellite response behind it is the default blue basemap, not a map of the area.
  // One reload usually fixes it; a second failure is reported rather than silently written.
  if (result.satelliteTiles === 0) {
    result = await settle(load)
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
    .webp({ quality: settings.quality })
    .toFile(file)
  return result
}

export async function captureAll(jobs: CaptureJob[], settings: CaptureSettings): Promise<void> {
  // Resolve the destination before rendering anything: a missing GOOGLE_BUCKET_ID should not
  // surface only after a run that can take hours.
  if (settings.upload) {
    console.log(`Will upload to ${resolveGsUri(settings.upload)} when done`)
  }

  const queue = jobs.filter(({ file }) => settings.force || !existsSync(file))
  console.log(`${queue.length}/${jobs.length} screenshots to render into ${settings.out}`)
  new Set(queue.map(({ file }) => dirname(file))).forEach((dir) =>
    mkdirSync(dir, { recursive: true })
  )

  const browser = await chromium.launch()
  let next = 0
  let done = 0
  const noSatellite: string[] = []
  const workers = Array.from({ length: settings.concurrency }, async () => {
    const session = await createSession(browser, settings)
    while (next < queue.length) {
      const job = queue[next++]
      const started = Date.now()
      try {
        const { settled, satelliteTiles } = await capture(session, job, settings)
        let warning = ''
        if (satelliteTiles === 0) {
          noSatellite.push(job.file)
          warning = ' — NO SATELLITE TILES, image shows the default basemap'
        } else if (!settled) {
          warning = ' (timed out waiting for tiles)'
        }
        console.log(`[${++done}/${queue.length}] ${job.file} ${Date.now() - started}ms${warning}`)
      } catch (error) {
        console.error(`[${++done}/${queue.length}] ${job.file} FAILED: ${(error as Error).message}`)
      }
    }
    await session.context.close()
  })
  await Promise.all(workers)
  await browser.close()

  if (settings.upload) {
    await uploadFolder(settings.out, settings.upload)
  }

  if (noSatellite.length) {
    console.error(
      `\n${noSatellite.length}/${queue.length} images have no satellite basemap. Re-run them with --force:`
    )
    noSatellite.forEach((file) => console.error(`  ${file}`))
    process.exitCode = 1
  }
}
