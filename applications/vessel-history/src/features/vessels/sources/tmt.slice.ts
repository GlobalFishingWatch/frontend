import { DateTime } from 'luxon'
import GFWAPI from '@globalfishingwatch/api-client'
import { TMTDetail, ValueItem, VesselWithHistory } from 'types'
import { VesselSourceId } from 'types/vessel'
import { VesselAPIThunk } from '../vessels.slice'

interface TMTVesselSourceId extends VesselSourceId {
  id: string
}

// Using today as fallback when both firstSeen and endDate are missing
const today = DateTime.now().toUTC().toISO()

const sortValuesByDate = (a: ValueItem, b: ValueItem) =>
  (a.firstSeen || a.endDate || today) >= (b.firstSeen || b.endDate || today) ? -1 : 1
const extractValue: (valueItem: ValueItem[]) => string | undefined = (valueItem: ValueItem[]) => {
  return valueItem.slice().shift()?.value || undefined
}

export const toVessel: (data: TMTDetail) => VesselWithHistory = (data: TMTDetail) => {
  const {
    vesselMatchId,
    valueList,
    relationList: { vesselOperations, vesselOwnership },
    authorisationList,
    imageList,
  } = data
  const emptyHistory = { byDate: [], byCount: [] }
  const vesselHistory = {
    builtYear: {
      byCount: [],
      byDate: valueList.builtYear.sort(sortValuesByDate),
    },
    callsign: {
      byCount: [],
      byDate: valueList.ircs.sort(sortValuesByDate),
    },
    depth: {
      byCount: [],
      byDate: valueList.depth.sort(sortValuesByDate),
    },
    flag: {
      byCount: [],
      byDate: valueList.flag.sort(sortValuesByDate),
    },
    imo: {
      byCount: [],
      byDate: valueList.imo.sort(sortValuesByDate),
    },
    geartype: {
      byCount: [],
      byDate: valueList.gear.sort(sortValuesByDate),
    },
    grossTonnage: {
      byCount: [],
      byDate: valueList.gt.sort(sortValuesByDate),
    },
    shipname: {
      byCount: [],
      byDate: valueList.name.sort(sortValuesByDate),
    },
    length: {
      byCount: [],
      byDate: valueList.loa.sort(sortValuesByDate),
    },
    mmsi: {
      byCount: [],
      byDate: valueList.mmsi.sort(sortValuesByDate),
    },
    owner: {
      byCount: [],
      byDate: vesselOwnership.sort(sortValuesByDate),
    },
    vesselType: {
      byCount: [],
      byDate: valueList.vesselType.sort(sortValuesByDate),
    },
    operator: {
      byCount: [],
      byDate: vesselOperations.sort(sortValuesByDate),
    },
  }

  const vessel: VesselWithHistory = {
    id: vesselMatchId,
    shipname: extractValue(vesselHistory.shipname.byDate) || '',
    mmsi: extractValue(vesselHistory.mmsi.byDate as ValueItem[]),
    imo: extractValue(vesselHistory.imo.byDate),
    callsign: extractValue(vesselHistory.callsign.byDate),
    flag: extractValue(vesselHistory.flag.byDate) || '',
    type: extractValue(vesselHistory.vesselType.byDate),
    geartype: extractValue(vesselHistory.geartype.byDate),
    length: extractValue(vesselHistory.length.byDate),
    depth: extractValue(vesselHistory.depth.byDate),
    grossTonnage: extractValue(vesselHistory.grossTonnage.byDate),
    owner: extractValue(vesselHistory.owner.byDate),
    operator: extractValue(vesselHistory.operator.byDate),
    builtYear: extractValue(vesselHistory.builtYear.byDate),
    authorizations: authorisationList.map((auth) => auth.source) ?? [],
    firstTransmissionDate: '',
    lastTransmissionDate: '',
    origin: '',
    history: {
      ...vesselHistory,
    },
    imageList: imageList ?? [],
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
