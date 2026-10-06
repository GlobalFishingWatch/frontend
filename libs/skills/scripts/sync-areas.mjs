#!/usr/bin/env node
// Regenerates libs/skills/src/encode-url/references/areas/{eez,fao,rfmo,mpa}.json from the
// ocean-areas lib, so the skill and the app's area search share one source.
// One area per line so a grep by name returns datasetId + areaId + label + bbox together.
// bbox is [minLon, minLat, maxLon, maxLat]: it tells repeated names apart (e.g. 60 MPAs contain
// "Mangrove") and frames the viewport. Accented labels also carry an ASCII form so "Galapagos"
// matches "Galápagos".
//
// Run after libs/ocean-areas/src/data changes: pnpm nx sync-areas skills
import { bbox } from '@turf/turf'
import { readFileSync, writeFileSync } from 'node:fs'

const SOURCE_DIR = new URL('../../ocean-areas/src/data/', import.meta.url)
const OUTPUT_DIR = new URL('../src/encode-url/references/areas/', import.meta.url)

// "Pacific, Southwest" -> "Southwest Pacific", so a grep matches either word order
const reverseFaoName = (name) => name.split(', ').reverse().join(' ')

const AREAS = [
  { output: 'eez', source: 'eezs', datasetId: 'public-eez-areas', label: (p) => `${p.name} EEZ` },
  {
    output: 'fao',
    source: 'fao',
    datasetId: 'public-fao-major',
    label: (p) => {
      const reversed = reverseFaoName(p.name)
      return `FAO ${p.area} ${p.name}${reversed === p.name ? '' : ` (${reversed})`}`
    },
  },
  { output: 'rfmo', source: 'rfmos', datasetId: 'public-rfmo', label: (p) => p.name },
  { output: 'mpa', source: 'mpas', datasetId: 'public-mpa-all', label: (p) => p.name },
]

const round = (n) => Math.round(n * 100) / 100
const toAscii = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '')

for (const { output, source, datasetId, label } of AREAS) {
  const features = JSON.parse(readFileSync(new URL(`${source}.json`, SOURCE_DIR), 'utf8'))
  const lines = features.map((feature) => {
    const { properties } = feature
    const text = label(properties)
    const ascii = toAscii(text)
    return JSON.stringify({
      datasetId,
      areaId: String(properties.area),
      label: ascii === text ? text : `${text} (${ascii})`,
      bbox: bbox(feature).map(round),
    })
  })
  writeFileSync(new URL(`${output}.json`, OUTPUT_DIR), `[\n${lines.join(',\n')}\n]\n`)
  console.log(`Wrote ${lines.length} areas to areas/${output}.json`)
}
