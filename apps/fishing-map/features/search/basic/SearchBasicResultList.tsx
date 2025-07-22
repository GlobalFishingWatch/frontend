import { Fragment } from 'react'
import type { GetItemPropsOptions } from 'downshift'

import SearchBasicResult from 'features/search/basic/SearchBasicResult'
import { getSearchVesselId } from 'features/search/search.utils'
import type { IdentityVesselData } from 'features/vessel/vessel.slice'

type SearchBasicResultListProps = {
  searchResults: IdentityVesselData[]
  highlightedIndex: number
  setHighlightedIndex: (index: number) => void
  getItemProps: (options: GetItemPropsOptions<IdentityVesselData>) => any
  vesselsSelected: IdentityVesselData[]
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
            key={getSearchVesselId(vessel)}
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
