import fs from 'fs/promises'
import path from 'path'

import geometries from '../data/geometries'

async function start() {
  try {
    const names = geometries.features
      .sort((a, b) => a.properties.name.localeCompare(b.properties.name))
      .reduce((acc, feature) => {
        return { ...acc, [feature.properties.name]: feature.properties.name }
      }, {})
    await fs.writeFile(
      path.resolve(__dirname, '../data/locales/source.json'),
      JSON.stringify(names)
    )
    console.log(`✅ ${geometries.features.length} source translations`)
  } catch (e) {
    console.error(e)
  }
}

start()
