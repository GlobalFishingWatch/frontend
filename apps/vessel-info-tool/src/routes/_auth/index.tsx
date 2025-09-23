import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { createFileRoute } from '@tanstack/react-router'
import type { ColumnFiltersState } from '@tanstack/react-table'

import { DynamicTable } from '@/features/dynamicTable/DynamicTable'
import Footer from '@/features/footer/Footer'
import Header from '@/features/header/Header'
import DownloadModal from '@/features/modal/DownloadModal'
import OptionsMenu from '@/features/options/OptionsMenu'
import Profile from '@/features/profile/Profile'
import Search from '@/features/search/Search'
import type { RFMO, TableSearchParams } from '@/types/vessel.types'
import { fetchVessels } from '@/utils/vessels'
import { GFWAPI } from '@globalfishingwatch/api-client'

export const Route = createFileRoute('/_auth/')({
  ssr: false,
  loader: async () => {
    const user = await GFWAPI.fetchUser()
    const vessels = await fetchVessels()
    return { user, vessels }
  },
  loaderDeps: () => ({}),
  validateSearch: (search: Record<string, unknown>): Partial<TableSearchParams> => {
    const { selectedRows, rfmo, globalSearch, columnFilters } = search
    return {
      selectedRows: typeof selectedRows === 'string' ? selectedRows : undefined,
      rfmo: typeof rfmo === 'string' ? (rfmo as RFMO) : undefined,
      globalSearch: typeof globalSearch === 'string' ? globalSearch : undefined,
      columnFilters: columnFilters as ColumnFiltersState | undefined,
    }
  },
  component: Home,
})

function Home() {
  const { vessels } = Route.useLoaderData()
  const { t } = useTranslation()

  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false)
  const tableContainerRef = useRef<HTMLDivElement>(null)
  const [containerEl, setContainerEl] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (tableContainerRef.current) {
      setContainerEl(tableContainerRef.current)
    }
  }, [])

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden">
      <Header>
        <Search data={vessels} />
        <OptionsMenu />
        <Profile />
      </Header>
      <div className="flex-1 relative overflow-auto" ref={tableContainerRef}>
        {containerEl && <DynamicTable data={vessels} tableContainerRef={containerEl} />}
      </div>
      <Footer downloadClick={() => setIsDownloadModalOpen(true)}>
        {t('footer.results', `${vessels.length} results`, { count: vessels.length })}
      </Footer>
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        data={vessels}
      />
    </div>
  )
}
