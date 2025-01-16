import { GFWApiClient } from 'http-client/http-client'
import type {
  AnyValueList,
  Iuu,
  TMTDetail,
  ValueItem,
  VesselFieldHistory,
  VesselWithHistory} from 'types';

import type { Authorization } from '@globalfishingwatch/api-types'

import { IS_STANDALONE_APP } from 'data/config'
import {
  VesselAPISource
} from 'types'
import type { VesselSourceId } from 'types/vessel'

import type { VesselAPIThunk } from '../vessels.slice'

interface TMTVesselSourceId extends VesselSourceId {
  id: string
}

const extractValue: (valueItem: ValueItem[]) => string | undefined = (valueItem: ValueItem[]) => {
  return valueItem.slice().shift()?.value || undefined
}

const sortAuthorization = (a: Authorization, b: Authorization) =>
  a.originalStartDate > b.originalStartDate ? 1 : -1

const sortIuu = (a: Iuu, b: Iuu) => (a.originalFirstSeen > b.originalFirstSeen ? 1 : -1)

const getHistoryField = (historyField: AnyValueList[]): VesselFieldHistory<any> => ({
  byCount: [],
  byDate: historyField.reverse().map((field) => ({ ...field, source: VesselAPISource.TMT })),
})

const getIuuHistory = (historyField: Iuu[]): VesselFieldHistory<any> => ({
  byCount: [],
  byDate: historyField.map((field: Iuu) => ({
    ...field,
    source: VesselAPISource.TMT,
  })),
})

const transformIuuListing: (data: any) => TMTDetail = (data: any) => {
  return {
    ...data,
    iuuListing:
      data.iuuListing.map((iuu) => {
        return {
          ...iuu,
          value: iuu.source,
          firstSeen: iuu.startDate,
          originalFirstSeen: iuu.originalStartDate,
        }
      }) || [],
  }
}
export const toVessel: (data: TMTDetail) => VesselWithHistory = (data: TMTDetail) => {
  const {
    vesselMatchId,
    valueList,
    iuuStatus,
    iuuListing,
    relationList: { vesselOperations, vesselOwnership },
    authorisationList,
    imageList,
  } = data

  const vesselHistory = {
    builtYear: getHistoryField(valueList.builtYear),
    callsign: getHistoryField(valueList.ircs),
    depth: getHistoryField(valueList.depth),
    flag: getHistoryField(valueList.flag),
    imo: getHistoryField(valueList.imo),
    iuuListing: getIuuHistory(iuuListing.sort(sortIuu)),
    geartype: getHistoryField(valueList.gear),
    grossTonnage: getHistoryField(valueList.gt),
    shipname: getHistoryField(valueList.name),
    length: getHistoryField(valueList.loa),
    mmsi: getHistoryField(valueList.mmsi),
    owner: getHistoryField(vesselOwnership),
    vesselType: getHistoryField(valueList.vesselType),
    operator: getHistoryField(vesselOperations),
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
    authorizations: authorisationList ? authorisationList.sort(sortAuthorization) : [],
    iuuStatus: iuuStatus,
    iuuListing: iuuListing ? iuuListing.sort(sortIuu)[0] : null,
    firstTransmissionDate: '',
    lastTransmissionDate: '',
    years: [],
    posCount: 0,
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
    if (IS_STANDALONE_APP) {
      return undefined
    }
    const url = `/vessel-histories/${id}`

    return await GFWApiClient.fetch<TMTDetail>(url)
      .then(transformIuuListing)
      .then(toVessel)
      .catch((error) => {
        console.error(error)
        return undefined
      })
  },
}

export default vesselThunk
