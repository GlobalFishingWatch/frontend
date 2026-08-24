import { Fragment } from 'react'

import SearchBasicResult from 'features/_vessels/search/basic/SearchBasicResult'
import { getSearchVesselId } from 'features/_vessels/search/search.utils'
import type { IdentityVesselData } from 'features/_vessels/vessel/vessel.slice'

type SearchBasicResultListProps = {
  searchResults: IdentityVesselData[]
  highlightedIndex: number
  setHighlightedIndex: (index: number) => void
  vesselsSelected: IdentityVesselData[]
  highlightQuery: string
}

function SearchBasicResultList({
  searchResults,
  highlightedIndex,
  setHighlightedIndex,
  vesselsSelected,
  highlightQuery,
}: SearchBasicResultListProps) {
  return (
    <Fragment>
      {searchResults?.map((vessel, index: number) => {
        return (
          <SearchBasicResult
            key={getSearchVesselId(vessel)}
            vessel={vessel}
            index={index}
            highlighted={highlightedIndex === index}
            setHighlightedIndex={setHighlightedIndex}
            vesselsSelected={vesselsSelected}
            highlightQuery={highlightQuery}
          />
        )
      })}
    </Fragment>
  )
}

export default SearchBasicResultList
