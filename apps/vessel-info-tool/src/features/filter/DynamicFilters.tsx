import { useTranslation } from 'react-i18next'

import type { SelectOption } from '@globalfishingwatch/ui-components'
import { InputText, MultiSelect } from '@globalfishingwatch/ui-components'

export type FilterType = 'select' | 'text' | 'date' | 'number' | ''

export interface FilterState {
  id: string
  label: string
  type: FilterType
  options?: SelectOption[]
  filteredValue?: any
}

export interface DynamicFiltersProps {
  filters: FilterState[]
  onFilterChange: (filterId: string) => (option: SelectOption) => void
  getSelectedValues: (filterId: string) => string[]
  updateFilterValue: (filterId: string, value: any) => void
  clearColumnFilter: (filterId: string) => void
}

const DynamicFilters = ({
  filters,
  onFilterChange,
  getSelectedValues,
  updateFilterValue,
  clearColumnFilter,
}: DynamicFiltersProps) => {
  const { t } = useTranslation()

  const renderFilter = (filter: FilterState) => {
    switch (filter.type) {
      case 'select':
        return (
          <div key={filter.id} className="flex flex-col">
            <label className="block truncate text-sm mb-1 w-full" title={filter.label}>
              {filter.label}
            </label>
            <MultiSelect
              options={filter.options || []}
              selectedOptions={getSelectedValues(filter.id).map((value) => ({
                id: value,
                label: value,
              }))}
              onSelect={onFilterChange(filter.id)}
              onCleanClick={() => clearColumnFilter(filter.id)}
            />
          </div>
        )

      case 'text':
        return (
          <div key={filter.id} className="flex flex-col">
            <label className="block truncate text-sm mb-1 w-full" title={filter.label}>
              {filter.label}
            </label>
            <InputText
              value={filter.filteredValue || ''}
              onChange={(e) => updateFilterValue(filter.id, e.target.value)}
              type="search"
              placeholder={t('search.typeaValue', 'Type a value')}
            />
          </div>
        )
      //   case 'date':
      //     return (
      //       <InputDate
      //         key={filter.id}
      //         label={filter.label}
      //         value={filterState[filter.id] || ''}
      //         onChange={(value) => handleFilterChange(filter.id, value)}
      //       />
      //     )
      //   case 'range':
      //     return (
      //       <SliderRange
      //         key={filter.id}
      //         thumbsSize="mini"
      //         range={filterState[filter.id] || [0, 100]}
      //         initialRange={filterState[filter.id] || [0, 100]}
      //         step={1}
      //         onChange={(value) => handleFilterChange(filter.id, value)}
      //         showInputs
      //         label={''}
      //         config={{
      //           steps: [],
      //           min: 0,
      //           max: 0,
      //         }}
      //       />
      //     )

      default:
        return null
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {filters.map((filter) => renderFilter(filter))}
    </div>
  )
}

export default DynamicFilters
