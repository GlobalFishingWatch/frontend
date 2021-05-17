import React, { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import GFWAPI from '@globalfishingwatch/api-client'
import useGFWLogin from '@globalfishingwatch/react-hooks/dist/use-login'
import Home from 'features/home/Home'
import { getLocationType } from 'routes/routes.selectors'
import { PROFILE, SETTINGS } from 'routes/routes'
import { BASE_URL, SPLASH_TIMEOUT } from 'data/constants'
import Profile from 'features/profile/Profile'
import Splash from 'features/splash/Splash'
import './App.css'
import Settings from 'features/settings/Settings'

function App() {
  const { loading, logged } = useGFWLogin(GFWAPI)
  const [minLoading, setMinLoading] = useState(true)
  if (!loading && !logged) {
    const location = window.location.origin + BASE_URL
    window.location.assign(GFWAPI.getLoginUrl(location))
  }

  // Splash screen is shown at least one second
  useEffect(() => {
    const timer = setTimeout(() => setMinLoading(false), SPLASH_TIMEOUT)
    return () => clearTimeout(timer)
  }, [])

  const locationType = useSelector(getLocationType)

  if (loading || minLoading) {
    return <Splash />
  }
  if (locationType === SETTINGS) {
    return <Settings />
  }
  if (locationType === PROFILE) {
    return <Profile />
  }
  return (
    <Fragment>
      <Home />
    </Fragment>
  )
}

export default App
