import { prepare } from './lib/prepare'

prepare({
  type: 'eez',
  path: 'eezs',
  bucketFolder: 'public-eez-areas',
  skipDownload: true,
  propertiesMapping: {
    area: 'MRGID_EEZ',
    name: 'TERRITORY1',
  },
  filter: (feature) => {
    return (
      !feature.properties?.GEONAME.includes('Overlapping claim') &&
      !feature.properties?.GEONAME.includes('Joint regime')
    )
  },
})
