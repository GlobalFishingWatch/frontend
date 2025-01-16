import React, { Suspense, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import { IS_STANDALONE_APP } from 'data/config'
import { SPLASH_TIMEOUT } from 'data/constants'
import { useAnalytics } from 'features/app/analytics.hooks'
import Home from 'features/home/Home'
import Profile from 'features/profile/Profile'
import Settings from 'features/settings/Settings'
import Splash from 'features/splash/Splash'
import { useUser } from 'features/user/user.hooks'
import { PROFILE, SETTINGS } from 'routes/routes'
import { useReplaceLoginUrl } from 'routes/routes.hook'
import { getLocationType, isOfflineForced } from 'routes/routes.selectors'

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
    if (
      ((loading || minLoading) && !logged && !forceOffline && !IS_STANDALONE_APP) ||
      (!authorized && !forceOffline && !IS_STANDALONE_APP)
    ) {
      return <Splash intro={minLoading} />
    }
    if (locationType === SETTINGS) {
      return <Settings />
    }
    if (locationType === PROFILE) {
      return <Profile />
    }
    return <Home />
  }, [authorized, loading, locationType, logged, minLoading, forceOffline])

  return <Suspense fallback={null}>{Component}</Suspense>
}

export default App
