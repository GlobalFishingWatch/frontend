import { prepare } from './lib/prepare.ts'

prepare({
  type: 'fao',
  path: 'fao',
  bucketFolder: 'public-fao-major',
  skipDownload: true,
  propertiesMapping: {
    area: 'F_CODE',
    name: 'NAME_EN',
  },
})
