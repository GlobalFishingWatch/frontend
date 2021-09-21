import GFWAPI from '@globalfishingwatch/api-client'
import { GFWDetail, VesselAPISource, VesselWithHistory } from 'types'
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
    geartype: data.geartype,
    type: data.vesselType,
    vesselType: data.vesselType,
    authorizations: [],
    history: {
      callsign: {
        byCount: data.otherCallsigns,
        byDate: [],
      },
      geartype: {
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
      depth: emptyHistory,
      length: emptyHistory,
      grossTonnage: emptyHistory,
      vesselType: {
        byCount: [],
        byDate: [
          {
            value: data.vesselType,
            endDate: data.lastTransmissionDate,
            firstSeen: data.firstTransmissionDate,
            source: VesselAPISource.GFW,
          },
        ],
      },
      operator: emptyHistory,
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
