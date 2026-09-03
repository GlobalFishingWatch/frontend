#!/usr/bin/env node
/**
 * Downloads the Unidata example NetCDF files listed in `unidata/unidata-examples.json` into
 * `unidata/`. ~780MB in total, so the data is gitignored — `netcdf-variables.test.ts` skips its
 * Unidata suite while the files are absent.
 *
 *   node libs/data-transforms/src/files/mock/netcdf/scripts/fetch-unidata-examples.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const TARGET_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '../unidata')
const BASE_URL = 'https://archive.unidata.ucar.edu/software/netcdf/examples/'

const manifest = JSON.parse(fs.readFileSync(path.join(TARGET_DIR, 'unidata-examples.json'), 'utf8'))

for (const { file, bytes } of manifest.files) {
  const target = path.join(TARGET_DIR, file)
  if (fs.existsSync(target) && fs.statSync(target).size === bytes) {
    console.log(`skip ${file}`)
    continue
  }
  console.log(`get  ${file} (${(bytes / 1e6).toFixed(1)}MB)`)
  const response = await fetch(BASE_URL + file)
  if (!response.ok) {
    console.log(`FAILED ${file}: ${response.status}`)
    continue
  }
  fs.writeFileSync(target, new Uint8Array(await response.arrayBuffer()))
}
