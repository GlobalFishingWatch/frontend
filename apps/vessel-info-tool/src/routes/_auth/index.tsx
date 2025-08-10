import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { createFileRoute } from '@tanstack/react-router'
import type { Row } from '@tanstack/react-table'
import { stringify } from 'qs'

import { DynamicTable } from '@/features/dynamicTable/DynamicTable'
import { useTableFilters } from '@/features/dynamicTable/hooks/useTableFilters'
import DynamicFilters from '@/features/filter/DynamicFilters'
import Footer from '@/features/footer/Footer'
import SidebarHeader from '@/features/header/SidebarHeader'
import type { Vessel } from '@/types/vessel.types'
import { fetchVessels } from '@/utils/vessels'
import { IconButton } from '@globalfishingwatch/ui-components'

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
  const { t } = useTranslation()

  const { uniqueValues, filterState, filteredData, updateFilter } = useTableFilters(vessels)
  console.log('🚀 ~ Home ~ uniqueValues:', uniqueValues)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const handleExpandRow = async (row: Vessel) => {
    const { name, imo, mmsi } = row
    const query = `query=${name || imo || mmsi}`
    const params = {
      datasets: VESSEL_SEARCH_DATASETS,
    }
    const url = `${GFW_API_URL}/${VESSEL_SEARCH_URL}?${query}&${stringify(params, { arrayFormat: 'indices' })}`
    const response = await fetch(url)
    console.log('response', response)
    return response.json()
  }

  const checkCanExpand = async (row: Row<Vessel>) => {
    const { name, imo, mmsi } = row.original
    // const { name, imo, mmsi } = vessel || {}
    if (!name || !imo || !mmsi) return []

    const query = `query=${name || imo || mmsi}`
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
    console.log('data', data)
    return data.entries.length >= 1 || false
  }
  console.log('🚀 ~ t ~ vessels.length:', vessels.length)

  return (
    <>
      <SidebarHeader>
        <IconButton
          icon={isFilterOpen ? 'filter-off' : 'filter-on'}
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        />
        {isFilterOpen && <DynamicFilters filters={uniqueValues} onFilterChange={updateFilter} />}
        <h1>Vessels</h1>
      </SidebarHeader>
      <DynamicTable data={vessels} onExpandRow={handleExpandRow} checkCanExpand={checkCanExpand} />
      <Footer downloadClick={() => console.log('Download clicked')}>
        {t('footer.results', `${vessels.length} results`, { count: vessels.length })}
      </Footer>
    </>
  )
}
