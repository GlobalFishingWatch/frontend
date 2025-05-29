import { stringify } from 'qs'
import { serverT } from 'server/i18n'

import type { AdvancedSearchQueryFieldKey } from '@globalfishingwatch/api-client'
import { getAdvancedSearchQuery } from '@globalfishingwatch/api-client'
import type { APIVesselSearchPagination, IdentityVessel } from '@globalfishingwatch/api-types'

import { getVesselShipNameLabel } from 'utils/info'

import type { VesselParams } from '../types'

const GFW_API_URL =
  process.env.NEXT_PUBLIC_API_GATEWAY || 'https://gateway.api.globalfishingwatch.org'
const API_TOKEN = process.env.NEXT_GFW_API_KEY
const VESSEL_SEARCH_URL = 'v3/vessels/search'
const VESSEL_SEARCH_DATASETS = ['public-global-vessel-identity:v3.0']

export const searchVessels = async (vessel: VesselParams) => {
  const { name, imo, mmsi } = vessel || {}
  if (!name && !imo && !mmsi) return []

  let advancedQuery = ''
  const hasMultipleSearchParams = Object.values(vessel).filter(Boolean).length > 1
  if (hasMultipleSearchParams) {
    const fields = [
      ...(name ? [{ key: 'shipname' as AdvancedSearchQueryFieldKey, value: name }] : []),
      ...(imo ? [{ key: 'imo' as AdvancedSearchQueryFieldKey, value: imo }] : []),
      ...(mmsi ? [{ key: 'mmsi' as AdvancedSearchQueryFieldKey, value: mmsi }] : []),
    ]
    advancedQuery = getAdvancedSearchQuery(fields)
  }
  const query = advancedQuery ? `where=${advancedQuery}` : `query=${name || imo || mmsi}`
  const params = {
    datasets: VESSEL_SEARCH_DATASETS,
  }
  const url = `${GFW_API_URL}/${VESSEL_SEARCH_URL}?${query}&${stringify(params, { arrayFormat: 'indices' })}`
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    })

    if (!response.ok) {
      throw new Error(response.statusText || 'Failed to fetch data from GFW API')
    }

    const data = (await response.json()) as APIVesselSearchPagination<IdentityVessel>

    if (data.entries.length >= 1) {
      return data.entries.map((vessel) => ({
        id: vessel.selfReportedInfo?.[0]?.id,
        dataset: vessel.dataset,
        name: getVesselShipNameLabel(vessel, { translationFn: serverT }),
        mmsi: vessel.selfReportedInfo?.[0]?.ssvid,
        imo: vessel.selfReportedInfo?.[0]?.imo,
      }))
    }

    return []
  } catch (e) {
    return []
  }
}
