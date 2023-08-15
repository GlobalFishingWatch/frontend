import fs from 'fs/promises'
import path from 'path'
import { uniqBy } from 'lodash'
import mpaData from '../data/source/top1000mpa.json'
import manualUpdates from '../data/source/manual-updates.json'

const features = [...mpaData.features, ...manualUpdates.features]

async function start() {
  try {
    const mpas = uniqBy(
      features.map((f) => {
        return {
          type: 'Feature',
          geometry: f.geometry,
          properties: {
            name: f.properties.NAME,
            type: 'mpa',
            area: Math.round(f.properties.GIS_AREA),
          },
        }
      }),
      'properties.name'
    )
    const mpasAreasString = `
    import { FeatureCollection } from 'geojson'
    import { OceanAreaProperties } from '../ocean-areas'

    const mpasAreas: FeatureCollection<any, OceanAreaProperties> = {
      type: 'FeatureCollection',
      features: ${JSON.stringify(mpas)},
    }
    export default mpasAreas
    `
    await fs.writeFile(path.resolve(__dirname, '../data/mpas.ts'), mpasAreasString)
    console.log('✅')
  } catch (e) {
    console.error(e)
  }
}

start()
