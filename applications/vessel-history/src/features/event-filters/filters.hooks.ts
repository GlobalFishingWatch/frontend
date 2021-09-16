import { useDispatch, useSelector } from 'react-redux'
import { event as uaEvent } from 'react-ga'
import {
  selectFilters,
  updateFilters,
  availableEventFilters,
} from './filters.slice'

export const useApplyFiltersConnect = () => {
  const dispatch = useDispatch()
  const filters = useSelector(selectFilters)

  const setFilter = (
    tab: 'MAP' | 'ACTIVITY',
    filter: availableEventFilters,
    value: boolean
  ) => {
    const newFilters = {
      ...filters,
      [filter]: value,
    }

    dispatch(updateFilters(newFilters))

    uaEvent({
      category: 'Vessel Detail ACTIVITY or MAP Tab',
      action: 'Click Filter Icon - Event type',
      label: JSON.stringify({ [filter]: value, tab: tab })
    })
  }

  const setDate = (
    tab: 'MAP' | 'ACTIVITY',
    filter: 'start' | 'end',
    value: string
  ) => {
    const newFilters = {
      ...filters,
      [filter]: value,
    }
    dispatch(updateFilters(newFilters))
    uaEvent({
      category: 'Vessel Detail ACTIVITY or MAP Tab',
      action: 'Click Filter Icon - Change dates',
      label: JSON.stringify({ start: newFilters.start, end: newFilters.end, tab: tab })
    })
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
