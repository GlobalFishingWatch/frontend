import GFWAPI from '@globalfishingwatch/api-client'
import { Vessel } from '@globalfishingwatch/api-types/dist'
import { TMTDetail, ValueItem, ValueList } from 'types'
import { VesselSourceId } from 'types/vessel'
import { VesselAPIThunk } from '../vessels.slice'

interface TMTVesselSourceId extends VesselSourceId {
  id: string
}
type MappingTMTValueToVesselType = {
  from: keyof ValueList
  to: keyof Vessel
}

const mapTMTtoVesselField: MappingTMTValueToVesselType[] = [
  {
    from: 'ircs',
    to: 'callsign',
  },
  {
    from: 'mmsi',
    to: 'mmsi',
  },
  {
    to: 'flag',
    from: 'flag',
  },
  {
    to: 'imo',
    from: 'imo',
  },
  {
    to: 'shipname',
    from: 'name',
  },
]
const extractValue: (valueItem: ValueItem[]) => string = (valueItem: ValueItem[]) => {
  return valueItem.shift()?.value || ''
}

function typedKeys<T>(o: T): (keyof T)[] {
  // type cast should be safe because that's what really Object.keys() does
  return Object.keys(o) as (keyof T)[]
}

const toVessel: (data: TMTDetail) => Vessel = (data: TMTDetail) => {
  const {
    vesselMatchId,
    valueList, //: { builtYear, flag, gt, imo, loa, mmsi, name, ircs, vesselType, gear, depth },
    relationList: { vesselOperations, vesselOwnership },
    authorisationList,
  } = data

  const values: Vessel = typedKeys<ValueList>(valueList) //Object.keys(valueList)
    .reduce((previous, current) => {
      const key =
        mapTMTtoVesselField.filter((mapping) => mapping.from === current).shift()?.to ?? current
      return {
        ...previous,
        [key]: extractValue(valueList[current] as ValueItem[]),
      }
    }, {})
  // (field) => ({[field]: extractValue(valueList[field] as ValueItem[])}))
  return {
    ...values,
    id: vesselMatchId,
  }
}
const vesselThunk: VesselAPIThunk = {
  fetchById: async ({ id = '' }: TMTVesselSourceId) => {
    if (!id) {
      return new Promise((resolve, reject) => {
        reject('Missing vessel id to fetch data')
      })
    }
    const url = `/v1/vessel-history/${id}`
    const data: Vessel = await GFWAPI.fetch<TMTDetail>(url).then(toVessel)
    return data
  },
}

export default vesselThunk
