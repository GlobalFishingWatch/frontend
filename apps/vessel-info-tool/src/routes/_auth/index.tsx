import { useTranslation } from 'react-i18next'
import { createFileRoute } from '@tanstack/react-router'
import type { Row } from '@tanstack/react-table'
import { stringify } from 'qs'

import { DynamicTable } from '@/features/dynamicTable/DynamicTable'
import Footer from '@/features/footer/Footer'
import SidebarHeader from '@/features/header/SidebarHeader'
import OptionsMenu from '@/features/options/OptionsMenu'
import Profile from '@/features/profile/Profile'
import Search from '@/features/search/Search'
import { type TableSearchParams,useTableFilters } from '@/hooks/useTableFilters'
import type { Vessel } from '@/types/vessel.types'
import { fetchVessels } from '@/utils/vessels'
import { MOCK_USER_PERMISSION } from '@globalfishingwatch/api-types'

const GFW_API_URL =
  process.env.NEXT_PUBLIC_API_GATEWAY || 'https://gateway.api.globalfishingwatch.org'
const API_TOKEN = process.env.NEXT_GFW_API_KEY
const VESSEL_SEARCH_URL = 'v3/vessels/search'
const VESSEL_SEARCH_DATASETS = ['public-global-vessel-identity:v3.0']

export const Route = createFileRoute('/_auth/')({
  loader: async () => fetchVessels(),
  validateSearch: (search: Record<string, unknown>): TableSearchParams => ({
    search: typeof search.search === 'string' ? search.search : undefined,
    filters:
      typeof search.filters === 'object' && search.filters !== null
        ? (search.filters as Record<string, string | string[]>)
        : undefined,
  }),
  component: Home,
})

function Home() {
  const vessels: Vessel[] = Route.useLoaderData()
  const { t } = useTranslation()

  const { filteredData } = useTableFilters(vessels, undefined, {
    syncWithUrl: true,
    debounceMs: 300,
  })

  const handleExpandRow = async (row: Vessel) => {
    const { name, imo, mmsi } = row
    const query = `query=${name || imo || mmsi}`
    const params = {
      datasets: VESSEL_SEARCH_DATASETS,
    }
    const url = `${GFW_API_URL}/${VESSEL_SEARCH_URL}?${query}&${stringify(params, { arrayFormat: 'indices' })}`
    const response = await fetch(url)
    return response.json()
  }

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden">
      <SidebarHeader>
        <Search data={vessels} />
        <OptionsMenu />
        <Profile
          user={{
            id: 1,
            type: 'user',
            groups: ['admin', 'analyst'],
            permissions: [MOCK_USER_PERMISSION],
            email: 'user@example.com',
            firstName: 'John',
            lastName: 'Doe',
          }}
        />
      </SidebarHeader>
      <div className="flex-1 overflow-auto">
        <DynamicTable data={filteredData} onExpandRow={handleExpandRow} />
        <Footer downloadClick={() => console.log('Download clicked')}>
          {t('footer.results', `${filteredData.length} results`, { count: filteredData.length })}
        </Footer>
      </div>
    </div>
  )
}
