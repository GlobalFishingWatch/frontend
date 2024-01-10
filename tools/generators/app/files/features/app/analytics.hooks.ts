import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { initialize as uaInitialize, set as uaSet, event as uaEvent, pageview } from 'react-ga'
import { selectUserData } from 'features/user/selectors/user.selectors'
import { GOOGLE_UNIVERSAL_ANALYTICS_INIT_OPTIONS, IS_PRODUCTION } from 'data/config'

const GOOGLE_UNIVERSAL_ANALYTICS_ID = process.env.NEXT_PUBLIC_GOOGLE_UNIVERSAL_ANALYTICS_ID

export const useAnalytics = () => {
  const userData = useSelector(selectUserData)

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
    if (userData && GOOGLE_UNIVERSAL_ANALYTICS_ID) {
      uaSet({
        dimension1: `${userData.id}`,
        dimension3: `${JSON.stringify(userData.groups)}` ?? '',
        dimension4: userData.organizationType ?? '',
        dimension5: userData.organization ?? '',
        dimension6: userData.country ?? '',
        dimension7: userData.language ?? '',
      })
      uaSet({
        userProperties: {
          userId: userData.id,
          userGroup: userData.groups,
          userOrgType: userData.organizationType,
          userOrganization: userData.organization,
          userCountry: userData.country,
          userLanguage: userData.language,
        },
      })
      uaEvent({
        category: 'User',
        action: 'Login',
      })
    }
  }, [userData])
}
