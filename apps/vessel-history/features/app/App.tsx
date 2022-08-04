import React, { Suspense, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { getLocationType, isOfflineForced } from 'routes/routes.selectors'
import { PROFILE, REPORT, SETTINGS } from 'routes/routes'
import { SPLASH_TIMEOUT } from 'data/constants'
import Home from 'features/home/Home'
import Profile from 'features/profile/Profile'
import Splash from 'features/splash/Splash'
import Settings from 'features/settings/Settings'
import { useUser } from 'features/user/user.hooks'
import { useAnalytics } from 'features/app/analytics.hooks'
import { useReplaceLoginUrl } from 'routes/routes.hook'

function App() {
  useAnalytics()
  useReplaceLoginUrl()
  const { loading, logged, authorized } = useUser()
  const [minLoading, setMinLoading] = useState(true)
  const locationType = useSelector(getLocationType)
  const forceOffline = useSelector(isOfflineForced)

  // Splash screen is shown at least one second
  useEffect(() => {
    const timer = setTimeout(() => setMinLoading(false), SPLASH_TIMEOUT)
    return () => clearTimeout(timer)
  }, [])

  const Component = useMemo(() => {
    if (((loading || minLoading) && !logged && !forceOffline) || (!authorized && !forceOffline)) {
      return <Splash intro={minLoading} />
    }
    if (locationType === SETTINGS) {
      return <Settings />
    }
    if (locationType === PROFILE) {
      return <Profile />
    }
    if (locationType === REPORT) {
      return <Profile print={true} />
    }
    return <Home />
  }, [authorized, loading, locationType, logged, minLoading, forceOffline])

  return <Suspense fallback={null}>{Component}</Suspense>
}

export default App
