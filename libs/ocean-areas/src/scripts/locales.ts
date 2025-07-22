import fs from 'fs/promises'
import path from 'path'

import data from '../data'

async function start() {
  try {
    const locales = data.features
      .sort((a, b) => a.properties.name.localeCompare(b.properties.name))
      .reduce((acc, feature) => {
        return { ...acc, [feature.properties.name]: feature.properties.name }
      }, {})

    await fs.writeFile(
      path.resolve(__dirname, '../locales/source.json'),
      JSON.stringify(locales, null, 2)
    )

    console.log(`✅ ${data.features.length} source translations`)
  } catch (e) {
    console.error(e)
  }
}

start()
