import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { IconButton, InputText } from '@globalfishingwatch/ui-components'

import type { useTableFilters } from '../../hooks/useTableFilters'
import DynamicFilters from '../filter/DynamicFilters'

interface SearchProps {
  tableFilters: ReturnType<typeof useTableFilters>
  searchQuery?: string
}

export const Search = ({ tableFilters }: SearchProps) => {
  const { t } = useTranslation()

  const {
    filterConfigs,
    handleSelectChange,
    getSelectedValues,
    updateFilterValue,
    clearColumnFilter,
    globalFilter,
    clearGlobalFilter,
    updateGlobalFilter,
  } = tableFilters

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
          onChange={(e) => updateGlobalFilter(e.target.value)}
          value={globalFilter}
          // className={styles.input}
          type="search"
          onCleanButtonClick={clearGlobalFilter}
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
          filters={filterConfigs}
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
