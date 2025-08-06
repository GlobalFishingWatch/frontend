import React, { useCallback,useState } from 'react'

import type {
  SelectOption} from '@globalfishingwatch/ui-components';
import {
  InputDate,
  InputText,
  Select,
  SliderRange,
} from '@globalfishingwatch/ui-components'

export type FilterType = 'select' | 'text' | 'date' | 'number'

export interface FilterConfig {
  id: string
  label: string
  type: FilterType
  options?: SelectOption[]
  defaultValue?: any
}

export interface FilterState {
  [key: string]: any
}

export interface DynamicFiltersProps {
  filters: FilterConfig[]
  onFilterChange: (filters: FilterState) => void
  initialState?: FilterState
  title?: string
}

const DynamicFilters: React.FC<DynamicFiltersProps> = ({
  filters,
  onFilterChange,
  initialState = {},
  title = 'Filters',
}) => {
  const [filterState, setFilterState] = useState<FilterState>(initialState)

  // Handle filter change
  const handleFilterChange = useCallback(
    (option: SelectOption) => {
      const newState = {
        ...filterState,
        [option.id]: option.label,
      }
      setFilterState(newState)
      onFilterChange(newState)
    },
    [filterState, onFilterChange]
  )

  // Render the appropriate filter component based on type
  const renderFilter = (filter: FilterConfig) => {
    switch (filter.type) {
      case 'select':
        return (
          <Select
            key={filter.id}
            label={filter.label}
            options={filter.options || []}
            selectedOption={filterState[filter.id] || ''}
            onSelect={handleFilterChange}
          />
        )

      case 'text':
        return (
          <InputText
            key={filter.id}
            label={filter.label}
            value={filterState[filter.id] || ''}
            // onChange={handleFilterChange}
          />
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
    <div className="p-4 border rounded space-y-4">
      {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filters.map((filter) => renderFilter(filter))}
      </div>
    </div>
  )
}

export default DynamicFilters
