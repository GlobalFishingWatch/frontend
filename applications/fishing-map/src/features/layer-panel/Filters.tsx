import React, { Fragment, useState } from 'react'
import { MultiSelect } from '@globalfishingwatch/ui-components'
import { sources } from 'data/config'
import styles from './Filters.module.css'

function Filters(): React.ReactElement {
  const [sourcesSelected] = useState([sources[0]])

  return (
    <Fragment>
      <MultiSelect
        label="Sources"
        options={sources}
        selectedOptions={sourcesSelected}
        onSelect={(e) => {
          console.log(e)
        }}
        onRemove={(e) => {
          console.log(e)
        }}
      />
      <MultiSelect
        label="Flag States"
        options={sources}
        selectedOptions={sourcesSelected}
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
