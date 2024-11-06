import React from 'react'
import Timebar from '../timebar/Timebar'
import Map from '../map/Map'
import styles from './Main.module.css'

const Main: React.FC = (props): React.ReactElement => {
  return (
    <div className={styles.main}>
      <Map />
      {/* <Timebar /> */}
    </div>
  )
}

export default Main
