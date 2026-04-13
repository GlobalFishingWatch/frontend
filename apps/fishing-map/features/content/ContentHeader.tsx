import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import type { ChoiceOption } from '@globalfishingwatch/ui-components'
import { IconButton } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import type { SearchType } from 'features/search/search.config'
import {
  CALLSIGN_MIN_LENGTH,
  EMPTY_SEARCH_FILTERS,
  IMO_LENGTH,
  SSVID_LENGTH,
} from 'features/search/search.config'
import { selectSearchQuery } from 'features/search/search.config.selectors'
import { useSearchFiltersConnect } from 'features/search/search.hook'
import { cleanVesselSearchResults } from 'features/search/search.slice'
import { getScrollElement } from 'features/sidebar/sidebar.utils'
import { selectIsGFWUser } from 'features/user/selectors/user.selectors'
import { useReplaceQueryParams } from 'router/routes.hook'
import { selectSidePanelContent } from 'router/routes.selectors'

import styles from './ContentHeader.module.css'

function ContentHeader() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { replaceQueryParams } = useReplaceQueryParams()
  const contentType = useSelector(selectSidePanelContent)

  const isGFWUser = useSelector(selectIsGFWUser)
  const searchQuery = useSelector(selectSearchQuery)
  const { searchFilters } = useSearchFiltersConnect()
  const scrollElement = getScrollElement()

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
    <div className={cx(styles.sticky)}>
      <div className={cx(styles.sidebarHeader)}>
        <h2>{contentType}</h2>
        <IconButton
          icon="close"
          aria-label={t((t) => t.common.close)}
          onClick={() => replaceQueryParams({ sidePanelId: undefined })}
        />
      </div>
    </div>
  )
}

export default ContentHeader
