import { appendFileSync } from 'node:fs'
import type { Page } from 'playwright/test'

import { expect, test } from '../fixtures'
import { waitForHydration } from '../helpers/hydration'
import { waitForMapIdle } from '../helpers/map'
import { MAP_PATH } from '../paths'

// A/B benchmark for the react-redux signals implementation. Opt-in only (PERF_BENCH=1).
// Run it through apps/platform-e2e/scripts/redux-perf.sh, which starts/builds both variants,
// alternates them and prints the medians. One-off run against a server that is already up:
//   PERF_BENCH=1 PERF_LABEL=x PERF_OUT=out.jsonl PLAYWRIGHT_BASE_URL=http://localhost:3000 \
//     pnpm nx test platform-e2e --grep Perf
// Chromium only: it reads Long Tasks, which Firefox and WebKit do not report.

const ITERATIONS = Number(process.env.PERF_ITERATIONS || 5)

test.skip(!process.env.PERF_BENCH, 'PERF_BENCH not set')
test.skip(({ browserName }) => browserName !== 'chromium', 'needs Long Tasks API')
test.use({
  launchOptions: {
    // Real WebGL in headless so deck mounts; the map otherwise stays blank.
    args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--ignore-gpu-blocklist'],
  },
  viewport: { width: 1440, height: 900 },
  // Screencast recording froze the production build's main thread mid-load.
  video: 'off',
})

const SWITCHES = [
  'activity-layer-panel-switch-vms',
  'activity-layer-panel-switch-presence',
  'context-layer-context-layer-eez',
  'events-layer-switch-encounters',
]

// Long tasks and event timings (INP-like) buffered in the page from navigation on.
async function observeMainThread(page: Page) {
  await page.addInitScript(() => {
    const w = window as unknown as { __perf: { longTasks: number[]; events: number[] } }
    w.__perf = { longTasks: [], events: [] }
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) w.__perf.longTasks.push(e.duration)
    }).observe({ type: 'longtask', buffered: true })
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) w.__perf.events.push(e.duration)
    }).observe({ type: 'event', durationThreshold: 16, buffered: true } as PerformanceObserverInit)
  })
}

async function drainMainThread(page: Page) {
  return page.evaluate(() => {
    const w = window as unknown as { __perf: { longTasks: number[]; events: number[] } }
    const out = { ...w.__perf }
    w.__perf = { longTasks: [], events: [] }
    return out
  })
}

const tbt = (longTasks: number[]) => longTasks.reduce((acc, d) => acc + Math.max(0, d - 50), 0)
const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0)
const max = (xs: number[]) => (xs.length ? Math.max(...xs) : 0)

async function interactions(page: Page) {
  const switchLatencies: number[] = []
  for (const id of SWITCHES) {
    for (let i = 0; i < 2; i++) {
      const sw = page.getByTestId(id)
      const before = await sw.getAttribute('aria-checked')
      const t0 = Date.now()
      await sw.click()
      await expect(sw).not.toHaveAttribute('aria-checked', before ?? '')
      switchLatencies.push(Date.now() - t0)
    }
  }

  // Timebar interval buttons change the time range: URL + redux + every time-dependent selector.
  const intervals = page.locator('[class*="_intervalBtn_"]')
  const count = await intervals.count()
  for (let i = 0; i < count; i++) {
    await intervals.nth(i).click()
    await page.waitForTimeout(300)
  }

  // Pan and zoom the map.
  const box = (await page.locator('#map-container').boundingBox())!
  const cx = box.x + box.width / 2
  const cy = box.y + box.height / 2
  for (let i = 0; i < 6; i++) {
    await page.mouse.move(cx, cy)
    await page.mouse.down()
    await page.mouse.move(cx + (i % 2 ? -200 : 200), cy + 60, { steps: 12 })
    await page.mouse.up()
  }
  for (let i = 0; i < 6; i++) {
    await page.mouse.wheel(0, i < 3 ? -300 : 300)
    await page.waitForTimeout(150)
  }
  await page.waitForTimeout(1000)
  return switchLatencies
}

test('Perf - react-redux map benchmark', async ({ page }) => {
  test.setTimeout(ITERATIONS * 4 * 60_000)
  const label = process.env.PERF_LABEL || 'unlabeled'
  await observeMainThread(page)

  // Warm-up: pays the dev server's on-demand compile so iterations measure the app, not Vite.
  await page.goto(MAP_PATH)
  await waitForHydration(page)
  await expect(page.locator('[class*="_withTimebar_"]')).toBeVisible({ timeout: 120_000 })

  for (let i = 0; i < ITERATIONS; i++) {
    const t0 = Date.now()
    await page.goto(MAP_PATH)
    await waitForHydration(page)
    await expect(page.locator('[class*="_withTimebar_"]')).toBeVisible({ timeout: 120_000 })
    const mapReadyMs = Date.now() - t0
    await waitForMapIdle(page, { timeout: 60_000 })
    // Capped: the production build keeps a long-lived request open and never reaches networkidle.
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})
    const load = await drainMainThread(page)

    const switchLatencies = await interactions(page)
    const interact = await drainMainThread(page)

    const row = {
      label,
      iteration: i,
      mapReadyMs,
      loadTbtMs: Math.round(tbt(load.longTasks)),
      interactLongTaskMs: Math.round(sum(interact.longTasks)),
      interactTbtMs: Math.round(tbt(interact.longTasks)),
      interactLongTasks: interact.longTasks.length,
      maxEventMs: Math.round(max(interact.events)),
      switchLatencyMs: Math.round(sum(switchLatencies) / switchLatencies.length),
    }
    console.log(JSON.stringify(row))
    if (process.env.PERF_OUT) appendFileSync(process.env.PERF_OUT, JSON.stringify(row) + '\n')
  }
})
