import { prepare } from './lib/prepare'

prepare({
  type: 'eez',
  path: 'eezs',
  bucketFolder: 'public-eez-areas',
  skipDownload: true,
  propertiesMapping: {
    area: 'MRGID_EEZ',
    name: 'GEONAME',
  },
})
