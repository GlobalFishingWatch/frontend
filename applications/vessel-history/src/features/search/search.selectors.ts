import { createSelector } from 'reselect'
import { selectQueryParam } from 'routes/routes.selectors'
import { getVesselsFound } from './search.slice'

export const getSearchMetadata = createSelector(
  [getVesselsFound, selectQueryParam('q')],
  (search, query) => {
    return search && search[query] !== undefined ? search[query] : null
  }
)

export const getSearchResults = createSelector([getSearchMetadata], (metadata) => {
  return (metadata && metadata.vessels) || []
})

export const getOffset = createSelector([getSearchMetadata], (metadata) => {
  return (metadata && metadata.offset) || 0
})

export const getTotalResults = createSelector([getSearchMetadata], (metadata) => {
  return (metadata && metadata.total) || 0
})

export const isSearching = createSelector([getSearchMetadata], (metadata) => {
  return (metadata && metadata.searching) || 0
})
