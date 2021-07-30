import { useDispatch, useSelector } from 'react-redux'
import {
  selectFilters,
  updateFilters,
  availableEventFilters,
} from './filters.slice'

export const useApplyFiltersConnect = () => {
  const dispatch = useDispatch()
  const filters = useSelector(selectFilters)

  const setFilter = (
    filter: availableEventFilters,
    value: boolean
  ) => {
    const newFilters = {
      ...filters,
      [filter]: value,
    }
    dispatch(updateFilters(newFilters))
  }

  const setDate = (
    filter: 'start' | 'end',
    value: string
  ) => {
    const newFilters = {
      ...filters,
      [filter]: value,
    }
    dispatch(updateFilters(newFilters))
  }

  const resetFilters = () => {
    dispatch(resetFilters())
  }

  return {
    setFilter,
    setDate,
    resetFilters
  }
}
