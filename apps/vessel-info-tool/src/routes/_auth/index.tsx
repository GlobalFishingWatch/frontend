import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { createFileRoute } from '@tanstack/react-router'

import { DynamicTable } from '@/features/dynamicTable/DynamicTable'
import Footer from '@/features/footer/Footer'
import SidebarHeader from '@/features/header/SidebarHeader'
import DownloadModal from '@/features/modal/DownloadModal'
import OptionsMenu from '@/features/options/OptionsMenu'
import Profile from '@/features/profile/Profile'
import Search from '@/features/search/Search'
import type { RFMO, TableSearchParams, Vessel } from '@/types/vessel.types'
import { fetchVessels } from '@/utils/vessels'
import { MOCK_USER_PERMISSION } from '@globalfishingwatch/api-types'

export const Route = createFileRoute('/_auth/')({
  loader: async () => fetchVessels(),
  validateSearch: (search: Record<string, unknown>): TableSearchParams => {
    const { selectedRows, rfmo, globalSearch, ...rest } = search
    const baseParams = {
      selectedRows: typeof selectedRows === 'string' ? selectedRows : undefined,
      rfmo: rfmo as RFMO,
      globalSearch: typeof globalSearch === 'string' ? globalSearch : undefined,
    }

    if (Object.keys(rest).length === 0) {
      return baseParams
    }

    return {
      ...baseParams,
      ...Object.fromEntries(
        Object.entries(rest).map(([key, value]) => [
          key,
          Array.isArray(value) ? value.map(String) : String(value),
        ])
      ),
    }
  },
  component: Home,
})

function Home() {
  const vessels: Vessel[] = Route.useLoaderData()
  const { t } = useTranslation()

  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false)

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
        <DynamicTable data={vessels} />
      </div>
      <Footer downloadClick={() => setIsDownloadModalOpen(true)}>
        {t('footer.results', `${vessels.length} results`, { count: vessels.length })}
      </Footer>
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        data={vessels} // change to selected vessels only
      />
    </div>
  )
}
