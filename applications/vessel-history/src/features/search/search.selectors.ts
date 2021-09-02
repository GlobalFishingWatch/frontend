import { createSelector } from '@reduxjs/toolkit'
import { RootState } from 'store'
import {
  selectAdvancedSearchFields,
  selectQueryParam,
  selectSearchType,
} from 'routes/routes.selectors'
import { getSerializedQuery } from './search.thunk'

export const selectVesselsFound = (state: RootState) => state.search.queries

export const selectSearchMetadata = createSelector(
  [selectVesselsFound, selectQueryParam('q'), selectAdvancedSearchFields, selectSearchType],
  (search, query: string, advancedSearch, searchType) => {
    const serializedQuery = getSerializedQuery(
      query,
      searchType === 'advanced' ? advancedSearch : undefined
    )
    return search && search[serializedQuery] !== undefined ? search[serializedQuery] : null
  }
)

export const selectSearchResults = createSelector([selectSearchMetadata], (metadata) => {
  return (metadata && metadata.vessels) || []
})

export const selectSearchOffset = createSelector([selectSearchMetadata], (metadata) => {
  return (metadata && metadata.offset) || 0
})

export const selectSearchTotalResults = createSelector([selectSearchMetadata], (metadata) => {
  return (metadata && metadata.total) || 0
})

export const selectSearching = createSelector([selectSearchMetadata], (metadata) => {
  return (metadata && metadata.searching) || false
})
