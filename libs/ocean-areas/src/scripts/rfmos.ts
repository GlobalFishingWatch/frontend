import { prepare } from './lib/prepare'

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
})
