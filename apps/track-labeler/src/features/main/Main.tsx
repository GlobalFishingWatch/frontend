import React from 'react'

import Map from '../map/Map'
import Timebar from '../timebar/Timebar'

import styles from './Main.module.css'

const Main: React.FC = (props): React.ReactElement<any> => {
  return (
    <div className={styles.main}>
      <Map />
      <Timebar />
    </div>
  )
}

export default Main
