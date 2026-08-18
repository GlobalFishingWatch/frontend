import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { getVesselIdentifierType } from '@globalfishingwatch/data-transforms'
import type { ChoiceOption } from '@globalfishingwatch/ui-components'
import { Choice } from '@globalfishingwatch/ui-components'

import type { SearchType } from 'features/_vessels/search/search.config'
import { EMPTY_SEARCH_FILTERS } from 'features/_vessels/search/search.config'
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
      const identifierType = getVesselIdentifierType(searchQuery)
      additionalParams = identifierType ? { [identifierType]: searchQuery } : { query: searchQuery }
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
