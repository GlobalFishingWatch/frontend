import React, { Fragment, useMemo } from 'react'
import { MultiSelect } from '@globalfishingwatch/ui-components'
import { getFlags, getFlagsByIds } from 'utils/flags'
import { UrlDataviewInstance } from 'types'
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
  const flags = useMemo(getFlags, [])
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
