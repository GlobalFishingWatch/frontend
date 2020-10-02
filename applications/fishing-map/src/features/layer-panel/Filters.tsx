import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { FishingFilter } from 'types'
import { MultiSelect } from '@globalfishingwatch/ui-components'
import { Dataview } from '@globalfishingwatch/dataviews-client'
import { flags } from 'data/config'
// import { selectFishingDatasets } from 'features/workspace/workspace.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import { selectFishingFilters } from 'routes/routes.selectors'
import styles from './Filters.module.css'

type FiltersProps = {
  dataview: Dataview
}

const sourceOptions = [{ id: 'ais', label: 'AIS' }]

function Filters({ dataview }: FiltersProps): React.ReactElement {
  const { dispatchQueryParams } = useLocationConnect()
  const fishingFilters = useSelector(selectFishingFilters)

  return (
    <Fragment>
      <MultiSelect
        label="Sources"
        options={sourceOptions}
        selectedOptions={sourceOptions}
        onSelect={(e) => {
          console.log(e)
        }}
        onRemove={(e) => {
          console.log(e)
        }}
      />
      <MultiSelect
        label="Flag States"
        options={flags}
        selectedOptions={fishingFilters}
        className={styles.multiSelect}
        onSelect={(filter) => {
          dispatchQueryParams({ fishingFilters: [...fishingFilters, filter as FishingFilter] })
        }}
        onRemove={(filter, rest) => {
          dispatchQueryParams({ fishingFilters: rest as FishingFilter[] })
        }}
      />
    </Fragment>
  )
}

export default Filters
