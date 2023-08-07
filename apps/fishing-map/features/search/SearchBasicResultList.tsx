import { GetItemPropsOptions } from 'downshift'
import { Fragment } from 'react'
import { VesselWithDatasets, VesselWithDatasetsMerged } from 'features/search/search.slice'
import SearchBasicResult from 'features/search/SearchBasicResult'

type SearchBasicResultListProps = {
  searchResults: VesselWithDatasets[]
  highlightedIndex: number
  setHighlightedIndex: (index: number) => void
  getItemProps: (options: GetItemPropsOptions<VesselWithDatasetsMerged>) => any
  vesselsSelected: VesselWithDatasetsMerged[]
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
            key={index}
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
