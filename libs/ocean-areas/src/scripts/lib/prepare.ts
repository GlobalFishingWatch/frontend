import fs from 'fs/promises'

import type { Feature } from 'geojson'

import { simplifyArea } from './simplify'
import { downloadFolder } from './storage'
import type { AreaConfig } from './types'
import { renderBar } from './utils'

const sourcePathPrefix = 'src/source'
const dataPathPrefix = 'src/data'

async function existsFilePath(path: string) {
  return await fs
    .access(path)
    .then(() => true)
    .catch(() => false)
}

export async function prepare(
  {
    type,
    path,
    bucketFolder,
    propertiesMapping,
    limitBy,
    filter,
    skipDownload,
    geometryMode = 'simplify',
  } = {} as AreaConfig
) {
  const sourcePath = `${sourcePathPrefix}/${path}`
  const areasListPath = `${sourcePath}/list.json`
  const outputPath = `${dataPathPrefix}/${path}.json`

  try {
    if (skipDownload && (await existsFilePath(areasListPath))) {
      console.log(`\r[${type}] Data download skipped`)
    } else {
      console.log(`\r[${type}] Data downloading started`)
      await downloadFolder(`${bucketFolder}/data/*`, sourcePath)
    }
    if (!(await existsFilePath(areasListPath))) {
      return console.error(`❌ ${path} folder not downloaded`)
    }
    let list = JSON.parse(await fs.readFile(areasListPath, 'utf8'))
    if (limitBy) {
      list = limitBy(list)
    }

    process.stdout.write(`[${type}] Starts preparing the file... \n`)
    await fs.writeFile(outputPath, '[\n')

    let fileIndex = 0
    let filteredFileIndex = 0
    let errorCounting = 0
    let listLength = list.length
    for (const file of list) {
      fileIndex++
      const id = typeof file.id === 'string' ? file.id.replace('\r\n', '') : file.id

      const areaFilePath = `${sourcePath}/${id}.json`
      if (!(await existsFilePath(areaFilePath))) {
        console.error(`❌ Area file not found ${areaFilePath}`)
        continue
      }

      const areaFile = await fs.readFile(areaFilePath, 'utf8')
      const areaData = JSON.parse(areaFile) as Feature
      if (filter && !filter(areaData)) {
        listLength--
        process.stdout.write(`\r[${type}] ${renderBar(filteredFileIndex, listLength)}`)
        continue
      } else {
        filteredFileIndex++
        process.stdout.write(`\r[${type}] ${renderBar(filteredFileIndex, listLength)}`)
      }
      const simplifiedArea = simplifyArea(areaData, propertiesMapping.area, geometryMode)
      if (simplifiedArea) {
        const area = areaData.properties?.[propertiesMapping.area]
        if (!area) {
          console.error(`\r[${type}] Area not found ${propertiesMapping.area}`, areaData.properties)
          continue
        }
        const name = areaData.properties?.[propertiesMapping.name]
        if (!name) {
          console.error(`\r[${type}] Name not found ${propertiesMapping.name}`, areaData.properties)
          continue
        }
        const flag = areaData.properties?.[propertiesMapping.flag!]
        const finalArea = {
          ...simplifiedArea,
          properties: { type, area, name, ...(flag && { flag }) },
        }
        const jsonLine = JSON.stringify(finalArea)
        if (fileIndex === 1) {
          await fs.appendFile(outputPath, jsonLine)
        } else {
          await fs.appendFile(outputPath, ',\n' + jsonLine)
        }

        // Force garbage collection every 50 areas to prevent memory buildup
        if (fileIndex % 50 === 0 && global.gc) {
          global.gc()
        }
      } else {
        errorCounting++
      }
    }
    process.stdout.write('\n')
    if (errorCounting > 0) {
      console.error(
        `\r[${type}] ❌ Error simplifying ${errorCounting} ${errorCounting === 1 ? 'area' : 'areas'}`
      )
    }

    await fs.appendFile(outputPath, '\n]\n')

    // Final garbage collection to clean up any remaining memory
    if (global.gc) {
      global.gc()
    }

    console.log(`\r[${type}] ✅ Simplified areas saved to ${outputPath}`)
  } catch (e) {
    await fs.rm(outputPath)
    console.error(`\r[${type}] ❌ Error preparing ${outputPath}`, e)
  }
}
