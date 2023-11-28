import { parse } from 'papaparse'
import { kml } from '@tmcw/togeojson'
import JSZip, { JSZipObject } from 'jszip'
import { featureCollection } from '@turf/helpers'
import { listToTrackSegments, segmentsToGeoJSON } from '@globalfishingwatch/data-transforms'
import { DatasetGeometryType } from '@globalfishingwatch/api-types'
import { DatasetMetadata } from 'features/datasets/upload/NewDataset'
import { getDatasetConfigurationProperty } from 'features/datasets/upload/datasets-upload.utils'

const CSV_EXTENSIONS = ['csv', 'tsv', 'dsv']
const KML_EXTENSIONS = ['kml', 'kmz']
const ZIP_FILE_TYPES = [
  'application/zip',
  'application/x-zip-compressed',
  'application/octet-stream',
  'multipart/x-zip',
]

export async function getDatasetParsed(file: File, type?: DatasetGeometryType) {
  const isZip = ZIP_FILE_TYPES.some((type) => file.type === type)
  const isCSV = CSV_EXTENSIONS.some((ext) => file.name.endsWith(`.${ext}`))
  const isKML = KML_EXTENSIONS.some((ext) => file.name.endsWith(`.${ext}`))
  if (isZip) {
    console.log('TODO: handle shpfile with sphjs library')
  } else if (isCSV) {
    const fileText = await file.text()
    // TODO: CHECK IF CSV CONTAINS HEADERS ?
    const { data } = parse(fileText, {
      download: false,
      dynamicTyping: true,
      header: true,
    })
    return data.slice(1)
  } else if (isKML) {
    return await kmlToGeoJSON(file, type as DatasetGeometryType)
  }
  const fileText = await file.text()
  return JSON.parse(fileText)
}

export const getTrackFromList = (data: Record<string, any>[], datasetMetadata: DatasetMetadata) => {
  const segments = listToTrackSegments({
    records: data,
    latitude: getDatasetConfigurationProperty({ datasetMetadata, property: 'latitude' }),
    longitude: getDatasetConfigurationProperty({ datasetMetadata, property: 'longitude' }),
    timestamp: getDatasetConfigurationProperty({ datasetMetadata, property: 'timestamp' }),
    id: getDatasetConfigurationProperty({ datasetMetadata, property: 'idProperty' }),
  })
  return segmentsToGeoJSON(segments)
}

async function kmlToGeoJSON(file: File, type: DatasetGeometryType) {
  const isKMZ = file.name.endsWith('.kmz')
  const results = []
  let files: JSZip.JSZipObject[] | File[] = [file]
  if (isKMZ) {
    const zip = await JSZip.loadAsync(file)
    files = zip.file(/\.kml$/)
  }

  for (const file of files) {
    const str = isKMZ ? await (file as JSZipObject).async('string') : await (file as File).text()
    const kmlDoc = new DOMParser().parseFromString(str, 'text/xml')
    const { features } = kml(kmlDoc)
    const geomType = features[0]?.geometry?.type
    if (type === 'polygons' && (geomType === 'Polygon' || geomType === 'MultiPolygon')) {
      results.push(...features)
    } else if (type === 'tracks' && (geomType === 'LineString' || geomType === 'MultiLineString')) {
      results.push(...features)
    } else if (type === 'points' && (geomType === 'Point' || geomType === 'MultiPoint')) {
      results.push(...features)
    }
  }

  return featureCollection(results)
}
