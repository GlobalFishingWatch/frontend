import { createFileRoute } from '@tanstack/react-router'
import type { Row } from '@tanstack/react-table'
import { stringify } from 'qs'

import { DynamicTable } from '@/features/dynamicTable/DynamicTable'
import SidebarHeader from '@/features/header/SidebarHeader'
import { createColumns, VesselTable } from '@/features/table/VesselsTable'
import type { Vessel } from '@/types/vessel.types'
import { fetchVessels } from '@/utils/vessels'

const GFW_API_URL =
  process.env.NEXT_PUBLIC_API_GATEWAY || 'https://gateway.api.globalfishingwatch.org'
const API_TOKEN = process.env.NEXT_GFW_API_KEY
const VESSEL_SEARCH_URL = 'v3/vessels/search'
const VESSEL_SEARCH_DATASETS = ['public-global-vessel-identity:v3.0']

export const Route = createFileRoute('/_auth/')({
  loader: async () => fetchVessels(),
  component: Home,
})

function Home() {
  const vessels: Vessel[] = Route.useLoaderData()
  const columns = createColumns(vessels)

  const handleExpandRow = async (row: Vessel) => {
    const response = await fetch(`${GFW_API_URL}/${VESSEL_SEARCH_URL}?query=${row.id}`)
    return response.json()
  }

  const checkCanExpand = async (row: Row<Vessel>) => {
    const { id } = row.original
    // const { name, imo, mmsi } = vessel || {}
    // if (!name && !imo && !mmsi) return []

    const query = `query=${id}`
    const params = {
      datasets: VESSEL_SEARCH_DATASETS,
    }
    const url = `${GFW_API_URL}/${VESSEL_SEARCH_URL}?${query}&${stringify(params, { arrayFormat: 'indices' })}`
    let data
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      })

      if (!response.ok) {
        throw new Error(response.statusText || 'Failed to fetch data from GFW API')
      }

      data = await response.json()
    } catch (e) {
      return false
    }
    return data.entries.length >= 1 || false
  }

  return (
    <>
      <SidebarHeader>
        <h1>Vessels</h1>
      </SidebarHeader>
      <DynamicTable data={vessels} onExpandRow={handleExpandRow} checkCanExpand={checkCanExpand} />
    </>
  )
}
