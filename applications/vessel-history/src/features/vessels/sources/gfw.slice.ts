import GFWAPI from '@globalfishingwatch/api-client'
import { GFWDetail, VesselWithHistory } from 'types'
import { VesselSourceId } from 'types/vessel'
import { VesselAPIThunk } from '../vessels.slice'

interface GFWVesselSourceId extends VesselSourceId {
  id: string
  dataset: string
}
export const toVessel: (data: GFWDetail) => VesselWithHistory = (data: GFWDetail) => {
  const emptyHistory = { byDate: [], byCount: [] }
  return {
    id: data.id,
    flag: data.flag,
    shipname: data.shipname,
    firstTransmissionDate: data.firstTransmissionDate,
    lastTransmissionDate: data.lastTransmissionDate,
    imo: data.imo,
    mmsi: data.mmsi,
    callsign: data.callsign,
    gearType: data.geartype,
    authorizations: [],
    history: {
      callsign: {
        byCount: data.otherCallsigns,
        byDate: [],
      },
      gearType: {
        byCount: [],
        byDate: [],
      },
      imo: {
        byCount: data.otherImos,
        byDate: [],
      },
      shipname: {
        byCount: data.otherShipnames,
        byDate: [],
      },
      mmsi: emptyHistory,
      owner: emptyHistory,
      flag: emptyHistory,
    },
  } as VesselWithHistory
}
const vesselThunk: VesselAPIThunk = {
  fetchById: async ({ id = '', dataset = '' }: GFWVesselSourceId) => {
    if (!id || !dataset) {
      return new Promise((resolve, reject) => {
        reject('Missing vessel id or dataset to fetch data')
      })
    }
    const url = `/v1/vessels/${id}?datasets=${dataset}`
    return await GFWAPI.fetch<GFWDetail>(url).then(toVessel)
  },
}

export default vesselThunk
