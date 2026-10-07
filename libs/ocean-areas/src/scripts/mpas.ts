import type { Feature } from 'geojson'

import { prepare } from './lib/prepare.ts'

prepare({
  type: 'mpa',
  path: 'mpas',
  bucketFolder: 'public-mpa-all',
  skipDownload: true,
  geometryMode: 'bbox',
  propertiesMapping: {
    area: 'SITE_PID', // WDPA_PID in the WDPA source before 2026
    name: 'NAME',
  },
  // Parent (sovereign) country, as EEZs use. The field is `PARENT_ISO` in older WDPA exports;
  // the few transboundary MPAs list several (`FIN;SWE`) and keep only the first
  getFlag: (feature) => {
    const { PRNT_ISO3, PARENT_ISO } = feature.properties ?? {}
    return (PRNT_ISO3 ?? PARENT_ISO)?.split(';')[0] || undefined
  },
  // WDPA's marine area (km²): the meaningful size for an MPA, which often also covers land
  getAreaSize: (feature) => {
    const km2 = feature.properties?.GIS_M_AREA
    return typeof km2 === 'number' ? km2 * 1_000_000 : undefined
  },
  limitBy: (areas: Feature[]) => {
    const areasByArea = areas.sort((a, b) => a.properties?.GIS_AREA - b.properties?.GIS_AREA)
    return areasByArea
  },
})
