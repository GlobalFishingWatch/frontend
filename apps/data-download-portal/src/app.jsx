import React, { Fragment, lazy, Suspense, useEffect, useState } from 'react'
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'

import { GFWAPI } from '@globalfishingwatch/api-client'
import { Footer } from '@globalfishingwatch/ui-components'

import HeaderHtml from './components/header/header.jsx'
import Loader from './components/loader/loader.jsx'
import { useGFWLogin } from './components/login/use-login'
import Login from './pages/login/login.jsx'

import '../../../libs/ui-components/src/base.css'
import styles from './app.module.css'

const Home = lazy(() => import('./pages/home/home'))
const Dataset = lazy(() => import('./pages/dataset/dataset'))
const Report = lazy(() => import('./pages/report/report'))
const basename = process.env.NODE_ENV === 'production' ? '/data-download' : ''

const App = () => {
  const { loading, logged, user } = useGFWLogin(GFWAPI)
  const [trackLogin, setTrackLogin] = useState(true)

  // Set to track login only when the user has logged out
  useEffect(() => {
    if (!logged) {
      setTrackLogin(true)
    }
  }, [logged])

  useEffect(() => {
    if (user && trackLogin) {
      const dataLayer = window['dataLayer'] || []
      dataLayer.push({
        event: 'set',
        user_country: user.country ?? '',
        user_group: user.groups ?? '',
        user_org_type: user.organizationType ?? '',
        user_organization: user.organization ?? '',
        user_language: user.language ?? '',
      })
      dataLayer.push({
        event: 'login',
        eventModel: {
          category: 'user',
        },
      })
      setTrackLogin(false)
    }
  }, [user, trackLogin])

  return logged || loading ? (
    <Fragment>
      <HeaderHtml />

      <div className={styles.container}>
        {loading ? (
          <Loader />
        ) : (
          <div className={styles.column}>
            <Router basename={basename}>
              <Suspense fallback={<Loader />}>
                <Routes>
                  <Route exact path="/" element={<Home />} />
                  <Route path="/datasets/:datasetId" element={<Dataset />} />
                  <Route path="/report/:reportId" element={<Report />} />
                  <Route path="*" element={<Navigate replace to="/" />} />
                </Routes>
              </Suspense>
            </Router>
          </div>
        )}
      </div>
      <Footer />
    </Fragment>
  ) : (
    <Login />
  )
}

export default App
