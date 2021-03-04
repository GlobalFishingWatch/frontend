import GFWAPI from '@globalfishingwatch/api-client'
import { Vessel } from '@globalfishingwatch/api-types/dist'
import { GFWDetail } from 'types'
import { VesselSourceId } from 'types/vessel'
import { VesselAPIThunk } from '../vessels.slice'

interface GFWVesselSourceId extends VesselSourceId {
  id: string
  dataset: string
}
const toVessel: (data: GFWDetail) => Vessel = (data: GFWDetail) => {
  return {
    ...data,
  }
}
const vesselThunk: VesselAPIThunk = {
  fetchById: async ({ id = '', dataset = '' }: GFWVesselSourceId) => {
    if (!id || !dataset) {
      return new Promise((resolve, reject) => {
        reject('Missing vessel id or dataset to fetch data')
      })
    }
    const url = `/v1/vessels/${id}?datasets=${dataset}`
    const data: Vessel = await GFWAPI.fetch<GFWDetail>(url).then(toVessel)
    return data
  },
}

export default vesselThunk
