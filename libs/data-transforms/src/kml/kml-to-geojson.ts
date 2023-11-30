import { kml } from '@tmcw/togeojson'
import JSZip, { JSZipObject } from 'jszip'
import { featureCollection } from '@turf/helpers'
import { FeatureCollection } from 'geojson'
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
    try {
      const str = isKMZ ? await (file as JSZipObject).async('string') : await (file as File).text()
      const kmlDoc = new DOMParser().parseFromString(str, 'text/xml')
      const geomType =
        kmlDoc.getElementsByTagName('LineString') || kmlDoc.getElementsByTagName('MultiLineString')
          ? 'lines'
          : kmlDoc.getElementsByTagName('Polygon') || kmlDoc.getElementsByTagName('MultiPolygon')
          ? 'polygons'
          : kmlDoc.getElementsByTagName('Point') || kmlDoc.getElementsByTagName('MultiPoint')
          ? 'points'
          : null

      if (type === 'polygons' && geomType === 'polygons') {
        const { features } = kml(kmlDoc)
        results.push(...features)
      } else if (type === 'tracks' && geomType === 'lines') {
        const { features } = kml(kmlDoc)
        results.push(...features)
      } else if (type === 'points' && geomType === 'points') {
        const { features } = kml(kmlDoc)
        results.push(...features)
      }
    } catch (e) {
      console.log(e)
    }
  }

  return featureCollection(results) as FeatureCollection
}
