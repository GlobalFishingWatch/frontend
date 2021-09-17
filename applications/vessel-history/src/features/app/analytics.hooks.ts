import { useEffect } from 'react'
import { initialize as uaInitialize, set as uaSet, pageview } from 'react-ga'
import { GOOGLE_UNIVERSAL_ANALYTICS_ID, GOOGLE_UNIVERSAL_ANALYTICS_INIT_OPTIONS, IS_PRODUCTION } from 'data/config'

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
}
