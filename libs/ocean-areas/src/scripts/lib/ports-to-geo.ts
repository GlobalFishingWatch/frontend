import * as fs from 'fs'
import * as path from 'path'

type PortData = {
  port_id: string
  name: string
  flag: string
  lat: string
  lon: string
}

type GeoJSONFeature = {
  type: 'Feature'
  properties: {
    type: 'port'
    id: string
    name: string
    flag: string
  }
  geometry: {
    type: 'Point'
    coordinates: [number, number]
  }
}

type GeoJSON = {
  type: 'FeatureCollection'
  features: GeoJSONFeature[]
}

function convertPortsToGeoJSON(inputPath: string, outputPath: string): void {
  try {
    console.log(`Reading ports data from: ${inputPath}`)

    const rawData = fs.readFileSync(inputPath, 'utf-8')
    const ports: PortData[] = JSON.parse(rawData)

    console.log(`Found ${ports.length} ports`)
    let invalidPorts = 0

    const features: GeoJSONFeature[] = ports.flatMap((port) => {
      if (!port.port_id || !port.lat || !port.lon || !port.name || !port.flag) {
        invalidPorts++
        return []
      }

      const lat = parseFloat(port.lat)
      const lon = parseFloat(port.lon)

      if (isNaN(lat) || isNaN(lon)) {
        console.warn(
          `Invalid coordinates for port ${port.port_id}: lat=${port.lat}, lon=${port.lon}`
        )
        return []
      }

      if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
        console.warn(`Coordinates out of range for port ${port.port_id}: lat=${lat}, lon=${lon}`)
        return []
      }

      return {
        type: 'Feature',
        properties: {
          type: 'port',
          id: port.port_id,
          name: port.name,
          flag: port.flag || 'UNK',
        },
        geometry: {
          type: 'Point',
          coordinates: [lon, lat],
        },
      }
    })

    if (invalidPorts > 0) {
      console.error(`Ports with missing data (id, name, flag, lat, lon): ${invalidPorts}`)
    }

    console.log(`Successfully converted ${features.length} ports to GeoJSON`)

    const geoJSON: GeoJSON = {
      type: 'FeatureCollection',
      features,
    }

    fs.writeFileSync(outputPath, JSON.stringify(geoJSON, null, 2))
    console.log(`GeoJSON written to: ${outputPath}`)
  } catch (error) {
    console.error('Error converting ports to GeoJSON:', error)
    process.exit(1)
  }
}

const inputFile = './src/scripts/all-ports.json'
const outputFile = './src/scripts/all-ports.geo.json'

convertPortsToGeoJSON(inputFile, outputFile)
