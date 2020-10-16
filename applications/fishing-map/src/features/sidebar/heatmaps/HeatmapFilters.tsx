import React, { Fragment } from 'react'
import { UrlDataviewInstance } from 'types'
import { MultiSelect } from '@globalfishingwatch/ui-components'
import flags, { getFlagsByIds } from 'data/flags'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import styles from './HeatmapFilters.module.css'

type FiltersProps = {
  dataview: UrlDataviewInstance
}

const sourceOptions = [{ id: 'ais', label: 'AIS' }]

function Filters({ dataview }: FiltersProps): React.ReactElement {
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const fishingFilters = dataview.config?.filters
  const fishingFiltersOptions = getFlagsByIds(fishingFilters || [])
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
        selectedOptions={fishingFiltersOptions}
        className={styles.multiSelect}
        onSelect={(filter) => {
          upsertDataviewInstance({
            id: dataview.id,
            config: { filters: [...fishingFilters, filter.id] },
          })
        }}
        onRemove={(filter, rest) => {
          console.log(rest)
          upsertDataviewInstance({
            id: dataview.id,
            config: { filters: rest.map((f) => f.id) },
          })
        }}
      />
    </Fragment>
  )
}

export default Filters
