import { kml } from '@tmcw/togeojson'
import JSZip, { JSZipObject } from 'jszip'
import { featureCollection } from '@turf/helpers'
import { DatasetGeometryType } from '@globalfishingwatch/api-types'

export async function kmlToGeoJSON(file: File, type: DatasetGeometryType) {
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
