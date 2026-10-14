import { prepare } from './lib/prepare.ts'

prepare({
  type: 'rfmo',
  path: 'rfmos',
  bucketFolder: 'public-rfmo',
  skipDownload: true,
  geometryMode: 'bbox',
  propertiesMapping: {
    area: 'ID',
    name: 'ID',
  },
  // Global bodies, not fishing areas: their bbox (and report) is the whole ocean
  filter: (feature) => !['ACAP', 'IWC'].includes(feature.properties?.ID),
})
