import { prepare } from './lib/prepare.ts'

prepare({
  type: 'eez',
  path: 'eezs',
  bucketFolder: 'public-eez-areas',
  skipDownload: true,
  propertiesMapping: {
    area: 'MRGID_EEZ',
    name: 'TERRITORY1',
  },
  getFlag: (feature) => {
    const { GEONAME, ISO_SOV1 } = feature.properties ?? {}
    return ISO_SOV1 && /\([^)]+\)\s*$/.test(GEONAME ?? '') ? ISO_SOV1 : undefined
  },
  filter: (feature) => {
    return (
      !feature.properties?.GEONAME.includes('Overlapping claim') &&
      !feature.properties?.GEONAME.includes('Joint regime') &&
      feature.properties?.TERRITORY1 !== 'Antarctica'
    )
  },
})
