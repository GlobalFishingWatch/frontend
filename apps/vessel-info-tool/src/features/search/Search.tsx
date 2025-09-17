import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Route } from '@/routes/_auth/index'
import type { Vessel } from '@/types/vessel.types'
import { IconButton, InputText } from '@globalfishingwatch/ui-components'

import DynamicFilters from '../filter/DynamicFilters'

export const Search = ({ data }: { data: Vessel[] }) => {
  const { t } = useTranslation()
  const searchQuery = Route.useSearch()

  const [localValue, setLocalValue] = useState(searchQuery?.globalSearch || undefined)

  const navigate = Route.useNavigate()

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localValue !== searchQuery?.globalSearch) {
        navigate({
          search: (prev) => ({
            ...prev,
            globalSearch: localValue,
          }),
        })
      }
    }, 200)

    return () => clearTimeout(handler)
  }, [localValue])

  const [isFilterOpen, setIsFilterOpen] = useState(false)

  return (
    <div
      className={
        isFilterOpen
          ? 'absolute flex flex-col top-0 left-0 w-full !bg-white !px-12 !pt-4 !pb-12 shadow-md !z-10 gap-6'
          : 'w-full'
      }
    >
      <div className="flex gap-6 w-full justify-center align-center">
        <InputText
          className={isFilterOpen ? 'w-full' : 'w-[70%]'}
          onChange={(e) => setLocalValue(e.target.value)}
          value={localValue}
          type="search"
          onCleanButtonClick={() => setLocalValue(undefined)}
          placeholder={t('search.placeholderGlobal', 'Search all data..')}
        />
        {isFilterOpen ? (
          <IconButton type="solid" icon="close" onClick={() => setIsFilterOpen(!isFilterOpen)} />
        ) : (
          <IconButton
            type="solid"
            icon="filter-off"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          />
        )}
      </div>
      {isFilterOpen && <DynamicFilters originalData={data} />}
    </div>
  )
}

export default Search
