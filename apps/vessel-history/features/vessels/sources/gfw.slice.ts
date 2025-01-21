import { GFWApiClient } from 'http-client/http-client'
import type { GFWDetail, VesselWithHistory } from 'types';

import { VesselAPISource } from 'types'
import type { VesselSourceId } from 'types/vessel'

import type { VesselAPIThunk } from '../vessels.slice'

interface GFWVesselSourceId extends VesselSourceId {
  id: string
  dataset: string
}

const getHistoryField = (data: GFWDetail, field: string, byCount: any[] = []) => ({
  byCount: byCount,
  byDate: data[field]
    ? [
        {
          value: data[field],
          endDate: data.lastTransmissionDate,
          firstSeen: data.firstTransmissionDate,
          source: VesselAPISource.GFW,
        },
      ]
    : [],
})

export const toVessel: (data: GFWDetail) => VesselWithHistory = (data: GFWDetail) => {
  return {
    id: data.id,
    flag: data.flag,
    shipname: data.shipname,
    firstTransmissionDate: data.firstTransmissionDate,
    lastTransmissionDate: data.lastTransmissionDate,
    imo: data.imo,
    mmsi: data.mmsi,
    years: data.years,
    posCount: data.posCount,
    callsign: data.callsign,
    geartype: data.geartype,
    type: data.vesselType,
    vesselType: data.vesselType,
    forcedLabour: data.forcedLabour,
    authorizations: [],
    history: {
      callsign: getHistoryField(data, 'callsign', data.otherCallsigns),
      geartype: getHistoryField(data, 'geartype'),
      imo: getHistoryField(data, 'imo', data.otherImos),
      shipname: getHistoryField(data, 'shipname', data.otherShipnames),
      mmsi: getHistoryField(data, 'mmsi'),
      owner: getHistoryField(data, 'owner'),
      flag: getHistoryField(data, 'flag'),
      depth: getHistoryField(data, 'depth'),
      length: getHistoryField(data, 'length'),
      grossTonnage: getHistoryField(data, 'grossTonnage'),
      vesselType: getHistoryField(data, 'vesselType'),
      operator: getHistoryField(data, 'operator'),
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
    const url = `/vessels/${id}?datasets=${dataset}`
    return await GFWApiClient.fetch<GFWDetail>(url).then(toVessel)
  },
}

export default vesselThunk
