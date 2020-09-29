import React, { Fragment, useState } from 'react'
import { MultiSelect } from '@globalfishingwatch/ui-components'
import { sources } from 'data/config'
import styles from './Filters.module.css'

function Filters(): React.ReactElement {
  const [sourcesSelected, setSourcesSelected] = useState([sources[0]])

  return (
    <Fragment>
      <label className={styles.selectLabel}>Sources</label>
      <MultiSelect
        options={sources}
        selectedOptions={sourcesSelected}
        onSelect={(e) => {
          console.log(e)
        }}
        onRemove={(e) => {
          console.log(e)
        }}
      />
      <label className={styles.selectLabel}>Flag States</label>
      <MultiSelect
        options={sources}
        selectedOptions={sourcesSelected}
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
