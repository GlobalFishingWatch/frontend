import { GetItemPropsOptions } from 'downshift'
import { Fragment } from 'react'
import { VesselWithDatasetsResolved } from 'features/search/search.slice'
import SearchBasicResult from 'features/search/SearchBasicResult'

type SearchBasicResultListProps = {
  searchResults: VesselWithDatasetsResolved[]
  highlightedIndex: number
  setHighlightedIndex: (index: number) => void
  getItemProps: (options: GetItemPropsOptions<VesselWithDatasetsResolved>) => any
  vesselsSelected: VesselWithDatasetsResolved[]
}

function SearchBasicResultList({
  searchResults,
  highlightedIndex,
  setHighlightedIndex,
  getItemProps,
  vesselsSelected,
}: SearchBasicResultListProps) {
  return (
    <Fragment>
      {searchResults?.map((vessel, index: number) => {
        return (
          <SearchBasicResult
            vessel={vessel}
            index={index}
            highlightedIndex={highlightedIndex}
            setHighlightedIndex={setHighlightedIndex}
            getItemProps={getItemProps}
            vesselsSelected={vesselsSelected}
          />
        )
      })}
    </Fragment>
  )
}

export default SearchBasicResultList
