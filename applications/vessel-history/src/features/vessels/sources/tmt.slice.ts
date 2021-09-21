import GFWAPI from '@globalfishingwatch/api-client'
import { TMTDetail, ValueItem, VesselWithHistory } from 'types'
import { VesselSourceId } from 'types/vessel'
import { VesselAPIThunk } from '../vessels.slice'

interface TMTVesselSourceId extends VesselSourceId {
  id: string
}

const extractValue: (valueItem: ValueItem[]) => string | undefined = (valueItem: ValueItem[]) => {
  return valueItem.slice().shift()?.value || undefined
}

export const toVessel: (data: TMTDetail) => VesselWithHistory = (data: TMTDetail) => {
  const {
    vesselMatchId,
    valueList,
    iuuStatus,
    relationList: { vesselOperations, vesselOwnership },
    authorisationList,
    imageList,
  } = data
  const vesselHistory = {
    builtYear: {
      byCount: [],
      byDate: valueList.builtYear.reverse(),
    },
    callsign: {
      byCount: [],
      byDate: valueList.ircs.reverse(),
    },
    depth: {
      byCount: [],
      byDate: valueList.depth.reverse(),
    },
    flag: {
      byCount: [],
      byDate: valueList.flag.reverse(),
    },
    imo: {
      byCount: [],
      byDate: valueList.imo.reverse(),
    },
    geartype: {
      byCount: [],
      byDate: valueList.gear.reverse(),
    },
    grossTonnage: {
      byCount: [],
      byDate: valueList.gt.reverse(),
    },
    shipname: {
      byCount: [],
      byDate: valueList.name.reverse(),
    },
    length: {
      byCount: [],
      byDate: valueList.loa.reverse(),
    },
    mmsi: {
      byCount: [],
      byDate: valueList.mmsi.reverse(),
    },
    owner: {
      byCount: [],
      byDate: vesselOwnership.reverse(),
    },
    vesselType: {
      byCount: [],
      byDate: valueList.vesselType.reverse(),
    },
    operator: {
      byCount: [],
      byDate: vesselOperations.reverse(),
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
    vesselType: extractValue(vesselHistory.vesselType.byDate),
    geartype: extractValue(vesselHistory.geartype.byDate),
    length: extractValue(vesselHistory.length.byDate),
    depth: extractValue(vesselHistory.depth.byDate),
    grossTonnage: extractValue(vesselHistory.grossTonnage.byDate),
    owner: extractValue(vesselHistory.owner.byDate),
    operator: extractValue(vesselHistory.operator.byDate),
    builtYear: extractValue(vesselHistory.builtYear.byDate),
    authorizations: authorisationList ? authorisationList.reverse() : [],
    iuuStatus: iuuStatus,
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
