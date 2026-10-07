import type { Feature } from 'geojson'

import { prepare } from './lib/prepare.ts'

const isSharedArea = (feature: Feature) =>
  /^(Overlapping claim|Joint regime)/.test(feature.properties?.GEONAME ?? '')

prepare({
  type: 'eez',
  path: 'eezs',
  bucketFolder: 'public-eez-areas',
  skipDownload: true,
  propertiesMapping: {
    area: 'MRGID_EEZ',
    name: 'TERRITORY1',
  },
  // Overlapping claims and joint regimes are shared by several countries: TERRITORY1 is only one
  // of them ("Norway" for "Joint regime area: Norway / Russia"), which would read as that
  // country's own EEZ. GEONAME names every party
  getName: (feature) =>
    isSharedArea(feature) ? feature.properties?.GEONAME : feature.properties?.TERRITORY1,
  getFlag: (feature) => {
    const { GEONAME, ISO_SOV1 } = feature.properties ?? {}
    return ISO_SOV1 && !isSharedArea(feature) && /\([^)]+\)\s*$/.test(GEONAME ?? '')
      ? ISO_SOV1
      : undefined
  },
  filter: (feature) => feature.properties?.TERRITORY1 !== 'Antarctica',
})
