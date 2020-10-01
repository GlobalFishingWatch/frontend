import React from 'react'
import { Icon } from '@globalfishingwatch/ui-components'
import vesselImage from 'assets/images/vessel@2x.png'
import styles from './SearchEmptyState.module.css'

function SearchEmptyState() {
  return (
    <div className={styles.emptyState}>
      <div>
        <img src={vesselImage} alt="vessel" className={styles.vesselImage} />
        <p>Search by vessel name or identification code (IMO, MMSI, VMS ID, etc…)</p>
        <p>
          You can narrow your search pressing the filter icon (
          {<Icon className={styles.inlineIcon} icon="filter-off" />}) in the top bar or writing
          filters like:
        </p>
        <p>
          <code>flag:china,japan,spain</code>
        </p>
        <p>
          <code>active-after:2017/03/01</code>
        </p>
        <p>
          <code>active-before:2018/01/01</code>
        </p>
        <p>
          <code>source:AIS</code>
        </p>
      </div>
    </div>
  )
}

export default SearchEmptyState
