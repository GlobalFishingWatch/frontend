import fs from 'fs/promises'
import path from 'path'

// import data from '../data'
import eezs from '../data/eezs.json'
import fao from '../data/fao.json'

const data = [...eezs, ...fao]

async function start() {
  try {
    const locales = data
      .sort((a, b) => a.properties.name.localeCompare(b.properties.name))
      .reduce((acc, feature) => {
        return { ...acc, [feature.properties.name]: feature.properties.name }
      }, {})

    await fs.writeFile(
      path.resolve(__dirname, '../locales/source.json'),
      JSON.stringify(locales, null, 2)
    )

    console.log(`✅ ${data.length} source translations`)
  } catch (e) {
    console.error(e)
  }
}

start()
