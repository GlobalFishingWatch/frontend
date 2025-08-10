import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { Vessel } from '@/types/vessel.types'
import { IconButton, InputText } from '@globalfishingwatch/ui-components'

import { useTableFilters } from '../../hooks/useTableFilters'
import DynamicFilters from '../filter/DynamicFilters'

interface SearchProps {
  data: Vessel[]
  searchQuery?: string
}

export const Search = ({ data }: SearchProps) => {
  const { t } = useTranslation()

  const {
    filterStates,
    globalSearch,
    updateGlobalSearch,
    clearGlobalSearch,
    handleSelectChange,
    updateFilterValue,
    getSelectedValues,
    clearColumnFilter,
  } = useTableFilters(data, undefined, {
    syncWithUrl: true,
    debounceMs: 300,
  })

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
          onChange={(e) => updateGlobalSearch(e.target.value)}
          value={globalSearch}
          // className={styles.input}
          type="search"
          onCleanButtonClick={clearGlobalSearch}
          placeholder={t('search.placeholderGlobal', 'Search across whole table')}
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
      {isFilterOpen && (
        <DynamicFilters
          filters={filterStates}
          onFilterChange={handleSelectChange}
          getSelectedValues={getSelectedValues}
          updateFilterValue={updateFilterValue}
          clearColumnFilter={clearColumnFilter}
        />
      )}
    </div>
  )
}

export default Search
