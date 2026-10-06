#!/usr/bin/env node
// Regenerates libs/skills/src/encode-url/references/dataset-filters.json from the GFW API:
// the datasets bundled by every activity/detections/events dataview the encoder knows about, and
// the filters each of those datasets supports. The encoder uses it to keep URL filters
// compatible with every dataset of a layer (same rule the app's filter UI applies).
//
// Runs before every `pnpm nx build skills`; without GFW_API_TOKEN it keeps the committed file.
// Run it alone after any dataset/dataview release: GFW_API_TOKEN=<token> pnpm nx sync-dataset-filters skills
// Optional env: API_GATEWAY (default production gateway), PIPE_DATASET_VERSION (default 4).
import { createJiti } from 'jiti'
import { readFileSync, writeFileSync } from 'node:fs'

// Loads the dictionary from source (jiti handles the TS), so this can run before skills:build
const { LAYERS_DICTIONARY } = await createJiti(import.meta.url).import(
  '../src/encode-url/dictionary.ts'
)

const API_GATEWAY = process.env.API_GATEWAY || 'https://gateway.api.globalfishingwatch.org'
const TOKEN = process.env.GFW_API_TOKEN
const OUTPUT = new URL('../src/encode-url/references/dataset-filters.json', import.meta.url)
const CATEGORIES = ['activity', 'detections', 'events']
// 4wings layers declare filters under `fourwings`, event cluster layers under `events`
const FILTER_TYPES = ['fourwings', 'events']
const FILTER_FIELDS = ['id', 'type', 'enabled', 'array', 'enum', 'operation', 'unit']

if (!TOKEN) {
  console.warn('GFW_API_TOKEN not set, keeping the committed dataset-filters.json')
  process.exit(0)
}

const fetchEntries = async (path, ids) => {
  const url = `${API_GATEWAY}/v3/${path}?ids=${ids.map(encodeURIComponent).join(',')}&limit=9999&offset=0&cache=false`
  const response = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } })
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} fetching ${url}`)
  }
  return (await response.json()).entries
}

const pick = (object, keys) =>
  Object.fromEntries(
    keys.filter((key) => object[key] !== undefined).map((key) => [key, object[key]])
  )

const slugs = [
  ...new Set(
    Object.values(LAYERS_DICTIONARY)
      .filter((layer) => CATEGORIES.includes(layer.category) && layer.dataviewId)
      .map((layer) => layer.dataviewId)
  ),
].sort()

const dataviews = Object.fromEntries(
  (await fetchEntries('dataviews', slugs))
    .map((dataview) => {
      // Same fallback as the app's getActiveDatasetsInDataview: config.datasets, else every
      // dataset the dataview requests (event cluster dataviews only declare datasetsConfig)
      const ids = dataview.config?.datasets?.length
        ? dataview.config.datasets
        : (dataview.datasetsConfig || []).map((config) => config.datasetId)
      return [dataview.slug, [...new Set(ids)].sort()]
    })
    .sort(([a], [b]) => a.localeCompare(b))
)
const missing = slugs.filter((slug) => !dataviews[slug])
if (missing.length) {
  console.warn(`Dataviews not returned by the API: ${missing.join(', ')}`)
}

const datasetIds = [...new Set(Object.values(dataviews).flat())]
const datasets = Object.fromEntries(
  (await fetchEntries('datasets', datasetIds))
    .map((dataset) => [
      dataset.id,
      {
        filters: Object.fromEntries(
          FILTER_TYPES.filter((type) => dataset.filters?.[type]?.length).map((type) => [
            type,
            dataset.filters[type]
              .map((filter) => pick(filter, FILTER_FIELDS))
              .sort((a, b) => a.id.localeCompare(b.id)),
          ])
        ),
      },
    ])
    .sort(([a], [b]) => a.localeCompare(b))
)

// Keep the old generatedAt when nothing else changed, so a build doesn't dirty the file
const previous = JSON.parse(readFileSync(OUTPUT, 'utf8'))
const unchanged =
  JSON.stringify({ ...previous, generatedAt: undefined }) ===
  JSON.stringify({ generatedAt: undefined, source: API_GATEWAY, dataviews, datasets })
const generatedAt = unchanged ? previous.generatedAt : new Date().toISOString()
const data = { generatedAt, source: API_GATEWAY, dataviews, datasets }
// One line per primitive array so enums stay greppable next to their filter id
const json = JSON.stringify(data, null, 2).replace(
  /\[\s+([^[\]{}]*?)\s+\]/g,
  (_, items) => `[${items.split(/,\s+/).join(', ')}]`
)
writeFileSync(OUTPUT, `${json}\n`)
console.log(
  `Wrote ${Object.keys(dataviews).length} dataviews, ${Object.keys(datasets).length} datasets`
)
