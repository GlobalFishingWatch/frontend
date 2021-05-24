import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { initialize as uaInitialize, set as uaSet, event as uaEvent } from 'react-ga'
import { selectUserData } from 'features/user/user.slice'
import { GOOGLE_UNIVERSAL_ANALYTICS_INIT_OPTIONS } from 'data/config'

const GOOGLE_UNIVERSAL_ANALYTICS_ID = process.env.REACT_APP_GOOGLE_UNIVERSAL_ANALYTICS_ID

export const useAnalytics = () => {
  const userData = useSelector(selectUserData)

  useEffect(() => {
    if (GOOGLE_UNIVERSAL_ANALYTICS_ID) {
      uaInitialize(GOOGLE_UNIVERSAL_ANALYTICS_ID, {
        ...GOOGLE_UNIVERSAL_ANALYTICS_INIT_OPTIONS,
      })
      uaSet({
        dimension1: 'userId',
        dimension3: 'userGroup',
        dimension4: 'userOrgType',
        dimension5: 'userOrganization',
        dimension6: 'userCountry',
        dimension7: 'userLanguage',
      })
      // Uncomment to prevent sending hits in non-production envs
      // if (!IS_PRODUCTION) {
      //   uaSet({ sendHitTask: null })
      // }
    }
  }, [])

  useEffect(() => {
    if (userData && GOOGLE_UNIVERSAL_ANALYTICS_ID) {
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
