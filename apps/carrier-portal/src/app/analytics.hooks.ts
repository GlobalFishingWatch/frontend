import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { initialize as uaInitialize, set as uaSet, pageview, event as uaEvent } from 'react-ga'
import {
  GOOGLE_UNIVERSAL_ANALYTICS_ID,
  GOOGLE_UNIVERSAL_ANALYTICS_INIT_OPTIONS,
  IS_PRODUCTION,
} from 'data/constants'
import { getUserData } from 'redux-modules/user/user.selectors'

export const useAnalytics = () => {
  useEffect(() => {
    if (GOOGLE_UNIVERSAL_ANALYTICS_ID) {
      uaInitialize(GOOGLE_UNIVERSAL_ANALYTICS_ID, {
        ...GOOGLE_UNIVERSAL_ANALYTICS_INIT_OPTIONS,
      })
      // Uncomment to prevent sending hits in non-production envs
      if (!IS_PRODUCTION) {
        uaSet({ sendHitTask: null })
      }
    }
  }, [])

  useEffect(() => {
    if (GOOGLE_UNIVERSAL_ANALYTICS_ID) {
      pageview(window.location.pathname + window.location.search)
    }
  }, [])
  const user = useSelector(getUserData)
  const [trackLogin, setTrackLogin] = useState(true)

  // Set to track login only when the user has logged out
  useEffect(() => {
    setTrackLogin(true)
  }, [])

  useEffect(() => {
    if (user && GOOGLE_UNIVERSAL_ANALYTICS_ID && trackLogin) {
      uaSet({
        dimension1: `${user.id}`,
        dimension3: `${JSON.stringify(user.groups)}` ?? '',
        dimension4: user.organizationType ?? '',
        dimension5: user.organization ?? '',
        dimension6: user.country ?? '',
        dimension7: user.language ?? '',
      })
      uaSet({
        userProperties: {
          userId: user.id,
          userGroup: user.groups,
          userOrgType: user.organizationType,
          userOrganization: user.organization,
          userCountry: user.country,
          userLanguage: user.language,
        },
      })
      uaEvent({
        category: 'User',
        action: 'Login',
      })
      setTrackLogin(false)
    }
  }, [user, trackLogin])
}
