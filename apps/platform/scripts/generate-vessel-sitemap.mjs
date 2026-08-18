/**
 * Generates the vessel sitemap set from a GFW presence-hours CSV export.
 *
 *   node apps/platform/scripts/generate-vessel-sitemap.mjs <export.csv>
 *
 * Writes public/sitemap.xml (index) + public/sitemaps/vessels-N.xml.gz.
 * Gzipped because 258k <loc> entries are ~28MB raw; sitemaps.org and Google both
 * accept .xml.gz, and static files need no route or runtime API call.
 *
 * Vessels are sorted by presence hours descending, so vessels-0 holds the
 * highest-activity vessels — submit that shard alone to test crawl response
 * before opening the whole set.
 */
import { Buffer } from 'node:buffer'
import { createReadStream } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createInterface } from 'node:readline'
import { fileURLToPath } from 'node:url'
import { gzipSync } from 'node:zlib'

const ORIGIN = process.env.SITEMAP_ORIGIN ?? 'https://globalfishingwatch.org'
const BASENAME = process.env.SITEMAP_BASENAME ?? '/platform'
const URLS_PER_SITEMAP = 50000 // protocol hard limit

// GFW vessel/gear types that carry no identity worth a landing page.
const EXCLUDED_VESSEL_TYPES = new Set(['Otro', 'Na', 'Desconocido'])
const EXCLUDED_GEAR_TYPES = new Set(['Otro'])

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = path.join(appRoot, 'public')
const sitemapDir = path.join(publicDir, 'sitemaps')

/** Minimal RFC4180 splitter — the export quotes fields containing commas. */
function splitCsvLine(line) {
  const out = []
  let field = ''
  let quoted = false
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (quoted) {
      if (char === '"') {
        if (line[i + 1] === '"') {
          field += '"'
          i++
        } else quoted = false
      } else field += char
    } else if (char === '"') quoted = true
    else if (char === ',') {
      out.push(field)
      field = ''
    } else field += char
  }
  out.push(field)
  return out
}

const csvPath = process.argv[2]
if (!csvPath) {
  console.error('Usage: node generate-vessel-sitemap.mjs <export.csv>')
  process.exit(1)
}

const rl = createInterface({
  input: createReadStream(csvPath),
  crlfDelay: Number.POSITIVE_INFINITY,
})

let header = null
let columns = {}
let total = 0
const excluded = { vesselType: 0, gearType: 0, noId: 0, duplicate: 0 }
const seen = new Set()
const kept = []

for await (const line of rl) {
  if (!line.trim()) continue
  const cells = splitCsvLine(line)
  if (!header) {
    header = cells
    columns = {
      vesselType: header.indexOf('GFW vessel type'),
      gearType: header.indexOf('GFW gear type'),
      hours: header.indexOf('Total presence hours'),
      vesselId: header.indexOf('vesselId'),
    }
    for (const [name, index] of Object.entries(columns)) {
      if (index === -1) throw new Error(`CSV is missing the ${name} column`)
    }
    continue
  }
  total++
  if (EXCLUDED_VESSEL_TYPES.has(cells[columns.vesselType]?.trim())) {
    excluded.vesselType++
    continue
  }
  if (EXCLUDED_GEAR_TYPES.has(cells[columns.gearType]?.trim())) {
    excluded.gearType++
    continue
  }
  const vesselId = cells[columns.vesselId]?.trim()
  if (!vesselId) {
    excluded.noId++
    continue
  }
  if (seen.has(vesselId)) {
    excluded.duplicate++
    continue
  }
  seen.add(vesselId)
  kept.push([vesselId, Number(cells[columns.hours]) || 0])
}

kept.sort((a, b) => b[1] - a[1])

const xmlEscape = (value) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;')
const shardName = (index) => `vessels-${index}.xml.gz`

await mkdir(sitemapDir, { recursive: true })

const shards = []
for (let start = 0; start < kept.length; start += URLS_PER_SITEMAP) {
  const slice = kept.slice(start, start + URLS_PER_SITEMAP)
  const body = slice
    .map(([id]) => `  <url><loc>${xmlEscape(`${ORIGIN}${BASENAME}/vessel/${id}`)}</loc></url>`)
    .join('\n')
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`
  const name = shardName(shards.length)
  const gz = gzipSync(Buffer.from(xml, 'utf8'), { level: 9 })
  await writeFile(path.join(sitemapDir, name), gz)
  shards.push({ name, urls: slice.length, raw: Buffer.byteLength(xml), gz: gz.length })
}

const index = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${shards
  .map(({ name }) => `  <sitemap><loc>${ORIGIN}${BASENAME}/sitemaps/${name}</loc></sitemap>`)
  .join('\n')}
</sitemapindex>
`
await writeFile(path.join(publicDir, 'sitemap.xml'), index, 'utf8')

const mb = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)}MB`
console.log(`rows read          ${total}`)
console.log(`excluded vesselType ${excluded.vesselType} (${[...EXCLUDED_VESSEL_TYPES].join(', ')})`)
console.log(`excluded gearType   ${excluded.gearType} (${[...EXCLUDED_GEAR_TYPES].join(', ')})`)
console.log(`excluded no id      ${excluded.noId}`)
console.log(`excluded duplicate  ${excluded.duplicate}`)
console.log(`urls written        ${kept.length} across ${shards.length} shards`)
console.log(
  `size                ${mb(shards.reduce((n, s) => n + s.raw, 0))} raw -> ${mb(
    shards.reduce((n, s) => n + s.gz, 0)
  )} gzipped`
)
