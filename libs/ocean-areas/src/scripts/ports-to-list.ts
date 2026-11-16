import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

import { getPortSources, type PortSource } from './lib/port-sources.ts'

type PortFeature = {
  type: 'Feature'
  properties: {
    type: 'port'
    area: string
    name: string
    flag: string
  }
  geometry: {
    type: 'Point'
    coordinates: [number, number]
  }
}
type PortListData = {
  id: string
  name: string
  flag: string
  sources: PortSource[]
}
type PortSourceListItem = { id: string; encounters?: string; loitering?: string }

const NUMERIC_NAME = /^\d+$/
const HEX_NAME = /^[0-9a-f]+$/i
const ISO_DASH_NUMBER = /^[A-Z]{3}-\d+$/i

function isPlaceholderName(name: string) {
  if (NUMERIC_NAME.test(name)) {
    return true
  }
  if (HEX_NAME.test(name) && name.length >= 6) {
    return true
  }
  if (ISO_DASH_NUMBER.test(name)) {
    return true
  }
  return false
}

function quote(value: string) {
  return value.includes("'") ? `"${value}"` : `'${value}'`
}

function toTsModule(ports: PortListData[]) {
  const entries = ports.map((port) => {
    return `  {
    id: ${quote(port.id)},
    name: ${quote(port.name)},
    flag: ${quote(port.flag)},
    sources: [${port.sources.map(quote).join(', ')}],
  },`
  })
  return `const ports = [\n${entries.join('\n')}\n]\n\nexport default ports\n`
}

function convertPortsToList(inputPath: string, sourceListPath: string, outputPath: string): void {
  console.log(`Reading ports data from: ${inputPath}`)

  const rawData = fs.readFileSync(inputPath, 'utf-8')
  const ports: PortFeature[] = JSON.parse(rawData)
  // ports.json drops the encounters/loitering tags, the downloaded source list keeps them
  const sourceList: PortSourceListItem[] = JSON.parse(fs.readFileSync(sourceListPath, 'utf-8'))
  const sourcesById = new Map(sourceList.map((port) => [port.id, getPortSources(port)]))

  console.log(`Found ${ports.length} ports`)
  let invalidPorts = 0
  let placeholderPorts = 0

  const data: PortListData[] = ports.flatMap((port) => {
    const { name, area, flag } = port.properties
    if (!name || !area || !flag) {
      invalidPorts++
      return []
    }

    if (isPlaceholderName(name)) {
      placeholderPorts++
      return []
    }

    // The source list replaces "/" in ids with "_" (they are file names)
    const sources = sourcesById.get(area.replaceAll('/', '_')) ?? []
    return { id: area, name, flag, sources }
  })

  if (invalidPorts > 0) {
    console.error(`Ports with missing data (id, name, flag): ${invalidPorts}`)
  }
  console.log(`Dropped ${placeholderPorts} placeholder names`)
  console.log(`Writing ${data.length} ports to ${outputPath}`)

  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, toTsModule(data))
}

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const oceanAreasRoot = path.resolve(scriptDir, '../..')
const platformDataDir = path.resolve(oceanAreasRoot, '../../apps/platform/data')

convertPortsToList(
  path.join(oceanAreasRoot, 'src/data/ports.json'),
  path.join(oceanAreasRoot, 'src/source/ports-v5/list.json'),
  path.join(platformDataDir, 'ports.ts')
)
