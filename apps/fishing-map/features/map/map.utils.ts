import { wrapBBoxLongitudes } from '@globalfishingwatch/data-transforms'
import { Bbox } from 'types'

export const parsePropertiesBbox = (bbox: string) => {
  if (!bbox) return
  return wrapBBoxLongitudes(bbox.split(',').map((b) => parseFloat(b)) as Bbox)
}
