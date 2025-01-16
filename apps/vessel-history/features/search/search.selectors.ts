import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from 'store'

import { selectAdvancedSearchFields, selectQueryParam } from 'routes/routes.selectors'

import { getSerializedQuery } from './search.thunk'

export const selectVesselsFound = (state: RootState) => state.search.queries
export const selectSearchError = (state: RootState) => state.search.error
export const selectSearchSources = (state: RootState) => state.search.sources

export const selectSearchMetadata = createSelector(
  [selectVesselsFound, selectQueryParam('q'), selectAdvancedSearchFields],
  (search, query: string, advancedSearch) => {
    const serializedQuery = getSerializedQuery(query, advancedSearch)
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
