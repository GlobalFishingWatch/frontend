import type { FeatureCollection } from 'geojson'
import capitalize from 'lodash/capitalize'
import lowerCase from 'lodash/lowerCase'

import type {
  DatasetConfigurationSourceFormat,
  DatasetGeometryType,
} from '@globalfishingwatch/api-types'

export function getFileName(file: File): string {
  const name =
    file.name.lastIndexOf('.') > 0 ? file.name.slice(0, file.name.lastIndexOf('.')) : file.name
  return capitalize(lowerCase(name))
}

export type FileType = DatasetConfigurationSourceFormat
export type MimeExtention =
  | '.json'
  | '.JSON'
  | '.geojson'
  | '.GEOJSON'
  | '.zip'
  | '.ZIP'
  | '.csv'
  | '.CSV'
  | '.tsv'
  | '.TSV'
  | '.kml'
  | '.KML'
  | '.kmz'
  | '.KMZ'
type MimeType =
  | 'application/json'
  | 'application/geo+json'
  | 'application/zip'
  | 'text/csv'
  | 'text/comma-separated-values'
  | 'text/tsv'
  | 'text/tab-separated-values'
  | 'application/vnd.google-earth.kml+xml'
  | 'application/vnd.google-earth.kmz'
const MIME_TYPES_BY_EXTENSION: Record<MimeExtention, MimeType[]> = {
  '.json': ['application/json'],
  '.JSON': ['application/json'],
  '.geojson': ['application/geo+json'],
  '.GEOJSON': ['application/geo+json'],
  '.zip': ['application/zip'],
  '.ZIP': ['application/zip'],
  '.csv': ['text/csv', 'text/comma-separated-values'],
  '.CSV': ['text/csv', 'text/comma-separated-values'],
  '.tsv': ['text/tsv', 'text/tab-separated-values'],
  '.TSV': ['text/tsv', 'text/tab-separated-values'],
  '.kml': ['application/vnd.google-earth.kml+xml'],
  '.KML': ['application/vnd.google-earth.kml+xml'],
  '.kmz': ['application/vnd.google-earth.kmz'],
  '.KMZ': ['application/vnd.google-earth.kmz'],
}

export type DatasetGeometryTypesSupported = Extract<
  DatasetGeometryType,
  'polygons' | 'tracks' | 'points'
>

const FILES_TYPES_BY_GEOMETRY_TYPE: Record<DatasetGeometryTypesSupported, FileType[]> = {
  polygons: ['GeoJSON', 'KML', 'Shapefile'],
  tracks: ['CSV', 'GeoJSON', 'KML', 'Shapefile'],
  points: ['CSV', 'GeoJSON', 'KML', 'Shapefile'],
}

export const getFileTypes = (datasetGeometryType: DatasetGeometryTypesSupported) =>
  FILES_TYPES_BY_GEOMETRY_TYPE[datasetGeometryType]

type FileConfig = { id: FileType; files: MimeExtention[]; icon: string }

export const FILE_TYPES_CONFIG: Record<FileType, FileConfig> = {
  GeoJSON: {
    id: 'GeoJSON',
    files: ['.json', '.geojson'],
    icon: 'geojson',
  },
  // TODO: replace with zip
  Shapefile: { id: 'Shapefile', files: ['.zip', '.ZIP'], icon: 'zip' },
  CSV: { id: 'CSV', files: ['.csv', '.tsv', '.CSV', '.TSV'], icon: 'csv' },
  KML: { id: 'KML', files: ['.kml', '.kmz', '.KML', '.KMZ'], icon: 'kml' },
}

export function getFileType(
  file?: File,
  geometryType?: DatasetGeometryTypesSupported
): FileType | undefined {
  if (!file) {
    return undefined
  }
  const fileType = Object.values(FILE_TYPES_CONFIG).find(({ files }) => {
    return files.some((ext) => file.name.endsWith(ext))
  })?.id

  return fileType === 'Shapefile' && geometryType === 'tracks' ? 'CSV' : fileType
}

export function getFilesAcceptedByMime(fileTypes: FileType[]) {
  const fileTypesConfigs = fileTypes.map((fileType) => FILE_TYPES_CONFIG[fileType])
  const filesAcceptedExtensions = fileTypesConfigs.flatMap(
    (config) => config?.files as MimeExtention[]
  )
  const fileAcceptedByMime = filesAcceptedExtensions.reduce((acc, extension) => {
    const mime = MIME_TYPES_BY_EXTENSION[extension]
    mime?.forEach((m) => {
      if (!acc[m]) {
        acc[m] = [extension]
      } else {
        acc[m].push(extension)
      }
    })
    return acc
  }, {} as Record<MimeType, MimeExtention[]>)
  return fileAcceptedByMime
}

export function readBlobAs(blob: Blob, format: 'text' | 'arrayBuffer'): Promise<string>
export function readBlobAs(blob: Blob, format: 'text' | 'arrayBuffer'): Promise<ArrayBuffer>
export function readBlobAs(blob: Blob, format: 'text' | 'arrayBuffer'): any {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      if (reader.result) {
        if (format === 'text') {
          resolve(reader.result as string)
        } else {
          resolve(reader.result as ArrayBuffer)
        }
      } else {
        reject('no reader result')
      }
    }
    if (format === 'text') {
      reader.readAsText(blob)
    } else {
      reader.readAsArrayBuffer(blob)
    }
  })
}

export function getFileFromGeojson(geojson: FeatureCollection) {
  try {
    return new File([JSON.stringify(geojson)], 'file.json', {
      type: 'application/json',
    })
  } catch (error) {
    console.warn(error)
  }
}
