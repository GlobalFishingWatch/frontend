import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { Route } from '@/routes/_auth/index'
import type { FilterState, Vessel } from '@/types/vessel.types'
import { generateFilterConfigs } from '@/utils/filters.gen'
import type { MultiSelectOption } from '@globalfishingwatch/api-client'
import { InputText, MultiSelect, SliderRange } from '@globalfishingwatch/ui-components'

const DynamicFilters = ({ originalData }: { originalData: Vessel[] }) => {
  const { t } = useTranslation()
  const filterConfigs = useMemo(() => generateFilterConfigs(originalData), [originalData])
  const navigate = Route.useNavigate()
  const searchQuery = Route.useSearch()

  const getSelectedValues = (id: string) => {
    if (!searchQuery.columnFilters) return []
    const value = searchQuery.columnFilters.find((filter) => filter.id === id)?.value
    if (!value) return []
    return Array.isArray(value) ? value : [value]
  }

  const updateFilterValue = (id: string, value: any) => {
    navigate({
      search: (prev) => {
        if (!prev.columnFilters) return { ...prev, columnFilters: [{ id, value }] }
        if (prev.columnFilters.find((filter) => filter.id === id)?.value === value) return prev
        return {
          ...prev,
          columnFilters: [
            ...prev.columnFilters.filter((filter) => filter.id !== id),
            { id, value },
          ],
        }
      },
    })
  }

  const onFilterChange = (id: string, option: MultiSelectOption) => {
    navigate({
      search: (prev) => {
        if (!prev.columnFilters) return { ...prev, columnFilters: [{ id, value: option.label }] }

        if (prev.columnFilters.find((filter) => filter.id === id)?.value === option.label)
          return prev
        return {
          ...prev,
          columnFilters: [
            ...prev.columnFilters.filter((filter) => filter.id !== id),
            { id, value: typeof option.label === 'string' ? option.label : '' },
          ],
        }
      },
    })
  }

  const clearColumnFilter = (id: string): void => {
    navigate({
      search: (prev) => {
        const { columnFilters, ...rest } = prev
        if (columnFilters) {
          return {
            ...rest,
            columnFilters: columnFilters.filter((filter) => filter.id !== id),
          }
        }
        return rest
      },
    })
  }

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
              onSelect={(option) => onFilterChange(filter.id, option)}
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
              value={getSelectedValues(filter.id)[0] || ''}
              onChange={(e) => updateFilterValue(filter.id, e.target.value)}
              type="search"
              placeholder={t('search.typeaValue', 'Type a value')}
              onCleanButtonClick={() => clearColumnFilter(filter.id)}
            />
          </div>
        )

      case 'number':
        return (
          filter.numberConfig && (
            <div key={filter.id} className="flex flex-col">
              <label className="block truncate text-sm mb-1 w-full" title={filter.label}>
                {filter.label}
              </label>
              <SliderRange
                initialRange={[filter.numberConfig.min, filter.numberConfig.max]}
                onChange={(value) => updateFilterValue(filter.id, value)}
                config={filter.numberConfig}
                thumbsSize="mini"
                showInputs
              />
            </div>
          )
        )
      default:
        return null
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {filterConfigs.map((filter) => renderFilter(filter))}
    </div>
  )
}

export default DynamicFilters
