import fs from 'fs/promises'
import path from 'path'
import mpaData from '../data/source/top1000mpa.json'

async function start() {
  try {
    const mpas = mpaData.features.map((f) => {
      return {
        type: 'Feature',
        geometry: f.geometry,
        properties: {
          name: f.properties.NAME,
          type: 'mpa',
          area: Math.round(f.properties.GIS_AREA),
        },
      }
    })
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
