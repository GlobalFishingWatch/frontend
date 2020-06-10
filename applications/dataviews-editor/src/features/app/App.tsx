import React, { useState, Fragment, useEffect } from 'react'
import cx from 'classnames'
import { useSelector, useDispatch } from 'react-redux'
import GFWAPI from '@globalfishingwatch/api-client'
import useGFWLogin from '@globalfishingwatch/react-hooks/dist/use-login'
import Dataview from 'features/dataview/Dataview'
import Dataviews from 'features/dataviews/Dataviews'
import Map from 'features/map/Map'
import Timebar from 'features/timebar/Timebar'
import { selectCurrentDataview } from 'features/dataview/dataview.selectors'
import { fetchDataviews, selectLoading } from 'features/dataviews/dataviews.slice'
import styles from './App.module.css'

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchDataviews())
  }, [dispatch])

  const [dataviewsMinimized, toggleDataviews] = useState(false)
  const [dataviewMinimized, toggleDataview] = useState(false)
  const currentDataview = useSelector(selectCurrentDataview)

  const dataviewsLoading = useSelector(selectLoading)

  const { loading, logged } = useGFWLogin(GFWAPI)
  if (!loading && !logged) {
    window.location.href = GFWAPI.getLoginUrl(window.location.toString())
  } else if (loading) {
    return <div>loading</div>
  }

  return (
    <div className={cx(styles.app, { [styles.loading]: dataviewsLoading })}>
      <div
        className={cx(styles.column, styles.dataviews, { [styles.minimized]: dataviewsMinimized })}
      >
        <h1
          onClick={() => {
            toggleDataviews(!dataviewsMinimized)
          }}
        >
          Dataviews
        </h1>
        {!dataviewsMinimized && (
          <Fragment>
            <Dataviews />
          </Fragment>
        )}
      </div>
      <div
        className={cx(styles.column, styles.dataview, { [styles.minimized]: dataviewMinimized })}
      >
        <h1
          onClick={() => {
            toggleDataview(!dataviewMinimized)
          }}
        >
          Dataview: {currentDataview && currentDataview.name}
        </h1>
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
