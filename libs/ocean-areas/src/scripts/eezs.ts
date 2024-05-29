import fs from 'fs/promises'
import path from 'path'
import { uniqBy } from 'lodash'
import eezData from '../data/source/eezs.json'
import eezGFW from '../data/source/eezs-gfw.json'

async function start() {
  try {
    const eezs = uniqBy(
      eezData.flatMap((f) => {
        const area = eezGFW.find((gfw) => gfw.label === f.properties.name)?.id
        if (!area) return []
        return {
          type: 'Feature',
          geometry: f.geometry,
          properties: {
            name: f.properties.name,
            type: 'eez',
            area: area,
          },
        }
      }),
      'properties.name'
    )
    const eezsAreasString = `
    import { FeatureCollection } from 'geojson'
    import { OceanAreaProperties } from '../ocean-areas'

    const eezsAreas: FeatureCollection<any, OceanAreaProperties> = {
      type: 'FeatureCollection',
      features: ${JSON.stringify(eezs)},
    }
    export default eezsAreas
    `
    await fs.writeFile(path.resolve(__dirname, '../data/eezs.ts'), eezsAreasString)
    console.log(`✅ ${eezs.length} EEZs`)
  } catch (e) {
    console.error(e)
  }
}

start()
