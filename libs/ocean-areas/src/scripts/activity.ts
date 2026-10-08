/**
 * Reads the activity hours of every ocean area from its report summary on the real platform map and
 * saves them as src/data/activity.json, which `searchOceanAreas` uses to sort by activity.
 *
 * Same report URLs as `screenshots.ts`, but with the sidebar open (no screenshotMode) and a fixed
 * time range, so values are comparable between areas and between runs.
 *
 *   pnpm nx run ocean-areas:activity --args="--type eez --limit 5"
 *   pnpm nx run ocean-areas:activity --args="--type eez,fao,rfmo --concurrency 4"
 *   pnpm nx run ocean-areas:activity --args="--start 2025-01-01 --end 2026-01-01 --force"
 *   pnpm nx run ocean-areas:activity --args="--type rfmo --timeout 600"
 *   pnpm nx run ocean-areas:activity --args="--type port --concurrency 10"   # API, no browser
 *
 * Resumable: areas already in the file are skipped unless --force. Areas whose summary never shows
 * hours are reported and left out (they sort last), not stored as 0.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { parseArgs } from 'node:util'
import type { BrowserContext, Page } from 'playwright/test'
import { chromium } from 'playwright/test'

import type { BaseUrlWorkspace } from '@globalfishingwatch/dataviews-client/url-workspace'
import { stringifyWorkspace } from '@globalfishingwatch/dataviews-client/url-workspace'

import ports from '../data/ports.json' with { type: 'json' }

import type { AreaType, AreaTypeId, OceanAreaFeature } from './lib/area-types.ts'
import { AREA_TYPES } from './lib/area-types.ts'
import { BASE_URL, disableWelcomePopups, PATH_BASENAME } from './lib/capture.ts'

const OUTPUT_PATH = 'src/data/activity.json'
const SAVE_EVERY = 10

export type ActivityFile = {
  /** Time range the values cover */
  start: string
  end: string
  generatedAt: string
  /** Activity hours by area type and area id (`properties.area`) */
  hours: Partial<Record<AreaTypeId, Record<string, number>>>
  /** Port visits by port id (`properties.area`) */
  visits?: Record<string, number>
}

type ActivityType = AreaTypeId | 'port'

const { values: opts, positionals: extraTypes } = parseArgs({
  allowPositionals: true,
  options: {
    // MPAs are ~17k reports: run them separately, with a high --concurrency
    type: { type: 'string', default: 'eez,fao,rfmo' },
    start: { type: 'string', default: '2025-01-01' },
    end: { type: 'string', default: '2026-01-01' },
    concurrency: { type: 'string', default: '2' },
    // seconds; the largest areas (ocean-wide RFMOs) take minutes when reports run in parallel
    timeout: { type: 'string', default: '300' },
    // ports only: events stats API
    api: { type: 'string', default: 'https://gateway.api.dev.globalfishingwatch.org' },
    limit: { type: 'string' },
    force: { type: 'boolean', default: false },
    selftest: { type: 'boolean', default: false },
  },
})

const toISO = (date: string) => new Date(date).toISOString()
const SUMMARY_TIMEOUT = Number(opts.timeout) * 1000
const PORT_VISITS_DATASET = 'public-global-port-visits-events:v5.0'

/** "75,908 hours ± 5% of activity…" / "…had 75,908 hours of activity…" → 75908 */
export function parseHours(summary: string): number | undefined {
  const match = summary.match(/(\d[\d,]*(?:\.\d+)?)\s*hours?\b/i)
  return match ? Number(match[1].replace(/,/g, '')) : undefined
}

export function getActivityUrl(
  { datasetId, dataviewInstance }: AreaType,
  feature: OceanAreaFeature,
  { start, end }: { start: string; end: string }
): string {
  const areaId = String(feature.properties.area)
  const workspace: BaseUrlWorkspace & {
    reportLoadVessels: boolean
    dataviewInstances: { id: string; dataviewId?: string; config: Record<string, unknown> }[]
  } = {
    start,
    end,
    // only the summary is needed, not the vessels table
    reportLoadVessels: false,
    dataviewInstances: [dataviewInstance],
  }
  const path = `${PATH_BASENAME}/map/fishing-activity/default-public/report/${datasetId}/${encodeURIComponent(areaId)}`
  return `${BASE_URL}${path}?${stringifyWorkspace(workspace)}`
}

/** Port visits straight from the API: what the port report's summary shows, without rendering it */
export function getPortVisitsUrl(portId: string, { start, end }: { start: string; end: string }) {
  const params = new URLSearchParams({
    'start-date': start,
    'end-date': end,
    'time-filter-mode': 'START-DATE',
    'confidences[0]': '4',
    'port-ids[0]': portId,
    'datasets[0]': PORT_VISITS_DATASET,
    'includes[0]': 'TOTAL_COUNT',
    'timeseries-interval': 'YEAR',
  })
  return `${opts.api}/v3/events/stats?${params}`
}

async function fetchPortVisits(portId: string, range: { start: string; end: string }) {
  const response = await fetch(getPortVisitsUrl(portId, range), {
    signal: AbortSignal.timeout(SUMMARY_TIMEOUT),
  })
  if (!response.ok) throw new Error(`${response.status} ${await response.text()}`)
  const { numEvents } = (await response.json()) as { numEvents?: number }
  return numEvents
}

/** Opens the report and waits past the loading placeholder until `parse` finds the number */
async function readSummary(
  page: Page,
  url: string,
  parse: (summary: string) => number | undefined
): Promise<number | undefined> {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: SUMMARY_TIMEOUT })
  const summary = page.locator('[data-testid="report-summary"]')
  const deadline = Date.now() + SUMMARY_TIMEOUT
  while (Date.now() < deadline) {
    const value = parse((await summary.textContent().catch(() => null)) ?? '')
    if (value !== undefined) return value
    await page.waitForTimeout(1000)
  }
  throw new Error(`no value in the summary after ${SUMMARY_TIMEOUT / 1000}s`)
}

function loadOutput(range: { start: string; end: string }): ActivityFile {
  const empty: ActivityFile = { ...range, generatedAt: new Date().toISOString(), hours: {} }
  if (!existsSync(OUTPUT_PATH)) return empty
  const existing = JSON.parse(readFileSync(OUTPUT_PATH, 'utf8')) as ActivityFile
  if (existing.start === range.start && existing.end === range.end) return existing
  if (!opts.force) {
    throw new Error(
      `${OUTPUT_PATH} covers ${existing.start} – ${existing.end}, not ${range.start} – ${range.end}. ` +
        'Pass --force to replace it.'
    )
  }
  return empty
}

function save(output: ActivityFile) {
  output.generatedAt = new Date().toISOString()
  writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2) + '\n')
}

async function run() {
  const range = { start: toISO(opts.start!), end: toISO(opts.end!) }
  const output = loadOutput(range)
  const types = [...opts.type!.split(','), ...extraTypes]
    .map((type) => type.trim())
    .filter(Boolean) as ActivityType[]
  const limit = opts.limit ? Number(opts.limit) : Infinity

  // Areas store hours, ports store visits; each job knows its URL, parser and where its value goes
  const queue = types.flatMap((type) => {
    if (type === 'port') {
      return (ports as OceanAreaFeature[])
        .slice(0, limit)
        .map((feature) => {
          const id = String(feature.properties.area)
          return {
            label: `port ${id} ${feature.properties.name}`,
            needsBrowser: false,
            read: () => fetchPortVisits(id, range),
            unit: 'visits',
            done: output.visits?.[id] !== undefined,
            store: (value: number) => (output.visits = { ...output.visits, [id]: value }),
          }
        })
        .filter(({ done }) => opts.force || !done)
    }
    const areaType = AREA_TYPES[type]
    if (!areaType) {
      throw new Error(`Unknown type "${type}". Use one of ${[...Object.keys(AREA_TYPES), 'port']}`)
    }
    return areaType.features
      .slice(0, limit)
      .map((feature) => {
        const id = String(feature.properties.area)
        return {
          label: `${type} ${id} ${feature.properties.name}`,
          needsBrowser: true,
          read: (page?: Page) =>
            readSummary(page!, getActivityUrl(areaType, feature, range), parseHours),
          unit: 'h',
          done: output.hours[type]?.[id] !== undefined,
          store: (value: number) => (output.hours[type] = { ...output.hours[type], [id]: value }),
        }
      })
      .filter(({ done }) => opts.force || !done)
  })
  console.log(`${queue.length} values to read (${range.start} – ${range.end})`)

  // Only area reports are rendered; a ports-only run never starts a browser
  const browser = queue.some(({ needsBrowser }) => needsBrowser)
    ? await chromium.launch()
    : undefined
  type Job = (typeof queue)[number]
  let done = 0

  /** Reads `jobs` with `concurrency` pages in parallel; returns the ones that failed */
  const readAll = async (jobs: Job[], concurrency: number): Promise<Job[]> => {
    let next = 0
    const failed: Job[] = []
    const workers = Array.from({ length: concurrency }, async () => {
      let context: BrowserContext | undefined
      let page: Page | undefined
      while (next < jobs.length) {
        const job = jobs[next++]
        const started = Date.now()
        try {
          if (job.needsBrowser && !page) {
            context = await browser!.newContext({ viewport: { width: 1600, height: 900 } })
            await disableWelcomePopups(context)
            page = await context.newPage()
          }
          const value = await job.read(page)
          if (value === undefined) throw new Error('no value returned')
          job.store(value)
          console.log(`[${++done}] ${job.label}: ${value} ${job.unit} (${Date.now() - started}ms)`)
          if (done % SAVE_EVERY === 0) save(output)
        } catch (error) {
          failed.push(job)
          console.error(`[${job.label}] FAILED: ${(error as Error).message}`)
        }
      }
      await context?.close()
    })
    await Promise.all(workers)
    return failed
  }

  let failed = await readAll(queue, Number(opts.concurrency))
  // Most failures are timeouts from big areas competing for the API: once more, one at a time
  if (failed.length) {
    console.log(`Retrying ${failed.length} failed reports one at a time`)
    failed = await readAll(failed, 1)
  }
  await browser?.close()
  save(output)
  const failedIds = failed.map(({ label }) => label).join(', ')
  console.log(
    `Saved ${OUTPUT_PATH}${failed.length ? ` — ${failed.length} failed: ${failedIds}` : ''}`
  )
}

function selftest(): void {
  console.assert(parseHours('75,908 hours ± 5% of activity in the area') === 75908, 'guest summary')
  console.assert(parseHours('1,234 vessels had 75,908 hours of activity') === 75908, 'full summary')
  console.assert(parseHours('12.5 hours of activity') === 12.5, 'decimals')
  console.assert(parseHours('1 hour of activity') === 1, 'singular')
  console.assert(parseHours('No activity') === undefined, 'no hours')
  const portUrl = getPortVisitsUrl('esp-coruna', {
    start: '2025-01-01T00:00:00.000Z',
    end: '2026-01-01T00:00:00.000Z',
  })
  console.assert(portUrl.includes('/v3/events/stats?'), 'stats endpoint', portUrl)
  console.assert(portUrl.includes('port-ids%5B0%5D=esp-coruna'), 'port id param', portUrl)
  const url = getActivityUrl(
    AREA_TYPES.fao,
    {
      type: 'Feature',
      properties: { type: 'fao', name: 'Test', area: '27' },
      geometry: null as never,
    },
    { start: '2025-01-01T00:00:00.000Z', end: '2026-01-01T00:00:00.000Z' }
  )
  console.assert(url.includes('/report/public-fao-major/27'), 'report path', url)
  console.assert(!url.includes('screenshotMode'), 'sidebar visible', url)
  console.log('selftest ok')
}

if (opts.selftest) {
  selftest()
} else {
  await run()
}
