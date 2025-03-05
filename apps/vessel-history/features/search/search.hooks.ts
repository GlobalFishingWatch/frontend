import { useCallback, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import { TrackCategory,trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { fetchUserThunk } from 'features/user/user.slice'
import { selectAdvancedSearchFields, selectUrlQuery } from 'routes/routes.selectors'

import { fetchData, fetchVesselSearchThunk } from './search.thunk'

// Maximum number of vessels that can be merged, I set 300 to not change the code in the case we need to rollback
const LIMIT_VESSELS_MERGE_TO = 300

export const useSearchResultsConnect = () => {
  const [selectedVessels, setSelectedVessels] = useState<number[]>([])
  const isVesselsMergeEnabled = useMemo(
    () => selectedVessels.length < LIMIT_VESSELS_MERGE_TO,
    [selectedVessels.length]
  )

  const onVesselClick = useCallback(
    (index) => () => {
      if (selectedVessels.includes(index)) {
        setSelectedVessels(selectedVessels.filter((i) => index !== i))
      } else if (isVesselsMergeEnabled) {
        trackEvent({
          category: TrackCategory.SearchVesselVV,
          action: 'Select vessel from result list',
          label: JSON.stringify({ position: index }),
        })
        setSelectedVessels([...selectedVessels, index])
      }
    },
    [isVesselsMergeEnabled, selectedVessels]
  )

  return {
    isVesselsMergeEnabled,
    selectedVessels,
    setSelectedVessels,
    onVesselClick,
  }
}

type useSearchConnectParams = {
  onNewSearch?: () => void
}
const defaultParams = {
  onNewSearch: () => {},
}

export const useSearchConnect = (params: useSearchConnectParams = defaultParams) => {
  const { onNewSearch = () => {} } = params
  const dispatch = useAppDispatch()
  const query = useSelector(selectUrlQuery)
  const advancedSearch = useSelector(selectAdvancedSearchFields)

  const promiseRef = useRef<any>(undefined)

  const fetchResults = useCallback(
    (offset = 0) => {
      if (promiseRef.current) {
        promiseRef.current.abort()
      }
      if (offset === 0) {
        onNewSearch()
      }
      // To ensure the pending action isn't overwritted by the abort above
      // and we miss the loading intermediate state
      setTimeout(() => {
        // Ensure user is logged in before searching
        dispatch(fetchUserThunk())
        promiseRef.current = dispatch(
          fetchVesselSearchThunk({
            query,
            offset,
            advancedSearch,
          })
        )
      }, 100)
    },
    [onNewSearch, dispatch, query, advancedSearch]
  )

  /**
   * find a vessel by name, flag and mmsi using advance search and try to match the id
   */
  const findVessel = useCallback(
    async (id, name, flag, ssvid) => {
      // Ensure user is logged in before searching
      dispatch(fetchUserThunk())
      const vesselsFound = await fetchData(name, 0, null, {
        mmsi: ssvid,
        flags: [flag],
      })
      return vesselsFound?.vessels.find((vessel) => vessel.id === id)
    },
    [dispatch]
  )

  return {
    query,
    advancedSearch,
    fetchResults,
    findVessel,
  }
}
