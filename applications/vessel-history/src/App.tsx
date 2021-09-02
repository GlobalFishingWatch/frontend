import React, { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Home from 'features/home/Home'
import { getLocationType } from 'routes/routes.selectors'
import { PROFILE, SETTINGS } from 'routes/routes'
import { SPLASH_TIMEOUT } from 'data/constants'
import Profile from 'features/profile/Profile'
import Splash from 'features/splash/Splash'
import Settings from 'features/settings/Settings'
import { useGFWAuthentication, useReplaceLoginUrl } from 'routes/routes.hook'
import { useAppDispatch } from 'features/app/app.hooks'
import './App.css'
import { fetchUserThunk } from 'features/user/user.slice'

function App(): React.ReactElement {
  useReplaceLoginUrl()
  const dispatch = useAppDispatch()
  const { loading } = useGFWAuthentication()
  const [minLoading, setMinLoading] = useState(true)

  // Splash screen is shown at least one second
  useEffect(() => {
    const timer = setTimeout(() => setMinLoading(false), SPLASH_TIMEOUT)
    return () => clearTimeout(timer)
  }, [])

  const locationType = useSelector(getLocationType)

  useEffect(() => {
    dispatch(fetchUserThunk())
  }, [dispatch])

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
