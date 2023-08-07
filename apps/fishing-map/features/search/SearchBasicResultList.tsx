import { GetItemPropsOptions } from 'downshift'
import { Fragment } from 'react'
import { VesselLastIdentity } from 'features/search/search.slice'
import SearchBasicResult from 'features/search/SearchBasicResult'
import { IdentityVesselData } from 'features/vessel/vessel.slice'

type SearchBasicResultListProps = {
  searchResults: IdentityVesselData[]
  highlightedIndex: number
  setHighlightedIndex: (index: number) => void
  getItemProps: (options: GetItemPropsOptions<VesselLastIdentity>) => any
  vesselsSelected: VesselLastIdentity[]
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
