import React, { Fragment, useState } from 'react'
import { useSelector } from 'react-redux'
import { MultiSelect, MultiSelectOption } from '@globalfishingwatch/ui-components'
import { flags } from 'data/config'
import { selectFishingDatasets } from 'features/workspace/workspace.selectors'
import styles from './Filters.module.css'

function Filters(): React.ReactElement {
  const sources = useSelector(selectFishingDatasets)
  const [sourcesSelected, setSourcesSelected] = useState<any>(
    sources?.length ? sources[0] : undefined
  )

  return (
    <Fragment>
      <MultiSelect
        label="Sources"
        options={sources || ([] as MultiSelectOption[])}
        selectedOptions={sourcesSelected ? [sourcesSelected] : undefined}
        onSelect={(e) => {
          console.log('e', e)
          setSourcesSelected(e)
        }}
        onRemove={(e) => {
          setSourcesSelected(undefined)
        }}
      />
      <MultiSelect
        label="Flag States"
        options={flags}
        selectedOptions={[flags[0]]}
        className={styles.multiSelect}
        onSelect={(e) => {
          console.log(e)
        }}
        onRemove={(e) => {
          console.log(e)
        }}
      />
    </Fragment>
  )
}

export default Filters
