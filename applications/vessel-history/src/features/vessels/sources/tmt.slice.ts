import GFWAPI from '@globalfishingwatch/api-client'
import { Vessel } from '@globalfishingwatch/api-types/dist'
import { TMTDetail, ValueItem, VesselWithHistory } from 'types'
import { VesselSourceId } from 'types/vessel'
import { VesselAPIThunk } from '../vessels.slice'

interface TMTVesselSourceId extends VesselSourceId {
  id: string
}

const sortValuesByFirstSeen = (a: ValueItem, b: ValueItem) =>
  (a.firstSeen || '') >= (b.firstSeen || '') ? -1 : 1
const extractValue: (valueItem: ValueItem[]) => string | undefined = (valueItem: ValueItem[]) => {
  return valueItem.shift()?.value || undefined
}

export const toVessel: (data: TMTDetail) => VesselWithHistory = (data: TMTDetail) => {
  const {
    vesselMatchId,
    valueList,
    relationList: { vesselOperations, vesselOwnership },
    authorisationList,
  } = data
  const emptyHistory = { byDate: [], byCount: [] }

  const vessel: VesselWithHistory = {
    id: vesselMatchId,
    shipname: extractValue(valueList.name) || '',
    mmsi: extractValue(valueList.mmsi as ValueItem[]),
    imo: extractValue(valueList.imo),
    callsign: extractValue(valueList.ircs),
    flag: extractValue(valueList.flag) || '',
    type: extractValue(valueList.vesselType),
    gearType: extractValue(valueList.gear),
    length: extractValue(valueList.loa),
    depth: extractValue(valueList.depth),
    grossTonnage: extractValue(valueList.gt),
    owner: extractValue(vesselOwnership),
    operator: extractValue(vesselOperations),
    builtYear: extractValue(valueList.builtYear),
    authorizations: authorisationList.map((auth) => auth.source) ?? [],
    firstTransmissionDate: '',
    lastTransmissionDate: '',
    origin: '',
    history: {
      callsign: {
        byCount: [],
        byDate: valueList.ircs.sort(sortValuesByFirstSeen),
      },
      imo: {
        byCount: [],
        byDate: valueList.imo.sort(sortValuesByFirstSeen),
      },
      gearType: {
        byCount: [],
        byDate: valueList.gear.sort(sortValuesByFirstSeen),
      },
      shipname: {
        byCount: [],
        byDate: valueList.name.sort(sortValuesByFirstSeen),
      },
      mmsi: {
        byCount: [],
        byDate: valueList.mmsi.sort(sortValuesByFirstSeen),
      },
      owner: {
        byCount: [],
        byDate: data.relationList.vesselOwnership.sort(sortValuesByFirstSeen),
      },
      flag: emptyHistory,
    },
  }
  return vessel
}
const vesselThunk: VesselAPIThunk = {
  fetchById: async ({ id = '' }: TMTVesselSourceId) => {
    if (!id) {
      return new Promise((resolve, reject) => {
        reject('Missing vessel id to fetch data')
      })
    }
    const url = `/v1/vessel-history/${id}`
    return await GFWAPI.fetch<TMTDetail>(url).then(toVessel)
  },
}

export default vesselThunk
