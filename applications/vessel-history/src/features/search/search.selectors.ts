import { createSelector } from '@reduxjs/toolkit'
import { RootState } from 'store'
import { selectQueryParam } from 'routes/routes.selectors'

export const getVesselsFound = (state: RootState) => state.search.queries

export const selectSearchMetadata = createSelector(
  [getVesselsFound, selectQueryParam('q')],
  (search, query: string) => {
    return search && search[query] !== undefined ? search[query] : null
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

export const isSearching = createSelector([selectSearchMetadata], (metadata) => {
  return (metadata && metadata.searching) || false
})
