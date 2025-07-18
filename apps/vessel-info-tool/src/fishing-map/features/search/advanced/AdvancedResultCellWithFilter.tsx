import { useCallback } from 'react'

import type { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { IconButton } from '@globalfishingwatch/ui-components'

import { useSearchFiltersConnect } from 'features/search/search.hook'
import type { VesselSearchState } from 'features/search/search.types'
import type { IdentityVesselData } from 'features/vessel/vessel.slice'
import type { VesselIdentityProperty } from 'features/vessel/vessel.utils'
import { getVesselProperty } from 'features/vessel/vessel.utils'

import styles from '../basic/SearchBasicResult.module.css'

const MULTIPLE_SELECTION_FILTERS_COLUMN = ['flag', 'shiptypes', 'geartypes', 'owner']

type AdvancedResultCellWithFilterProps = {
  vessel: IdentityVesselData
  column: VesselIdentityProperty
  children: React.ReactNode
  identitySource?: VesselIdentitySourceEnum
  onClick?: (params: { query?: string; filters?: VesselSearchState }) => void
}

function AdvancedResultCellWithFilter({
  vessel,
  column,
  children,
  identitySource,
  onClick,
}: AdvancedResultCellWithFilterProps) {
  const { setSearchFilters, searchFilters } = useSearchFiltersConnect()
  const value = getVesselProperty(vessel, column, { identitySource }) as string
  const onFilterClick = useCallback(() => {
    let filter: string | string[] = value
    if (MULTIPLE_SELECTION_FILTERS_COLUMN.includes(column)) {
      filter = column === 'owner' ? value.split(', ') : Array.isArray(value) ? value : [value]
    }
    setSearchFilters({ [column]: filter })
    if (onClick) {
      onClick({
        filters: { ...searchFilters, [column]: filter },
      })
    }
  }, [column, onClick, searchFilters, setSearchFilters, value])

  const showFilter = value && !(searchFilters as any)[column]?.includes(value)

  if (!showFilter) return children

  return (
    <div className={styles.cellFilter}>
      {value && (
        <IconButton
          className={styles.cellFilterBtn}
          size="small"
          onClick={onFilterClick}
          icon="filter-off"
        />
      )}
      {children}
    </div>
  )
}

export default AdvancedResultCellWithFilter
