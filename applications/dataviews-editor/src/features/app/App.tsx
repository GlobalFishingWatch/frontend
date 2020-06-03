import React, { useState, Fragment } from 'react'
import cx from 'classnames'
import styles from './App.module.css'
import Dataviews from 'features/dataviews/Dataviews'
import Dataview from 'features/dataview/Dataview'
import Map from 'features/map/Map'
import Timebar from 'features/timebar/Timebar'

const App = () => {
  const [dataviewsMinimized, toggleDataviews] = useState(false)
  const [dataviewMinimized, toggleDataview] = useState(false)
  // console.log(dataviews, 'lol')
  return (
  <div className={styles.app}>
    <div className={cx(styles.column, styles.dataviews, { [styles.minimized]: dataviewsMinimized })}>
      <h1 onClick={() => { toggleDataviews(!dataviewsMinimized) }}>Dataviews</h1>
      {!dataviewsMinimized && (
        <Fragment>
          <Dataviews />
        </Fragment>
      )}
    </div>
    <div className={cx(styles.column, styles.dataview, { [styles.minimized]: dataviewMinimized })}>
      <h1 onClick={() => { toggleDataview(!dataviewMinimized) }}>Dataview</h1>
      {!dataviewMinimized && (
        <Fragment>
          <Dataview />
        </Fragment>
      )}
    </div>
    <div className={styles.map}>
      <Map />
    </div>
    <div className={styles.timebar}>
      <Timebar />
    </div>
  </div>
  )
}

export default App