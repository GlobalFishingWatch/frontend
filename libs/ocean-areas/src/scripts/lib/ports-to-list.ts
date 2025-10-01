import * as fs from 'fs'

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

function convertPortsToGeoJSON(inputPath: string, outputPath: string): void {
  try {
    console.log(`Reading ports data from: ${inputPath}`)

    const rawData = fs.readFileSync(inputPath, 'utf-8')
    const ports: PortFeature[] = JSON.parse(rawData)

    console.log(`Found ${ports.length} ports`)
    let invalidPorts = 0

    const data: PortListData[] = ports.flatMap((port) => {
      const { name, area, flag } = port.properties
      if (!name || !area || !flag) {
        invalidPorts++
        return []
      }

      return { id: area, name, flag }
    })

    if (invalidPorts > 0) {
      console.error(`Ports with missing data (id, name, flag): ${invalidPorts}`)
    }
    console.log(`Successfully converted ${data.length} ports to list`)

    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2))
    console.log(`GeoJSON written to: ${outputPath}`)
  } catch (error) {
    console.error('Error converting ports to GeoJSON:', error)
    process.exit(1)
  }
}

const inputFile = './src/data/ports.json'
const outputFile = './src/data/ports.list.json'

convertPortsToGeoJSON(inputFile, outputFile)
