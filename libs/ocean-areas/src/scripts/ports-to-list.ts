import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

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
}

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
  },`
  })
  return `const ports = [\n${entries.join('\n')}\n]\n\nexport default ports\n`
}

function convertPortsToList(inputPath: string, outputPath: string): void {
  console.log(`Reading ports data from: ${inputPath}`)

  const rawData = fs.readFileSync(inputPath, 'utf-8')
  const ports: PortFeature[] = JSON.parse(rawData)

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

    return { id: area, name, flag }
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
  path.join(platformDataDir, 'ports.ts')
)
