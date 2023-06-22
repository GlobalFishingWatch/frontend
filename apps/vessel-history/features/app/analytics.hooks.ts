import { useEffect, useState } from 'react'
import { initialize as uaInitialize, set as uaSet, pageview, event as uaEvent } from 'react-ga'
import {
  GOOGLE_TAG_MANAGER_ID,
  GOOGLE_UNIVERSAL_ANALYTICS_ID,
  GOOGLE_UNIVERSAL_ANALYTICS_INIT_OPTIONS,
  IS_PRODUCTION,
} from 'data/config'
import { useUser } from 'features/user/user.hooks'

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
    if (GOOGLE_UNIVERSAL_ANALYTICS_ID || GOOGLE_TAG_MANAGER_ID) {
      pageview(window.location.pathname + window.location.search)
    }
  }, [])
  const { user, logged } = useUser()
  const [trackLogin, setTrackLogin] = useState(true)
  const [trackGTMLogin, setTrackGTMLogin] = useState(true)

  // Set to track login only when the user has logged out
  useEffect(() => {
    !logged && setTrackLogin(true)
    !logged && setTrackGTMLogin(true)
  }, [logged])

  useEffect(() => {
    if (user && GOOGLE_UNIVERSAL_ANALYTICS_ID && trackLogin) {
      uaSet({
        dimension3: `${JSON.stringify(user.groups)}` ?? '',
        dimension4: user.organizationType ?? '',
        dimension5: user.organization ?? '',
        dimension6: user.country ?? '',
        dimension7: user.language ?? '',
      })
      uaSet({
        userProperties: {
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

  useEffect(() => {
    if (user && GOOGLE_TAG_MANAGER_ID && trackGTMLogin && window && window['dataLayer']) {
      const dataLayer = window['dataLayer'] || []
      dataLayer.push({
        event: 'userData',
        user_country: user.country ?? '',
        user_group: user.groups ?? '',
        user_org_type: user.organizationType ?? '',
        user_organization: user.organization ?? '',
        user_language: user.language ?? '',
      })
      setTrackGTMLogin(false)
    }
  }, [user, trackGTMLogin])
}
