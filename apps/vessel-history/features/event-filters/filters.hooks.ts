import { useSelector } from 'react-redux'

import { useAppDispatch } from 'features/app/app.hooks'

import type { availableEventFilters} from './filters.slice';
import { resetFilters,selectFilters, updateFilters } from './filters.slice'

export const useApplyFiltersConnect = () => {
  const dispatch = useAppDispatch()
  const filters = useSelector(selectFilters)

  const setFilter = (filter: availableEventFilters, value: boolean) => {
    const newFilters = {
      ...filters,
      [filter]: value,
    }
    dispatch(updateFilters(newFilters))
  }

  const setDate = (filter: 'start' | 'end', value?: string) => {
    const newFilters = {
      ...filters,
      [filter]: value,
    }
    dispatch(updateFilters(newFilters))
  }

  const dispatchResetFilters = () => {
    dispatch(resetFilters())
  }

  return {
    setFilter,
    setDate,
    resetFilters: dispatchResetFilters,
  }
}
