import { DatasetGeometryType } from '@globalfishingwatch/api-types'
import initGdalJs from '@globalfishingwatch/gdal3.js'
import { DatasetMetadata } from 'features/datasets/upload/NewDataset'
import { readBlobAs } from 'utils/files'
import { getTrackFromCsvQuery } from 'features/datasets/upload/datasets-parse-helpers'

let Gdal: Gdal
const initGdal = async () => {
  if (!Gdal) {
    Gdal = await initGdalJs({ path: '/' })
  }
  return Gdal
}

export async function getGdalDataset(file: File) {
  if (!Gdal) {
    await initGdal()
  }
  const isZip =
    file.type === 'application/zip' ||
    file.type === 'application/x-zip-compressed' ||
    file.type === 'application/octet-stream' ||
    file.type === 'multipart/x-zip'
  const vfsHandler = isZip ? ['vsizip'] : []
  const dataset = await Gdal.open(file, [], vfsHandler).then(({ datasets }) => {
    return datasets?.[0]
  })
  return dataset
}

export async function closeGdalDataset(dataset: Dataset) {
  if (!Gdal) {
    await initGdal()
  }
  Gdal.close(dataset)
}

export async function getGdalDatasetSchema(dataset: Dataset) {
  if (!Gdal) {
    await initGdal()
  }
}

export async function parseDatasetFile(
  dataset: Dataset,
  type: DatasetGeometryType,
  config: DatasetMetadata
) {
  if (!Gdal) {
    await initGdal()
  }
  const datasetInfo = await Gdal.getInfo(dataset) // Vector
  if (type === 'tracks') {
    const lineId = 'individual'
    const pointId = 'id'
    const fileName = datasetInfo.layers?.[0]?.name
    const options = [
      // https://gdal.org/programs/ogr2ogr.html#description
      '-f',
      'GeoJSON',
      ...getTrackFromCsvQuery({ lineId, pointId, fileName: fileName || 'pepe' }),
      // '-oo',
      // 'X_POSSIBLE_NAMES=longitude',
      // '-oo',
      // 'Y_POSSIBLE_NAMES=latitude',
      // '-oo',
      // 'KEEP_GEOM_COLUMNS=YES',
    ]
    const output = await Gdal.ogr2ogr(dataset, options)
    const bytes = await Gdal.getFileBytes(output)
    const fileData = await readBlobAs(new Blob([bytes]), 'text')
    const geojson = JSON.parse(fileData)
    return geojson
  }
}
