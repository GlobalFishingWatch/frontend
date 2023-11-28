import { parse } from 'papaparse'
import { kml } from '@tmcw/togeojson'
import JSZip, { JSZipObject } from 'jszip'
import { featureCollection } from '@turf/helpers'
import { t } from 'i18next'
import {
  pointsListToGeojson,
  listToTrackSegments,
  segmentsToGeoJSON,
} from '@globalfishingwatch/data-transforms'
import { DatasetGeometryType } from '@globalfishingwatch/api-types'
import { DatasetMetadata } from 'features/datasets/upload/NewDataset'
import { getDatasetConfigurationProperty } from 'features/datasets/upload/datasets-upload.utils'
import { FileType, readBlobAs } from 'utils/files'
// interface FeatureCollectionWithMetadata extends FeatureCollectionWithFilename {
//   extensions?: string[]
// }

const CSV_EXTENSIONS = ['csv', 'tsv', 'dsv']
const KML_EXTENSIONS = ['kml', 'kmz']
const ZIP_FILE_TYPES = [
  'application/zip',
  'application/x-zip-compressed',
  'application/octet-stream',
  'multipart/x-zip',
]

export function getFileType(file: File): FileType {
  const isZip = ZIP_FILE_TYPES.some((type) => file.type === type)
  const isCSV = CSV_EXTENSIONS.some((ext) => file.name.endsWith(`.${ext}`))
  const isKML = KML_EXTENSIONS.some((ext) => file.name.endsWith(`.${ext}`))
  if (isZip) return 'shapefile'
  if (isCSV) return 'csv'
  if (isKML) return 'kml'
  return 'geojson'
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

export async function getDatasetParsed(file: File, type?: DatasetGeometryType) {
  const fileType: FileType = getFileType(file)
  if (fileType === 'shapefile') {
    try {
      const shpjs = await import('shpjs').then((module) => module.default)

      const fileData = await readBlobAs(file, 'arrayBuffer')
      // TODO support multiple files in shapefile
      const expandedShp = await shpjs(fileData)
      if (Array.isArray(expandedShp)) {
        // geojson = expandedShp[0]
        // return t(
        //   'errors.datasetShapefileMultiple',
        //   'Shapefiles containing multiple components (multiple file names) are not supported yet'
        // )
      } else {
        // if (
        //   expandedShp.extensions &&
        //   (!expandedShp.extensions.includes('.shp') ||
        //     !expandedShp.extensions.includes('.shx') ||
        //     !expandedShp.extensions.includes('.prj') ||
        //     !expandedShp.extensions.includes('.dbf'))
        // ) {
        //   return t(
        //     'errors.uploadShapefileComponents',
        //     'Error reading shapefile: must contain files with *.shp, *.shx, *.dbf and *.prj extensions.'
        //   )
        // } else {
        // }
        return expandedShp
      }
    } catch (e: any) {
      return t('errors.uploadShapefile', 'Error reading shapefile: {{error}}', { error: e })
    }
  } else if (fileType === 'csv') {
    // return load(file, CSVLoader)
    const fileText = await file.text()
    // TODO: CHECK IF CSV CONTAINS HEADERS ?
    const { data } = parse(fileText, {
      download: false,
      dynamicTyping: true,
      header: true,
    })
    return data.slice(1)
  } else if (fileType === 'kml') {
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

export const getGeojsonFromPointsList = (
  data: Record<string, any>[],
  datasetMetadata: DatasetMetadata
) => {
  return pointsListToGeojson(data, {
    latitude: getDatasetConfigurationProperty({ datasetMetadata, property: 'latitude' }),
    longitude: getDatasetConfigurationProperty({ datasetMetadata, property: 'longitude' }),
    timestamp: getDatasetConfigurationProperty({ datasetMetadata, property: 'timestamp' }),
    id: getDatasetConfigurationProperty({ datasetMetadata, property: 'idProperty' }),
  })
}
