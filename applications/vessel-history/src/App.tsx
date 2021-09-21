import React, { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Home from 'features/home/Home'
import { getLocationType } from 'routes/routes.selectors'
import { PROFILE, SETTINGS } from 'routes/routes'
import { SPLASH_TIMEOUT } from 'data/constants'
import Profile from 'features/profile/Profile'
import Splash from 'features/splash/Splash'
import Settings from 'features/settings/Settings'
import { useUser } from 'features/user/user.hooks'
import { useAnalytics } from 'features/app/analytics.hooks'
import './App.css'

function App() {
  useAnalytics()
  const { loading, logged, authorized } = useUser()
  const [minLoading, setMinLoading] = useState(true)

  // Splash screen is shown at least one second
  useEffect(() => {
    const timer = setTimeout(() => setMinLoading(false), SPLASH_TIMEOUT)
    return () => clearTimeout(timer)
  }, [])

  const locationType = useSelector(getLocationType)

  if (loading || minLoading || !logged || !authorized) {
    return <Splash intro={minLoading} />
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
