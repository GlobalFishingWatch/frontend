import fs from 'fs/promises'
import path from 'path'

import { uniqBy } from 'es-toolkit'

import mpasGFW from '../data/source/mpas-gfw.json'
import manualUpdates from '../data/source/mpas-manual.json'
import mpasData from '../data/source/mpas-top1000.json'

const features = [...mpasData.features, ...manualUpdates.features]

async function start() {
  try {
    const mpas = uniqBy(
      features.flatMap((f) => {
        const area = mpasGFW.find((gfw) => gfw.NAME === f.properties.NAME)?.id
        if (!area) return []
        return {
          type: 'Feature',
          geometry: f.geometry,
          properties: {
            name: f.properties.NAME,
            type: 'mpa',
            area: parseInt(area),
          },
        }
      }),
      (f) => f.properties.name
    )
    await fs.writeFile(path.resolve(__dirname, '../data/source/mpas.json'), JSON.stringify(mpas))
    console.log(`✅ ${mpas.length} MPAs`)
  } catch (e) {
    console.error(e)
  }
}

start()
