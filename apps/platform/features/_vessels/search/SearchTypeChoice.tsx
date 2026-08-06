import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import type { ChoiceOption } from '@globalfishingwatch/ui-components'
import { Choice } from '@globalfishingwatch/ui-components'

import type { SearchType } from 'features/_vessels/search/search.config'
import {
  CALLSIGN_MIN_LENGTH,
  EMPTY_SEARCH_FILTERS,
  IMO_LENGTH,
  SSVID_LENGTH,
} from 'features/_vessels/search/search.config'
import {
  selectSearchOption,
  selectSearchQuery,
} from 'features/_vessels/search/search.config.selectors'
import { useSearchFiltersConnect } from 'features/_vessels/search/search.hook'
import { cleanVesselSearchResults } from 'features/_vessels/search/search.slice'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { useReplaceQueryParams } from 'router/routes.hook'

function SearchTypeChoice({ className }: { className?: string }) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { replaceQueryParams } = useReplaceQueryParams()
  const activeSearchOption = useSelector(selectSearchOption)
  const searchQuery = useSelector(selectSearchQuery)
  const { searchFilters } = useSearchFiltersConnect()

  const searchOptions: ChoiceOption<SearchType>[] = useMemo(() => {
    return [
      {
        id: 'basic' as SearchType,
        label: t((t) => t.search.basic),
      },
      {
        id: 'advanced' as SearchType,
        label: t((t) => t.search.advanced),
      },
    ]
  }, [t])

  const onSearchOptionChange = (option: ChoiceOption<SearchType>) => {
    trackEvent({
      category: TrackCategory.SearchVessel,
      action: 'Toggle search type to filter results',
      label: option.id,
    })
    let additionalParams = {}
    if (option.id === 'advanced') {
      if (searchQuery?.length === SSVID_LENGTH && !isNaN(Number(searchQuery))) {
        additionalParams = { ssvid: searchQuery }
      } else if (searchQuery?.length === IMO_LENGTH && !isNaN(Number(searchQuery))) {
        additionalParams = { imo: searchQuery }
      } else if (searchQuery?.length >= CALLSIGN_MIN_LENGTH && /^[A-Z0-9]+$/.test(searchQuery)) {
        additionalParams = { callsign: searchQuery }
      } else {
        additionalParams = { query: searchQuery }
      }
    } else {
      if (searchQuery || searchFilters.ssvid || searchFilters.imo) {
        additionalParams = {
          query: searchQuery || searchFilters.ssvid || searchFilters.imo,
        }
      }
    }
    dispatch(cleanVesselSearchResults())
    replaceQueryParams({ searchOption: option.id, ...EMPTY_SEARCH_FILTERS, ...additionalParams })
  }

  return (
    <Choice
      options={searchOptions}
      activeOption={activeSearchOption}
      onSelect={onSearchOptionChange}
      size="medium"
      className={className}
    />
  )
}

export default SearchTypeChoice
